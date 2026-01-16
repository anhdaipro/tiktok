/**
 * Services Helper - Error handling và user-friendly messages
 * Responsibility: Business logic error transformation
 * Usage: Services layer để transform technical errors thành user messages
 */
export class ErrorHandlerHelper {
  /**
   * Transform technical error thành user-friendly message
   * @param error - Error object từ infrastructure
   * @param context - Context của operation (optional)
   * @returns User-friendly error message
   */
  static getErrorMessage(error: any, context?: string): string {
    // Default message based on context
    let defaultMessage = 'Có lỗi xảy ra'
    if (context) {
      defaultMessage = `Có lỗi xảy ra khi ${context}`
    }

    // Extract status from error
    const status = error?.status || error?.response?.status

    // Map common API status codes to user messages
    if (status === 401) {
      return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
    }

    if (status === 403) {
      return 'Bạn không có quyền thực hiện thao tác này'
    }

    if (status === 404) {
      return context ? `Không tìm thấy ${context}` : 'Không tìm thấy dữ liệu'
    }

    if (status === 409) {
      return 'Dữ liệu đã tồn tại trong hệ thống'
    }

    if (status === 422) {
      return 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại'
    }

    if (status >= 500) {
      return 'Lỗi hệ thống, vui lòng thử lại sau'
    }

    // Use API message if available và meaningful
    if (error?.message && typeof error.message === 'string' && error.message.length > 0) {
      return error.message
    }

    return defaultMessage
  }

  /**
   * Get error messages cho specific domains
   */
  static getBrandErrorMessage(error: any): string {
    return this.getErrorMessage(error, 'tải danh sách thương hiệu')
  }

  static getEmployeeErrorMessage(error: any): string {
    return this.getErrorMessage(error, 'tải danh sách nhân viên')
  }

  static getRoleErrorMessage(error: any): string {
    return this.getErrorMessage(error, 'tải danh sách vai trò')
  }

  static getOrderErrorMessage(error: any): string {
    return this.getErrorMessage(error, 'tải danh sách đơn hàng')
  }

  /**
   * Get error messages cho CRUD operations
   */
  static getCreateErrorMessage(error: any, entity: string): string {
    return this.getErrorMessage(error, `tạo ${entity}`)
  }

  static getUpdateErrorMessage(error: any, entity: string): string {
    return this.getErrorMessage(error, `cập nhật ${entity}`)
  }

  static getDeleteErrorMessage(error: any, entity: string): string {
    return this.getErrorMessage(error, `xóa ${entity}`)
  }

  /**
   * Check if error should trigger logout (401 status)
   * @param error - Error object
   * @returns Boolean indicating if should logout
   */
  static shouldLogout(error: any): boolean {
    const status = error?.status || error?.response?.status
    return status === 401
  }

  /**
   * Check if error is network related
   * @param error - Error object
   * @returns Boolean indicating network error
   */
  static isNetworkError(error: any): boolean {
    return error?.code === 'NETWORK_ERROR' || !navigator.onLine
  }
}