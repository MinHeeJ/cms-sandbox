export interface ApiErrorBody { code: string; detail: string; traceId?: string; }
export interface ApiResponse<T> { success: boolean; message: string; data: T; error?: ApiErrorBody; }
export interface PageResponse<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; }
