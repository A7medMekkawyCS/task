/**
 * Same response shape as Nest:
 * success → { key, status, message, data }
 * 400     → { key: "fail", status, message }
 * other errors → { key: "error", status, message }
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
    const key = Number(status) === 400 ? 'fail' : 'error';
    return new ApiResponse(key, status, message);
  }
}

module.exports = ApiResponse;
