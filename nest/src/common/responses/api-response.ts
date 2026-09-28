/**
 * Standard API response object.
 * `data` only on success.
 * 400 → fail | 401 → unauthorized | other errors → error
 */
export class ApiResponse<T = unknown> {
  readonly key: 'success' | 'error' | 'fail' | 'unauthorized';
  readonly status: string;
  readonly message: string;
  readonly data?: T;

  private constructor(
    key: 'success' | 'error' | 'fail' | 'unauthorized',
    status: string | number,
    message: string,
    data?: T,
  ) {
    this.key = key;
    this.status = String(status);
    this.message = message;

    if (key === 'success') {
      this.data = (data ?? {}) as T;
    }
  }

  static success<T>(
    status: string | number,
    message: string,
    data: T,
  ): ApiResponse<T> {
    return new ApiResponse('success', status, message, data);
  }

  static error(status: string | number, message: string): ApiResponse {
    const code = Number(status);
    let key: 'error' | 'fail' | 'unauthorized' = 'error';

    if (code === 400) {
      key = 'fail';
    } else if (code === 401) {
      key = 'unauthorized';
    }

    return new ApiResponse(key, status, message);
  }
}
