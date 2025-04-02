import type { ApiResponse, PaginatedResponse, Pagination } from './types';

/**
 * 成功レスポンスを作成する
 */
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
): ApiResponse<T> => {
  return {
    data,
    success: true,
    message,
  };
};

/**
 * エラーレスポンスを作成する
 */
export const createErrorResponse = <T>(
  message: string,
  data?: T,
): ApiResponse<T> => {
  return {
    data: data as T,
    success: false,
    message,
  };
};

/**
 * ページネーション付きレスポンスを作成する
 */
export const createPaginatedResponse = <T>(
  data: T[],
  pagination: Pagination,
  message?: string,
): PaginatedResponse<T> => {
  return {
    data,
    success: true,
    message,
    pagination,
  };
};

/**
 * 日付をフォーマットする
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * 配列をページネーションする
 */
export const paginateArray = <T>(
  array: T[],
  page: number,
  limit: number,
): { items: T[]; total: number } => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const items = array.slice(startIndex, endIndex);

  return {
    items,
    total: array.length,
  };
};
