import { MAX_RETRIES, RETRY_BASE_MS } from './constants';

export interface RetryableError extends Error { retryable?: boolean }

export interface RetryOptions {
  retries?: number;
  baseMs?: number;
  sleep?: (ms: number) => Promise<void>;
  onRetry?: (attempt: number, err: unknown) => void;
}

const realSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Retries only errors marked retryable (network, 429, 5xx, timeout), with exponential backoff. */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const retries = opts.retries ?? MAX_RETRIES, base = opts.baseMs ?? RETRY_BASE_MS, sleep = opts.sleep ?? realSleep;
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const retryable = !!(e as RetryableError)?.retryable;
      if (!retryable || attempt >= retries) throw e;
      opts.onRetry?.(attempt + 1, e);
      await sleep(base * 2 ** attempt);
    }
  }
}

/** Runs async jobs with at most `limit` in flight. A new job never waits for a slow one while a slot is free. */
export function createQueue(limit: number) {
  let running = 0;
  const waiting: Array<() => void> = [];
  const next = () => {
    while (running < limit && waiting.length) { running++; waiting.shift()!(); }
  };
  return {
    run<T>(job: () => Promise<T>): Promise<T> {
      return new Promise<T>((resolve, reject) => {
        waiting.push(() => {
          job().then(resolve, reject).finally(() => { running--; next(); });
        });
        next();
      });
    },
    get active() { return running; },
    get pending() { return waiting.length; },
  };
}
