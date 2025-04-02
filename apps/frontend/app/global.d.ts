import type {} from 'hono';

declare module 'hono' {
  interface Env {
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    Variables: {};
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    Bindings: {};
  }
}
