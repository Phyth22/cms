/**
 * api/endpoints.ts — Central registry of all API URL paths.
 *
 * Every endpoint in the app is defined here. When a URL changes,
 * update it in one place and every service picks it up.
 *
 * Convention:
 *   DOMAIN.ACTION  →  "/path/to/endpoint"
 */

export const ENDPOINTS = {
  SIMCARDS: {
    CREATE:  "/devices/simcards/create",
    GET_ALL: "/devices/simcards/all",
  },
  STATISTICS: {
    SIMS_SUMMARY: "/statistics/sims/summary",
  },
  METRICS: {
    SERVER:          "/metrics/server",
    API_PERFORMANCE: "/metrics/api/performance",
  },
  GATEWAYS: {
    MOBILE_MONEY:     "/gateways/mobile-money",
    MOBILE_MONEY_BY:  "/gateways/mobile-money",   // append /{telecom_name}
    UPDATE:           "/gateways/mobile-money/update",
  },
  VEBA: {
    STATISTICS: "/veba/statistics",
  },
} as const;
