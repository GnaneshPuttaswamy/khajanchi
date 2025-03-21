import { AsyncLocalStorage } from 'async_hooks';

export interface HttpRequestContext {
  requestId: string;
}

export const requestContextStorage = new AsyncLocalStorage<HttpRequestContext>();
