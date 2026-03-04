import { getRaw } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { RequestOptions } from "../types";
import type { ServerMetrics, ApiPerformanceMetrics } from "../types";

export function getServerMetrics(
  opts?: RequestOptions,
): Promise<ServerMetrics> {
  return getRaw<ServerMetrics>(ENDPOINTS.METRICS.SERVER, opts);
}

export function getApiPerformance(
  opts?: RequestOptions,
): Promise<ApiPerformanceMetrics> {
  return getRaw<ApiPerformanceMetrics>(ENDPOINTS.METRICS.API_PERFORMANCE, opts);
}
