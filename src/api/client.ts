/**
 * api/client.ts — Centralised HTTP client for NAVAS CMS.
 *
 * Thin wrapper around native `fetch` that handles:
 *  - Base URL resolution (from VITE_API_BASE_URL env var)
 *  - JSON content-type headers
 *  - Auth token injection
 *  - Generic ApiResponse<T> envelope parsing
 *  - Consistent error handling via ApiError
 *
 * Public surface:  get · post · put · patch · del
 */

import type { ApiResponse, RequestOptions } from "./types";
import { ApiError } from "./types";

// ── Base URL ─────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Auth helper (placeholder) ────────────────────────────────────────────────

/**
 * Returns the current auth token, or `null` if the user isn't authenticated.
 * TODO: Wire this to AuthContext / a token store once auth is live.
 */
function getAuthToken(): string | null {
  return null;
}

// ── Internal request handler ─────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { params, headers: extraHeaders, ...fetchOpts } = opts;

  // Build URL with optional query params
  const url = new URL(path, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  // Headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fetch
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    ...fetchOpts,
  });

  // Parse JSON (even error responses may contain useful info)
  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new ApiError(
      `${method} ${path} — failed to parse response`,
      response.status,
      response.statusText,
    );
  }

  // HTTP-level error
  if (!response.ok) {
    throw new ApiError(
      json.message ?? `${method} ${path} failed`,
      response.status,
      response.statusText,
      json.message,
    );
  }

  // API-level error (HTTP 200 but status !== "success")
  if (json.status !== "success") {
    throw new ApiError(
      json.message ?? "Request failed",
      response.status,
      response.statusText,
      json.message,
    );
  }

  return json;
}

// ── Public helpers ───────────────────────────────────────────────────────────

export function get<T>(path: string, opts?: RequestOptions) {
  return request<T>("GET", path, undefined, opts);
}

export function post<T>(path: string, body: unknown, opts?: RequestOptions) {
  return request<T>("POST", path, body, opts);
}

export function put<T>(path: string, body: unknown, opts?: RequestOptions) {
  return request<T>("PUT", path, body, opts);
}

export function patch<T>(path: string, body: unknown, opts?: RequestOptions) {
  return request<T>("PATCH", path, body, opts);
}

export function del<T>(path: string, opts?: RequestOptions) {
  return request<T>("DELETE", path, undefined, opts);
}
