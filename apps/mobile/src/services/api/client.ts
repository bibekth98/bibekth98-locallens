/**
 * SydneyGo API Client
 *
 * A thin fetch-based HTTP client wired to the backend base URL.
 * Authentication tokens are injected via the `setAuthToken` helper.
 * Replace with axios or ky if preferred — the interface stays the same.
 */

import Env from '@/config/env';

let _authToken: string | null = null;

/** Call this after successful login to attach the bearer token to all requests */
export function setAuthToken(token: string | null): void {
  _authToken = token;
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extra,
  };
  if (_authToken) {
    headers['Authorization'] = `Bearer ${_authToken}`;
  }
  return headers;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`API error ${status}`);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.status, body);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

const client = {
  get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return fetch(`${Env.API_BASE_URL}${path}`, {
      method: 'GET',
      headers: buildHeaders(headers),
    }).then((r) => handleResponse<T>(r));
  },

  post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return fetch(`${Env.API_BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handleResponse<T>(r));
  },

  put<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return fetch(`${Env.API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handleResponse<T>(r));
  },

  patch<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return fetch(`${Env.API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: buildHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handleResponse<T>(r));
  },

  delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return fetch(`${Env.API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(headers),
    }).then((r) => handleResponse<T>(r));
  },
};

export default client;
