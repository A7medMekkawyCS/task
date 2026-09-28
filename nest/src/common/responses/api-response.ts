/**
 * Standard API response object.
 * `data` is included only on success responses.
 */
export class ApiResponse<T = unknown> {
  readonly key: 'success' | 'error';
  readonly status: string;
  readonly message: string;
  readonly data?: T;

  private constructor(
    key: 'success' | 'error',
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
    return new ApiResponse('error', status, message);
  }
}
