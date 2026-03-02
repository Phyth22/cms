/**
 * AuditTrailCard — Audit-Grade Trail (Irrefutable) — Recent Sensitive Actions
 *
 * Displays hash-chained, tamper-evident audit entries.
 * Each line: timestamp — actor + action — state badge
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export interface AuditEntry {
  time:   string;
  text:   string;
  state?: "HIC" | "pending HITL" | "blocked" | "saved" | "pending HIC";
}

interface AuditTrailCardProps {
  entries?:   AuditEntry[];
  retention?: string;
}

const stateCls: Record<string, string> = {
  "HIC":          "text-[#EF4444] font-extrabold",
  "pending HITL": "text-[#F97316] font-extrabold",
  "pending HIC":  "text-[#EF4444] font-extrabold",
  "blocked":      "text-[#667781] font-extrabold",
  "saved":        "text-[#25D366] font-extrabold",
};

const DEFAULT_ENTRIES: AuditEntry[] = [
  { time: "09:14", text: "SYS_ADMIN approved token mint +100k T (Tenant: 3D-Services)",               state: "HIC"          },
  { time: "09:11", text: "Waswa suggested price surge +12% for VEBA 'Excavators'",                     state: "pending HITL" },
  { time: "09:05", text: "Export CSV 12,000 rows (Reports)",                                            state: "blocked"      },
  { time: "08:58", text: "MFA enforcement set to 'Required' for all admins",                            state: "saved"        },
  { time: "08:44", text: "Account suspension request (Dealer subtree)",                                 state: "pending HIC"  },
];

export function AuditTrailCard({
  entries   = DEFAULT_ENTRIES,
  retention = "365d (plan governed)",
}: AuditTrailCardProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF] flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="font-black text-[14px] text-[#111B21]">
            Audit-Grade Trail (Irrefutable) — Recent Sensitive Actions
          </div>
          <div className="text-[11px] text-[#667781] mt-0.5">
            All high-risk actions require approval + are hash-chained (tamper-evident).
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-[#34B7F1] whitespace-nowrap">
          Retention: {retention}
        </span>
      </div>

      {/* Entries */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-2 text-[12px] leading-relaxed">
            <span className="text-[#667781] shrink-0 font-mono">{entry.time}</span>
            <span className="text-[#667781]">—</span>
            <span className="text-[#111B21]">{entry.text}</span>
            {entry.state && (
              <>
                <span className="text-[#667781]">—</span>
                <span className={`shrink-0 ${stateCls[entry.state] ?? "text-[#667781]"}`}>
                  {entry.state}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
