import { useEffect, useState } from 'hono/jsx';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Todoリストを取得
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/todos');
      if (!response.ok) throw new Error('Todoの取得に失敗しました');

      const data = (await response.json()) as Todo[];
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Todoの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 新しいTodoを追加
  const addTodo = async (e: Event) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        const addedTodo = (await response.json()) as Todo;
        setTodos([...todos, addedTodo]);
        setNewTodo('');
      }
    } catch (err) {
      setError('Todoの追加に失敗しました');
    }
  };

  // 完了状態を切り替え
  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      // 楽観的UI更新
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );

      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
    } catch {
      fetchTodos(); // エラー時は再取得
    }
  };

  // Todoを削除
  const deleteTodo = async (id: number) => {
    try {
      // 楽観的UI更新
      setTodos(todos.filter((t) => t.id !== id));

      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'DELETE',
      });
    } catch {
      fetchTodos(); // エラー時は再取得
    }
  };

  // 編集モードを開始
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  // 編集を保存
  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;

    try {
      // 楽観的UI更新
      setTodos(todos.map((t) => (t.id === id ? { ...t, title: editText } : t)));
      setEditingId(null);

      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editText }),
      });
    } catch {
      fetchTodos(); // エラー時は再取得
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div class="todo-app">
      <h1>Todoリスト</h1>

      {error && <div class="error">{error}</div>}

      <form onSubmit={addTodo} class="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo((e.target as HTMLInputElement).value)}
          placeholder="新しいタスクを入力..."
          class="todo-input"
        />
        <button type="submit" class="todo-button">
          追加
        </button>
      </form>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul class="todo-list">
          {todos.length === 0 ? (
            <p>タスクがありません</p>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                class={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />

                {editingId === todo.id ? (
                  <div style="display: flex; flex: 1;">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) =>
                        setEditText((e.target as HTMLInputElement).value)
                      }
                      class="todo-input"
                      style="margin-right: 5px;"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(todo.id)}
                      class="todo-button"
                      style="background-color: #4caf50;"
                    >
                      保存
                    </button>
                  </div>
                ) : (
                  <div style="display: flex; flex: 1; justify-content: space-between; align-items: center;">
                    <span
                      style="flex: 1; cursor: pointer;"
                      onClick={() => startEditing(todo)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          startEditing(todo);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`タスク「${todo.title}」を編集`}
                    >
                      {todo.title}
                    </span>
                    <div>
                      <a
                        href={`/todos/${todo.id}`}
                        class="todo-button"
                        style="margin-right: 5px; background-color: #607d8b; padding: 5px 10px; text-decoration: none;"
                      >
                        詳細
                      </a>
                      <button
                        type="button"
                        onClick={() => startEditing(todo)}
                        class="todo-button"
                        style="margin-right: 5px; background-color: #2196f3; padding: 5px 10px;"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        class="todo-button"
                        style="background-color: #f44336; padding: 5px 10px;"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}

      <button onClick={fetchTodos} class="refresh-button" type="button">
        更新
      </button>
    </div>
  );
}
