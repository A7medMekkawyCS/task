/**
 * Same response shape as Nest:
 * success → { key, status, message, data }
 * 400 → fail | 401 → unauthorized | other → error
 */
class ApiResponse {
  constructor(key, status, message, data) {
    this.key = key;
    this.status = String(status);
    this.message = message;

    if (key === 'success') {
      this.data = data ?? {};
    }
  }

  static success(status, message, data) {
    return new ApiResponse('success', status, message, data);
  }

  static error(status, message) {
    const code = Number(status);
    let key = 'error';

    if (code === 400) {
      key = 'fail';
    } else if (code === 401) {
      key = 'unauthorized';
    }

    return new ApiResponse(key, status, message);
  }
}

module.exports = ApiResponse;
