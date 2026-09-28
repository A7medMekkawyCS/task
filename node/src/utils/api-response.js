/**
 * Same response shape as Nest:
 * success → { key, status, message, data }
 * error   → { key, status, message }  (no data)
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
    return new ApiResponse('error', status, message);
  }
}

module.exports = ApiResponse;
