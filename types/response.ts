export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface PaginatedResponse <T> extends ApiResponse<T> {
    pagination: PaginationInfo;
}