/**
 * 共通のTodo型定義
 */
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Todo作成リクエスト型
 */
export type CreateTodoRequest = {
  title: string;
};

/**
 * APIレスポンス型
 */
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

/**
 * ページネーション型
 */
export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

/**
 * ページネーション付きレスポンス型
 */
export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: Pagination;
};
