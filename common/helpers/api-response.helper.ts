import { ApiError } from '@/types/api';
import type { ApiResponse } from '@/types/api';

/**
 * Infrastructure Helper - API Response validation
 * Responsibility: Technical validation of API responses
 * Usage: Infrastructure layer để validate API responses
 */
export class ApiResponseHelper {
  /**
   * Check ApiResponse status và throw error nếu không thành công
   * @param apiResponse - API response từ server
   * @returns Validated API response
   * @throws ApiError nếu status !== 200
   */
  static checkApiResponse<T>(apiResponse: ApiResponse<T>): ApiResponse<T> {
    if (apiResponse.status !== 200) {
      // Throw technical error với thông tin chi tiết
      throw new ApiError(
        apiResponse.message || 'API request failed',
        apiResponse.status,
        'API_ERROR',
        apiResponse
      );
    }
    return apiResponse;
  }

  /**
   * Extract data từ validated API response
   * @param apiResponse - Validated API response
   * @returns Data portion của response
   */
  static extractData<T>(apiResponse: ApiResponse<T>): T {
    return this.checkApiResponse(apiResponse).data;
  }

  /**
   * Batch validate multiple API responses
   * @param responses - Array của API responses
   * @returns Array của validated responses
   */
  static checkMultipleResponses<T>(
    responses: ApiResponse<T>[]
  ): ApiResponse<T>[] {
    return responses.map((response) => this.checkApiResponse(response));
  }

  /**
   * Check if API response is successful without throwing
   * @param apiResponse - API response to check
   * @returns Boolean indicating success
   */
  static isSuccessResponse<T>(apiResponse: ApiResponse<T>): boolean {
    return apiResponse.status === 200;
  }
}
