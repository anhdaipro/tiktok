
import { AxiosError, type AxiosRequestConfig } from 'axios'

/**
 * HTTP Methods được support bởi useApi hook
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Generic interface cho API Response wrapper
 * Match với backend API structure của project
 */
export interface ApiResponse<T = any> {
  status: number
  message: string
  data: T
}
export class ApiError extends Error {
  public status?: number
  public code?: string
  public data?: any

  constructor(message: string, status?: number, code?: string, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.data = data
  }
}
export interface PaginationResponse<T> {
    list : T[]
    totalRecord: number
}
export interface PaginationNotificationResponse<T> {
    list : T[]
    total_record: number
}
export interface ScrollableResponse<T> {
    data : T[]
    nextCursor?: string;
    totalRecord?: number
}
/**
 * Generic interface cho API Error Response
 */
export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  code?: string
  status?: number
}

/**
 * Union type cho possible errors từ API calls
 */
export type ApiErrorType =  AxiosError | Error

/**
 * Base configuration cho API requests
 */
export interface BaseApiConfig extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  /**
   * API endpoint URL (relative hoặc absolute)
   */
  url: string

  /**
   * HTTP method - default 'GET'
   */
  method?: HttpMethod

  /**
   * Request body data (for POST, PUT, PATCH)
   */
  body?: any

  /**
   * URL parameters (query string)
   */
  params?: Record<string, any>
}

/**
 * Configuration options cho useApi hook khi sử dụng với useQuery (GET requests)
 */
export interface QueryApiOptions<TData = any, TError = ApiErrorType> extends BaseApiConfig {
  /**
   * Enable/disable query - default true
   * Nếu false, query sẽ không chạy cho đến khi enabled = true hoặc gọi refetch()
   */
  enabled?: boolean

  /**
   * Enable caching - default true cho GET requests
   * Nếu false, sẽ bypass cache và luôn fetch fresh data
   */
  cache?: boolean

  /**
   * Time in milliseconds mà data được coi là fresh (không cần refetch)
   * Default: 5 minutes (300000ms)
   */
  staleTime?: number

  /**
   * Time in milliseconds mà data được giữ trong cache sau khi không được sử dụng
   * Default: 5 minutes (300000ms)
   */
  gcTime?: number

  /**
   * Retry failed requests - default 3 attempts
   * Có thể là boolean hoặc number hoặc function
   */
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean)

  /**
   * Delay giữa retry attempts (ms)
   * Default: exponential backoff
   */
  retryDelay?: number | ((retryAttempt: number, error: TError) => number)

  /**
   * Refetch on window focus - default true
   */
  refetchOnWindowFocus?: boolean

  /**
   * Refetch on network reconnect - default true
   */
  refetchOnReconnect?: boolean

  /**
   * Auto refetch interval (ms) - default disabled
   */
  refetchInterval?: number | false

  /**
   * Transform/select data from response
   */
  select?: (data: TData) => any

  /**
   * Success callback
   */
  onSuccess?: (data: TData) => void

  /**
   * Error callback
   */
  onError?: (error: TError) => void

  /**
   * Callback chạy khi query settled (thành công hoặc lỗi)
   */
  onSettled?: (data: TData | undefined, error: TError | null) => void
}

/**
 * Configuration options cho useApi hook khi sử dụng với useMutation (POST, PUT, DELETE, PATCH)
 */
