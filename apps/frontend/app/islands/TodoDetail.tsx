import { useEffect, useState } from 'hono/jsx';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoDetail({ id }: { id: number }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  // Todoデータを取得
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        // まず全てのTodoを取得
        const response = await fetch('http://localhost:3001/api/todos');
        if (!response.ok) throw new Error('Todoの取得に失敗しました');

        const todos = (await response.json()) as Todo[];
        const foundTodo = todos.find((t) => t.id === id);

        if (foundTodo) {
          setTodo(foundTodo);
          setEditTitle(foundTodo.title);
          return;
        }
        setError('Todoが見つかりませんでした');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  // 完了状態の切り替え
  const toggleComplete = async () => {
    if (!todo) return;
    try {
      setTodo({ ...todo, completed: !todo.completed });
      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
    } catch (err) {
      setError('更新に失敗しました');
    }
  };

  // タイトル更新
  const updateTitle = async () => {
    if (!todo || !editTitle.trim()) return;
    try {
      setTodo({ ...todo, title: editTitle });
      setEditMode(false);
      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });
    } catch (err) {
      setError('更新に失敗しました');
    }
  };

  // Todo削除
  const deleteTodo = async () => {
    try {
      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'DELETE',
      });
      window.location.href = '/';
    } catch (err) {
      setError('削除に失敗しました');
    }
  };

  if (loading) return <div class="todo-app">読み込み中...</div>;

  if (error) {
    return (
      <div class="todo-app">
        <div class="error">{error}</div>
        <a href="/" class="todo-button">
          一覧に戻る
        </a>
      </div>
    );
  }

  if (!todo) {
    return (
      <div class="todo-app">
        <div class="error">Todoが見つかりませんでした</div>
        <a href="/" class="todo-button">
          一覧に戻る
        </a>
      </div>
    );
  }

  return (
    <div class="todo-app">
      <h1>Todo詳細</h1>

      <div class="todo-detail">
        {editMode ? (
          <div class="edit-form">
            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle((e.target as HTMLInputElement).value)
              }
              class="todo-input"
            />
            <div class="button-group">
              <button
                type="button"
                onClick={updateTitle}
                class="todo-button"
                style="background-color: #4caf50; margin-right: 10px;"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditTitle(todo.title);
                }}
                class="todo-button"
                style="background-color: #f44336;"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div class="todo-info">
            <h2>{todo.title}</h2>
            <div class="status">
              <span>ステータス: </span>
              <span class={todo.completed ? 'completed' : 'pending'}>
                {todo.completed ? '完了' : '未完了'}
              </span>
            </div>

            <div class="button-group" style="margin-top: 20px;">
              <button
                type="button"
                onClick={() => setEditMode(true)}
                class="todo-button"
                style="background-color: #2196f3; margin-right: 10px;"
              >
                編集
              </button>
              <button
                type="button"
                onClick={toggleComplete}
                class="todo-button"
                style={`background-color: ${
                  todo.completed ? '#ff9800' : '#4caf50'
                }; margin-right: 10px;`}
              >
                {todo.completed ? '未完了に戻す' : '完了にする'}
              </button>
              <button
                type="button"
                onClick={deleteTodo}
                class="todo-button"
                style="background-color: #f44336;"
              >
                削除
              </button>
            </div>
          </div>
        )}
      </div>

      <a
        href="/"
        class="todo-button"
        style="display: inline-block; margin-top: 20px; background-color: #607d8b;"
      >
        一覧に戻る
      </a>
    </div>
  );
}
