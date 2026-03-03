/**
 * api/index.ts — Public API for the NAVAS CMS HTTP layer.
 *
 * Usage:
 *   import { getAllSimCards, createSimCard, ApiError } from "../../api";
 */

// Shared types & error class
export { ApiError } from "./types";
export type { ApiResponse, RequestOptions } from "./types";

// HTTP verbs (for custom one-off calls)
export { get, post, put, patch, del } from "./client";

// Central endpoint registry
export { ENDPOINTS } from "./endpoints";

// ── Domain types ─────────────────────────────────────────────────────────────

export type {
  CreateSimCardRequest,
  CreateSimCardResponse,
  SimCard,
  SimStatistics,
} from "./types";

// ── Domain services ──────────────────────────────────────────────────────────

export { createSimCard, getAllSimCards } from "./services/simcards.service";
export { getSimStatistics } from "./services/statistics.service";
