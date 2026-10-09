// ─── HTTP Client ──────────────────────────────────────────────────────────────
// Typed fetch wrapper. Ready to plug your real API base URL via env vars.
// All API calls go through here → single place to add auth headers, refresh tokens, logging.

import { config } from '@/config/app'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

export class HttpError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

// ─── Token storage (replace with your auth solution) ─────────────────────────

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken() {
  return authToken
}

// ─── Core request ─────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.api.baseUrl}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // Inject auth token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody.message ?? errorMessage
      } catch {}
      throw new HttpError(errorMessage, response.status)
    }

    const json: ApiResponse<T> = await response.json()
    return json.data
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof HttpError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new HttpError('Request timeout', 408, 'TIMEOUT')
    }
    throw new HttpError('Network error', 0, 'NETWORK_ERROR')
  }
}

// ─── HTTP methods ─────────────────────────────────────────────────────────────

export const http = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
