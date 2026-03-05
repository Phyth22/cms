/**
 * tenants.types.ts — Types and interfaces for the Tenants API.
 *
 * Covers: CRUD, import, trash/restore for the Tenant Tower feature.
 */

// ── Shared enums / literals ─────────────────────────────────────────────────

export type TenantTier = "TOP" | "DEAL" | "CLIENT" | "ORG";

export type TenantStatus = "active" | "suspended" | "trashed";

// ── Core tenant record ──────────────────────────────────────────────────────

export interface Tenant {
  id:          string;
  name:        string;
  tier:        TenantTier;
  parent_id:   string | null;
  parent_name: string | null;
  country:     string;
  currency:    string;
  timezone:    string;
  health:      number;
  burn_rate:   string;
  veba:        boolean;
  status:      TenantStatus;
  unit_count:  number;
  date_created: string;
}

// ── Create tenant / sub-org ─────────────────────────────────────────────────

export interface CreateTenantRequest {
  name:       string;
  tier:       TenantTier;
  parent_id:  string | null;
  country:    string;
  currency:   string;
  timezone:   string;
  // Billing & Tokens
  billing_plan?:      string;
  retention_days?:    number;
  daily_token_cap?:   number;
  topup_channels?:    Record<string, boolean>;
  // Modules
  modules?:           Record<string, boolean>;
  // RBAC
  roles?:             Record<string, boolean>;
}

export interface CreateTenantResponse {
  tenant_id: string;
}

// ── Drafts & HITL Approval ──────────────────────────────────────────────────

export interface SaveDraftRequest extends CreateTenantRequest {
  draft_id?: string;
}

export interface SaveDraftResponse {
  draft_id: string;
  status:   string;
}

export interface RequestApprovalResponse {
  draft_id:    string;
  approval_id: string;
  status:      string;
}

export interface SubmitDraftResponse {
  tenant_id: string;
  draft_id:  string;
}

// ── Import ──────────────────────────────────────────────────────────────────

export interface ImportTenantsRequest {
  file: File;
}

export interface ImportTenantsResponse {
  imported: number;
  skipped:  number;
  errors:   string[];
}

// ── Trash / Restore ─────────────────────────────────────────────────────────

export interface TrashedTenant {
  id:           string;
  name:         string;
  tier:         TenantTier;
  trashed_at:   string;
  age:          string;
  hitl_required: boolean;
}

export interface TrashTenantResponse {
  tenant_id: string;
  trashed:   boolean;
}

export interface RestoreTenantResponse {
  tenant_id: string;
  restored:  boolean;
}

// ── KPIs ────────────────────────────────────────────────────────────────────

export interface TenantKpis {
  total_accounts:          number;
  accounts_delta_week:     number;
  active_units:            number;
  online_pct:              number;
  token_exposure_24h:      number;
  token_exposure_currency: string;
  runout_72h_count:        number;
  payment_success_24h:     number;
  payment_p95_latency:     number;
}

// ── Token Wallet ─────────────────────────────────────────────────────────────

export interface TokenDrain {
  name: string;
  pct:  number;
}

export interface TenantWallet {
  tenant_id:    string;
  balance:      number;
  burn_rate:    number;
  runout_hours: number;
  capacity_pct: number;
  top_drains:   TokenDrain[];
}

// ── Wallet Actions ──────────────────────────────────────────────────────────

export interface TopUpRequest {
  tenant_id: string;
  amount:    number;
  reference: string;
}

export interface TopUpResponse {
  tenant_id:   string;
  new_balance: number;
}

export interface AllocateRequest {
  from_tenant_id: string;
  to_tenant_id:   string;
  amount:         number;
}

export interface AllocateResponse {
  from_tenant_id:  string;
  to_tenant_id:    string;
  from_new_balance: number;
  to_new_balance:   number;
}

export interface MintRequest {
  tenant_id: string;
  amount:    number;
  reason:    string;
}

export interface MintResponse {
  approval_id: string;
  status:      "pending";
}

// ── Approvals Queue ─────────────────────────────────────────────────────────

export interface Approval {
  id:           string;
  type:         string;
  title:        string;
  tenant_name:  string;
  meta:         string;
  requirement:  string;
  status:       string;
  requested_at: string;
  requested_by: string;
  draft_id?:    string | null;
}

export interface ApprovalActionResponse {
  approval_id: string;
  status:      "approved" | "rejected";
  tokens_credited?: number;
}

// ── Usage Events ────────────────────────────────────────────────────────────

export interface UsageEvent {
  id:        string;
  topic:     string;
  type:      string;
  tenant:    string;
  action:    string;
  tokens:    number;
  cost:      string;
  guardrail: string;
  timestamp: string;
}

// ── Audit Trail ─────────────────────────────────────────────────────────────

export interface AuditTrailEntry {
  id:        string;
  timestamp: string;
  tag:       string;
  title:     string;
  actor:     string;
  hash_prev: string;
  hash_this: string;
}

// ── List (for dropdowns / hierarchy) ────────────────────────────────────────

export interface TenantListItem {
  id:   string;
  name: string;
  tier: TenantTier;
}
