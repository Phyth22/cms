/**
 * simcards.service.ts — SIM card API service.
 *
 * Endpoints:
 *   POST /devices/simcards/create  → createSimCard
 *   GET  /devices/simcards/all     → getAllSimCards
 */

import { get, post } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, RequestOptions } from "../types";
import type { CreateSimCardRequest, CreateSimCardResponse, SimCard } from "../types";

/** Register a new SIM card. */
export function createSimCard(
  payload: CreateSimCardRequest,
  opts?: RequestOptions,
): Promise<ApiResponse<CreateSimCardResponse>> {
  return post<CreateSimCardResponse>(ENDPOINTS.SIMCARDS.CREATE, { data: payload }, opts);
}

/** Fetch all registered SIM cards. */
export function getAllSimCards(
  opts?: RequestOptions,
): Promise<ApiResponse<SimCard[]>> {
  return get<SimCard[]>(ENDPOINTS.SIMCARDS.GET_ALL, opts);
}
