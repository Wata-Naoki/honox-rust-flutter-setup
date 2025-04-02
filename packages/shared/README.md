# @circle/shared

このパッケージは、フロントエンド（Hono X）、API（Rust）、モバイル（Flutter）間で共有するコードを提供します。

## 機能

- **型定義**: 共通のデータ型を定義
- **バリデーションスキーマ**: Zodを使用したデータバリデーション
- **ユーティリティ関数**: 共通のヘルパー関数
- **定数**: API URLやエンドポイントなどの共通定数

## 使用方法

### フロントエンド（Hono X）での使用

```typescript
import { Todo, createTodoSchema, API_ENDPOINTS } from '@circle/shared';

// 型の使用
const todos: Todo[] = [];

// スキーマの使用
const result = createTodoSchema.safeParse({ title: 'タスク1' });
if (result.success) {
  // バリデーション成功
}

// 定数の使用
const apiUrl = API_ENDPOINTS.TODOS;
```

### API（Rust）での使用

Rustでは直接TypeScriptのコードを使用できませんが、同じ構造体を定義することで型の一貫性を保つことができます。

```rust
// Todoの構造体を共有パッケージの型定義と一致させる
#[derive(Serialize, Deserialize)]
struct Todo {
    id: u32,
    title: String,
    completed: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    created_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    updated_at: Option<String>,
}
```

### モバイル（Flutter）での使用

Flutterでも同様に、Dartのクラスを共有パッケージの型定義と一致させることができます。

```dart
// Todoのクラスを共有パッケージの型定義と一致させる
class Todo {
  final int id;
  final String title;
  bool completed;
  final String? createdAt;
  final String? updatedAt;

  Todo({
    required this.id,
    required this.title,
    required this.completed,
    this.createdAt,
    this.updatedAt,
  });

  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'],
      title: json['title'],
      completed: json['completed'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      if (createdAt != null) 'createdAt': createdAt,
      if (updatedAt != null) 'updatedAt': updatedAt,
    };
  }
}
```

## ビルド

```bash
# パッケージのビルド
pnpm build

# 開発モード（ウォッチモード）
pnpm dev
``` 