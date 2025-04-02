// 型定義のエクスポート
export * from './types';

// スキーマのエクスポート
export * from './schemas';

// ユーティリティ関数のエクスポート
export * from './utils';

// 定数
export const API_BASE_URL = 'http://localhost:3001';
export const API_ENDPOINTS = {
  TODOS: '/api/todos',
  HELLO: '/api/hello',
};

// 環境変数
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};
