/**
 * Kpi — KPI card with severity accent bar and status badge.
 */
import React from "react";
import type { Severity } from "../../types";
import { sevAccent, sevPill, sevLabel } from "../../theme/severity";

interface KpiProps { title: string; value: string; sub: string; sev: Severity; }

export function Kpi({ title, value, sub, sev }: KpiProps) {
  return (
    <div className="relative border border-[#E9EDEF] rounded-xl p-3 bg-white min-h-[84px]">
      <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${sevAccent[sev]}`} />
      <div className="text-[11px] text-[#667781] pl-1">{title}</div>
      <div className="text-[18px] font-black text-[#111B21] mt-1 pl-1">{value}</div>
      <div className="text-[11px] text-[#667781] mt-0.5 max-w-[78%] pl-1">{sub}</div>
      <span className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${sevPill[sev]}`}>
        {sevLabel[sev]}
      </span>
    </div>
  );
}
