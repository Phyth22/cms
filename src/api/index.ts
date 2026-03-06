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
export { get, getRaw, post, put, patch, del } from "./client";

// Central endpoint registry
export { ENDPOINTS } from "./endpoints";

// ── Domain types ─────────────────────────────────────────────────────────────

export type {
  CreateSimCardRequest,
  CreateSimCardResponse,
  SimCard,
  SimStatistics,
  ApiPerformanceMetrics,
  DiskDevice,
  SupervisorProcess,
  SystemdService,
  GunicornWorker,
  ServerMetrics,
  Gateway,
  GatewaysResponse,
  GatewayHistoryEntry,
  GatewayHistoryResponse,
  UpdateGatewayRequest,
  UpdateGatewayResponse,
  VebaStatistics,
  TenantTier,
  TenantStatus,
  Tenant,
  CreateTenantRequest,
  CreateTenantResponse,
  ImportTenantsResponse,
  TrashedTenant,
  TrashTenantResponse,
  RestoreTenantResponse,
  TenantListItem,
  TenantKpis,
  TokenDrain,
  TenantWallet,
  TopUpRequest,
  TopUpResponse,
  AllocateRequest,
  AllocateResponse,
  MintRequest,
  MintResponse,
  Approval,
  ApprovalActionResponse,
  UsageEvent,
  AuditTrailEntry,
  SaveDraftResponse,
  RequestApprovalResponse,
  SubmitDraftResponse,
} from "./types";

// ── Domain services ──────────────────────────────────────────────────────────

export { isUserLoggedIn, getAccountUid, startSessionMonitor, stopSessionMonitor } from "./services/auth.service";
export { createSimCard, getAllSimCards } from "./services/simcards.service";
export { getSimStatistics } from "./services/statistics.service";
export { getServerMetrics, getApiPerformance } from "./services/metrics.service";
export { getMobileMoneyGateways, getGatewayHistory, updateGatewayStatus } from "./services/gateways.service";
export { getVebaStatistics } from "./services/veba.service";
export {
  createTenant,
  getAllTenants,
  importTenants,
  downloadImportTemplate,
  trashTenant,
  restoreTenant,
  getTrashedTenants,
  getTenantKpis,
  getTenantWallet,
  topUpWallet,
  allocateTokens,
  mintTokens,
  getUsageEvents,
  getApprovals,
  approveRequest,
  rejectRequest,
  getAuditTrail,
  saveDraft,
  requestDraftApproval,
  submitApprovedDraft,
} from "./services/tenants.service";
