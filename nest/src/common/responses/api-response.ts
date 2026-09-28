/**
 * Standard API response object.
 * `data` is included only on success responses.
 * 400 → key: "fail", other errors → key: "error"
 */
export class ApiResponse<T = unknown> {
  readonly key: 'success' | 'error' | 'fail';
  readonly status: string;
  readonly message: string;
  readonly data?: T;

  private constructor(
    key: 'success' | 'error' | 'fail',
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
    const key = Number(status) === 400 ? 'fail' : 'error';
    return new ApiResponse(key, status, message);
  }
}
