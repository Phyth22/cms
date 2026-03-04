import { getRaw } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { RequestOptions } from "../types";
import type { ServerMetrics } from "../types";

export function getServerMetrics(
  opts?: RequestOptions,
): Promise<ServerMetrics> {
  return getRaw<ServerMetrics>(ENDPOINTS.METRICS.SERVER, opts);
}
