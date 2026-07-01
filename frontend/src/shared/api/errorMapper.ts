import type { ApiErrorBody } from './types';
export function errorMessage(error?: ApiErrorBody): string {
  if (!error) return '요청 처리 중 오류가 발생했습니다.';
  if (error.code === 'VALIDATION_ERROR') return error.detail;
  if (error.code === 'FORBIDDEN') return '접근 권한이 없습니다.';
  return error.detail || '관리자에게 문의해 주세요.';
}
