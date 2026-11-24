// ─── Client de l'API Next (/api/*) ───────────────────────────────────────────
// Les sessions passent par un cookie httpOnly : aucun jeton à gérer côté client.

export class ApiRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      ...rest,
      credentials: 'same-origin',
      headers: json !== undefined ? { 'Content-Type': 'application/json', ...headers } : headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    })
  } catch {
    throw new ApiRequestError(0, 'Connexion impossible. Vérifiez votre réseau.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiRequestError(res.status, (data as { error?: string }).error ?? 'Une erreur est survenue.')
  return data as T
}

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Une erreur est survenue.')
