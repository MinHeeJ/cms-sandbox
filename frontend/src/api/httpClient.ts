type ApiOptions = Omit<RequestInit, 'body'> & { body?: unknown };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  const memberId = localStorage.getItem('memberId');
  if (memberId) {
    headers.set('X-Member-Id', memberId);
  }
  headers.set('X-Operator-Id', localStorage.getItem('operatorId') ?? 'operator-demo');
  headers.set(
    'X-Operator-Permissions',
    localStorage.getItem('operatorPermissions') ??
      'member:read,sensitive:read,status:write,role:write,restriction:write,privacy:review'
  );

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (typeof options.body === 'string' || options.body instanceof FormData) {
      body = options.body;
    } else {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body
  });
  if (!response.ok) {
    let message = '요청을 처리할 수 없습니다.';
    let code: string | undefined;
    try {
      const payload = await response.json();
      message = payload.message ?? message;
      code = payload.code;
    } catch {
      message = response.statusText || message;
    }
    throw new ApiError(message, response.status, code);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
