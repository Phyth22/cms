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
    //STATISTICS: "/veba/statistics",
  },
  GATEWAYS: {
    MOBILE_MONEY:     "/gateways/mobile-money",
    MOBILE_MONEY_BY:  "/gateways/mobile-money",   // append /{telecom_name}
    UPDATE:           "/gateways/mobile-money/update",
  },
  VEBA: {
    STATISTICS: "/veba/statistics",
  },
  TENANTS: {
    CREATE:          "/tenants/create",
    GET_ALL:         "/tenants/all",
    IMPORT:          "/tenants/import",
    IMPORT_TEMPLATE: "/tenants/import/template",
    TRASH:           "/tenants",           // append /{id}/trash
    RESTORE:         "/tenants",           // append /{id}/restore
    GET_TRASHED:     "/tenants/trashed",
    KPIS:            "/tenants/kpis",
    WALLET:          "/tenants",           // append /{id}/wallet
    TOP_UP:          "/tenants/wallet/topup",
    ALLOCATE:        "/tenants/wallet/allocate",
    MINT:            "/tenants/wallet/mint",
    USAGE_EVENTS:    "/tenants/usage-events",
    APPROVALS:       "/tenants/approvals",
    APPROVE:         "/tenants/approvals",   // append /{id}/approve
    REJECT:          "/tenants/approvals",   // append /{id}/reject
    AUDIT_TRAIL:     "/tenants/audit-trail",
    DRAFTS:          "/tenants/drafts",           // POST save draft
    DRAFT_APPROVAL:  "/tenants/drafts",           // append /{id}/request-approval
    DRAFT_SUBMIT:    "/tenants/drafts",           // append /{id}/submit
  },
} as const;
