/**
 * StatusStrip — Secondary Navigation / Context Bar
 *
 * A thin horizontal bar directly beneath the TopBar that surfaces
 * real-time system status chips (scope, wallet balance, burn rate, etc.)
 * alongside quick-action buttons.
 */
import React from "react";

interface StatusChip {
  id: string;
  label: string;
}

interface StripAction {
  id: string;
  label: string;
  variant: "green" | "azure" | "teal" | "ghost" | "red";
  onClick?: () => void;
}

interface StatusStripProps {
  chips?: StatusChip[];
  actions?: StripAction[];
}

const DEFAULT_CHIPS: StatusChip[] = [
  { id: "scope",   label: "Scope: Dealer→Client→Org" },
  { id: "rbac",    label: "RBAC: SYSADMIN / Admin" },
  { id: "wallet",  label: "Wallet: UGX 8.6M • 1.24M Tok" },
  { id: "burn",    label: "Burn: 1.7 Tok/s" },
  { id: "runout",  label: "Run-out: ≈ 8.1 days" },
  { id: "status",  label: "Status: 🟢 Green • 99.82%" },
  { id: "fresh",   label: "Fresh: p95 22s • last msg 7s" },
  { id: "alerts",  label: "Alerts: P1:2  P2:11" },
  { id: "pay",     label: "Pay: M-Pesa OK • MTN OK" },
  { id: "waswa",   label: "Waswa: ON • HITL 3" },
  { id: "range",   label: "Range: 24h" },
  { id: "audit",   label: "Audit: ON • 89d" },
];

const DEFAULT_ACTIONS: StripAction[] = [
  { id: "new",    label: "+ New",  variant: "green" },
  { id: "export", label: "Export", variant: "azure" },
];

export function StatusStrip({
  chips = DEFAULT_CHIPS,
  actions = DEFAULT_ACTIONS,
}: StatusStripProps) {
  return (
    <div className="strip">
      <div className="chips">
        {chips.map((c) => (
          <span key={c.id} className="chip">
            {c.label}
          </span>
        ))}
      </div>

      <div className="stripActions">
        {actions.map((a) => (
          <button key={a.id} className={`btn ${a.variant}`} onClick={a.onClick}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
