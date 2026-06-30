export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  message: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  details: Record<string, string[]> | null;
}

export type SortDirection = 'asc' | 'desc';

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  direction?: SortDirection;
  search?: string;
}

export interface UploadPresignedUrl {
  url: string;
  fields: Record<string, string>;
  fileKey: string;
}

export interface UploadComplete {
  fileKey: string;
  url: string;
}
