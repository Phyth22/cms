import { get } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, RequestOptions } from "../types";
import type { SimStatistics } from "../types";

export function getSimStatistics(
  opts?: RequestOptions,
): Promise<ApiResponse<SimStatistics>> {
  return get<SimStatistics>(ENDPOINTS.STATISTICS.SIMS_SUMMARY, opts);
}
