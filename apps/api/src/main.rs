use axum::{
    routing::{get, post, put, delete},
    http::{StatusCode, HeaderValue, Method, HeaderName, header},
    Json, Router, response::IntoResponse, extract::Path,
    response::Response,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::CorsLayer;
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

// グローバルな状態を管理するための構造体
struct AppState {
    todos: Mutex<HashMap<u32, Todo>>,
    next_id: Mutex<u32>,
}

#[tokio::main]
async fn main() {
    // トレーシングの初期化
    tracing_subscriber::fmt::init();

    // 初期データの設定
    let mut todos = HashMap::new();
    todos.insert(1, Todo {
        id: 1,
        title: "Rustを学ぶ".to_string(),
        completed: false,
    });
    todos.insert(2, Todo {
        id: 2,
        title: "Axumを使ってAPIを作る".to_string(),
        completed: true,
    });

    // アプリケーションの状態を作成
    let state = Arc::new(AppState {
        todos: Mutex::new(todos),
        next_id: Mutex::new(3), // 次に使用するID
    });

    // CORSの設定
    let cors = CorsLayer::new()
        .allow_origin([
            "http://localhost:5173".parse::<HeaderValue>().unwrap(),
            "http://localhost:3000".parse::<HeaderValue>().unwrap(),
            "http://127.0.0.1:5173".parse::<HeaderValue>().unwrap(),
            "http://localhost:8080".parse::<HeaderValue>().unwrap(),
            "http://127.0.0.1:8080".parse::<HeaderValue>().unwrap(),
        ])
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([
            HeaderName::from_static("content-type"),
            HeaderName::from_static("authorization"),
            HeaderName::from_static("x-requested-with"),
        ])
        .allow_credentials(true);

    // ルーターの設定
    let app = Router::new()
        .route("/", get(root))
        .route("/api/hello", get(hello))
        .route("/api/todos", get(get_todos))
        .route("/api/todos", post(create_todo))
        .route("/api/todos/:id", get(get_todo_by_id))
        .route("/api/todos/:id", put(update_todo))
        .route("/api/todos/:id", delete(delete_todo))
        .with_state(state)
        .layer(cors);

    // サーバーの起動
    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    tracing::info!("Server listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// ルートハンドラー
async fn root() -> &'static str {
    "Rust API Server is running!"
}

// Helloハンドラー
async fn hello() -> Json<HelloResponse> {
    Json(HelloResponse {
        message: "Hello from Rust API!".to_string(),
    })
}

// TODOの取得ハンドラー
async fn get_todos(
    state: axum::extract::State<Arc<AppState>>,
) -> impl IntoResponse {
    let todos_lock = state.todos.lock().unwrap();
    let todos: Vec<Todo> = todos_lock.values().cloned().collect();
    
    let json = Json(todos);
    
    // レスポンスヘッダーにContent-Typeを設定
    let mut headers = axum::http::HeaderMap::new();
    headers.insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("application/json; charset=utf-8"),
    );
    
    (headers, json)
}

// TODOの作成ハンドラー
async fn create_todo(
    state: axum::extract::State<Arc<AppState>>,
    Json(payload): Json<CreateTodo>,
) -> impl IntoResponse {
    let mut next_id = state.next_id.lock().unwrap();
    let id = *next_id;
    *next_id += 1;

    let todo = Todo {
        id,
        title: payload.title,
        completed: false,
    };

    // 新しいTodoを保存
    let mut todos = state.todos.lock().unwrap();
    todos.insert(id, todo.clone());

    let json = Json(todo);
    
    // レスポンスヘッダーにContent-Typeを設定
    let mut headers = axum::http::HeaderMap::new();
    headers.insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("application/json; charset=utf-8"),
    );
    
    (StatusCode::CREATED, headers, json)
}

// 個別のTODOを取得するハンドラー
async fn get_todo_by_id(
    state: axum::extract::State<Arc<AppState>>,
    Path(id): Path<u32>,
) -> Response {
    tracing::info!("GET /api/todos/{} リクエストを受信", id);
    
    let todos = state.todos.lock().unwrap();
    
    if let Some(todo) = todos.get(&id) {
        tracing::info!("Todo ID {} が見つかりました", id);
        let json = Json(todo.clone());
        
        // レスポンスヘッダーにContent-Typeを設定
        let mut headers = axum::http::HeaderMap::new();
        headers.insert(
            header::CONTENT_TYPE,
            HeaderValue::from_static("application/json; charset=utf-8"),
        );
        
        (StatusCode::OK, headers, json).into_response()
    } else {
        tracing::warn!("Todo ID {} が見つかりませんでした", id);
        // Todoが見つからない場合は404を返す
        let error_json = Json(ErrorResponse {
            message: format!("Todo with id {} not found", id),
        });
        
        (StatusCode::NOT_FOUND, error_json).into_response()
    }
}

// TODOの更新ハンドラー
async fn update_todo(
    state: axum::extract::State<Arc<AppState>>,
    Path(id): Path<u32>,
    Json(payload): Json<UpdateTodo>,
) -> Response {
    let mut todos = state.todos.lock().unwrap();
    
    match todos.get_mut(&id) {
        Some(todo) => {
            // タイトルが提供されていれば更新
            if let Some(title) = payload.title {
                todo.title = title;
            }
            
            // 完了状態が提供されていれば更新
            if let Some(completed) = payload.completed {
                todo.completed = completed;
            }
            
            let json = Json(todo.clone());
            
            // レスポンスヘッダーにContent-Typeを設定
            let mut headers = axum::http::HeaderMap::new();
            headers.insert(
                header::CONTENT_TYPE,
                HeaderValue::from_static("application/json; charset=utf-8"),
            );
            
            (StatusCode::OK, headers, json).into_response()
        },
        None => {
            // Todoが見つからない場合は404を返す
            let error_json = Json(ErrorResponse {
                message: format!("Todo with id {} not found", id),
            });
            
            let mut headers = axum::http::HeaderMap::new();
            headers.insert(
                header::CONTENT_TYPE,
                HeaderValue::from_static("application/json; charset=utf-8"),
            );
            
            (StatusCode::NOT_FOUND, headers, error_json).into_response()
        }
    }
}

// TODOの削除ハンドラー
async fn delete_todo(
    state: axum::extract::State<Arc<AppState>>,
    Path(id): Path<u32>,
) -> Response {
    let mut todos = state.todos.lock().unwrap();
    
    if todos.remove(&id).is_some() {
        // 削除成功
        StatusCode::NO_CONTENT.into_response()
    } else {
        // Todoが見つからない場合は404を返す
        let error_json = Json(ErrorResponse {
            message: format!("Todo with id {} not found", id),
        });
        
        (StatusCode::NOT_FOUND, error_json).into_response()
    }
}

// レスポンス型
#[derive(Serialize)]
struct HelloResponse {
    message: String,
}

// エラーレスポンス型
#[derive(Serialize)]
struct ErrorResponse {
    message: String,
}

// Todo型
#[derive(Serialize, Deserialize, Clone)]
struct Todo {
    id: u32,
    title: String,
    completed: bool,
}

// Todo作成リクエスト型
#[derive(Deserialize)]
struct CreateTodo {
    title: String,
}

// Todo更新リクエスト型
#[derive(Deserialize)]
struct UpdateTodo {
    title: Option<String>,
    completed: Option<bool>,
}
