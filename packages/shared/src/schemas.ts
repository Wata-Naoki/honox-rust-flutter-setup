import { z } from 'zod';

/**
 * Todoスキーマ
 */
export const todoSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  completed: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Todo作成スキーマ
 */
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
});

/**
 * Todo更新スキーマ
 */
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください')
    .optional(),
  completed: z.boolean().optional(),
});

/**
 * ページネーションクエリスキーマ
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});
