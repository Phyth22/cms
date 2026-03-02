/**
 * PaymentGatewaysCard — Mobile Money + ePayment Gateways
 *
 * Displays a live health summary for all payment providers:
 *   Provider name | Success rate | Settle p95 | Retries/notes
 *
 * Matches screenshot: each provider on its own line with stats.
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export type ProviderStatus = "OK" | "WARN" | "CRITICAL";

export interface PaymentProvider {
  name:    string;
  success: string;
  settle:  string;
  note:    string;
  status:  ProviderStatus;
}

interface PaymentGatewaysCardProps {
  providers?: PaymentProvider[];
  lastUpdated?: string;
}

const statusBadge: Record<ProviderStatus, string> = {
  OK:       "bg-[#25D366] text-white",
  WARN:     "bg-[#F97316] text-white",
  CRITICAL: "bg-[#EF4444] text-white",
};

const DEFAULT_PROVIDERS: PaymentProvider[] = [
  { name: "MTN (UG)",   success: "98.1%", settle: "p95 6m",  note: "webhook backlog 12", status: "OK"   },
  { name: "Airtel (UG)",success: "96.2%", settle: "p95 11m", note: "retries 29",          status: "WARN" },
  { name: "Airtel (KE)",success: "97.4%", settle: "p95 8m",  note: "retries 4",           status: "OK"   },
  { name: "M-Pesa (KE)",success: "99.0%", settle: "p95 4m",  note: "callback gaps 0",     status: "OK"   },
  { name: "Cards",      success: "94.6%", settle: "—",       note: "3DS failures 1.1%",   status: "WARN" },
];

export function PaymentGatewaysCard({
  providers   = DEFAULT_PROVIDERS,
  lastUpdated = "Last 15m",
}: PaymentGatewaysCardProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF] flex items-center justify-between">
        <div>
          <div className="font-black text-[13px] text-[#111B21]">Mobile Money + ePayment Gateways</div>
          <div className="text-[11px] text-[#667781] mt-0.5">
            MTN MoMo • Airtel Money • M-Pesa • Cards (Pesapal/DPO) — webhooks monitored
          </div>
        </div>
        <span className="text-[11px] text-[#667781] whitespace-nowrap shrink-0 ml-3">{lastUpdated}</span>
      </div>

      {/* Provider list */}
      <div className="flex flex-col divide-y divide-[#F0F2F5] px-4 py-1">
        {providers.map((p) => (
          <div key={p.name} className="flex items-center gap-3 py-2.5">
            {/* Status dot */}
            <span className={`shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${statusBadge[p.status]}`}>
              {p.status}
            </span>
            {/* Name */}
            <span className="font-extrabold text-[12px] text-[#111B21] whitespace-nowrap w-[90px] shrink-0">
              {p.name}
            </span>
            {/* Stats */}
            <span className="text-[12px] text-[#111B21]">{p.success} success</span>
            <span className="text-[11px] text-[#667781]">• settle {p.settle}</span>
            <span className="text-[11px] text-[#667781] ml-auto whitespace-nowrap">• {p.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