export interface MutationApiOptions<TData = any, TError = ApiErrorType, TVariables = any>
  extends Omit<BaseApiConfig, 'body'> {
  /**
   * Enable caching - default false cho mutations
   */
  cache?: boolean

  /**
   * Retry failed mutations - default false
   */
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean)

  /**
   * Success callback
   */
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>

  /**
   * Error callback
   */
  onError?: (error: TError, variables: TVariables) => void | Promise<void>

  /**
   * Callback trước khi mutation execute (cho optimistic updates)
   * Return value sẽ được pass vào onError và onSettled như context
   */
  onMutate?: (variables: TVariables) => Promise<any> | any

  /**
   * Callback chạy khi mutation settled (thành công hoặc lỗi)
   * Context là return value từ onMutate
   */
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context?: any
  ) => void | Promise<void>

  /**
   * Auto invalidate related queries sau khi mutation success
   * Array of query keys để invalidate. Mỗi item là một query key array.
   *
   * @example
   * invalidateQueries: [
   *   ['users'],           // Invalidate all users queries
   *   ['users', 'detail'], // Invalidate user detail queries
   *   ['posts', userId]    // Invalidate posts for specific user
   * ]
   */
  invalidateQueries?: string[][] | ((data: TData, variables: TVariables) => string[][])

  /**
   * Update query data optimistically (trước khi mutation execute)
   */
  optimisticUpdate?: {
    queryKey: string[]
    updater: (oldData: any, variables: TVariables) => any
  }
}

/**
 * Union type cho tất cả API options
 */
export type UseApiOptions<TData = any, TError = ApiErrorType, TVariables = any> =
  | QueryApiOptions<TData, TError>
  | MutationApiOptions<TData, TError, TVariables>

/**
 * Return type cho useApi hook khi sử dụng với queries (GET)
 */
export interface QueryResult<TData = any, TError = ApiErrorType> {
  /**
   * Response data, undefined nếu chưa có data
   */
  data: TData | undefined

  /**
   * Error nếu có, null nếu không có lỗi
   */
  error: TError | null

  /**
   * True nếu đang loading (initial fetch)
   */
  isLoading: boolean

  /**
   * True nếu đang fetch (includes background refetch)
   */
  isFetching: boolean

  /**
   * True nếu query đã fetch thành công ít nhất 1 lần
   */
  isSuccess: boolean

  /**
   * True nếu có error
   */
  isError: boolean

  /**
   * True nếu data đã stale và cần refetch
   */
  isStale: boolean

  /**
   * Function để refetch data manually
   */
  refetch: () => Promise<any>

  /**
   * Query status
   */
  status: 'pending' | 'error' | 'success'

  /**
   * Fetch status
   */
  fetchStatus: 'fetching' | 'paused' | 'idle'
}

/**
 * Return type cho useApi hook khi sử dụng với mutations (POST, PUT, DELETE, PATCH)
 */
export interface MutationResult<TData = any, TError = ApiErrorType, TVariables = any> {
  /**
   * Response data từ mutation, undefined nếu chưa execute
   */
  data: TData | undefined

  /**
   * Error nếu có, null nếu không có lỗi
   */
  error: TError | null

  /**
   * True nếu mutation đang execute
   */
  isLoading: boolean

  /**
   * Alias cho isLoading (consistent với TanStack Query)
   */
  isPending: boolean

  /**
   * True nếu mutation execute thành công
   */
  isSuccess: boolean

  /**
   * True nếu có error
   */
  isError: boolean

  /**
   * True nếu mutation chưa được execute
   */
  isIdle: boolean

  /**
   * Function để execute mutation
   */
  mutate: (variables: TVariables) => void

  /**
   * Async version của mutate (returns Promise)
   */
  mutateAsync: (variables: TVariables) => Promise<TData>

  /**
   * Reset mutation state về idle
   */
  reset: () => void

  /**
   * Mutation status
   */
  status: 'idle' | 'pending' | 'error' | 'success'

  /**
   * Variables được pass vào mutation
   */
  variables: TVariables | undefined
}

/**
 * Union type cho return value của useApi hook
 */
export type UseApiResult<TData = any, TError = ApiErrorType, TVariables = any> =
  | QueryResult<TData, TError>
  | MutationResult<TData, TError, TVariables>

/**
 * Utility type để extract data type từ ApiResponse
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : T

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}

/**
 * Common filters cho API requests
 */
export interface CommonFilters {
  key_search?: string;
  statuses?: number[];
  from_date?: string;
  to_date?: string;
  [key: string]: any
}

/**
 * Type helper cho building query keys
 */
export type QueryKey = readonly unknown[]
