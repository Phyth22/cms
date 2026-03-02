/**
 * OpsKpiCard — War Room KPI card with tone accent, delta badge, and helper text.
 *
 * Matches the 4-column top KPI grid in OPS WAR ROOM (Screen 03).
 * Different from the primitives Kpi component: uses a top border accent,
 * coloured delta badge inline, and a helper line below.
 *
 * Tone colours:
 *   good    → green accent + green badge
 *   warn    → orange accent + orange badge (ALARM)
 *   bad     → red accent + red badge
 *   neutral → grey accent
 */
import React from "react";

export type KpiTone = "good" | "warn" | "bad" | "neutral";

const topAccent: Record<KpiTone, string> = {
  good:    "border-t-[#25D366]",
  warn:    "border-t-[#F97316]",
  bad:     "border-t-[#EF4444]",
  neutral: "border-t-[#E9EDEF]",
};

const deltaBadge: Record<KpiTone, string> = {
  good:    "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]",
  warn:    "bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]",
  bad:     "bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]",
  neutral: "bg-[#F8F9FA] text-[#667781] border-[#E9EDEF]",
};

interface OpsKpiCardProps {
  label:   string;
  value:   string;
  delta?:  string;
  helper?: string;
  tone:    KpiTone;
}

export function OpsKpiCard({ label, value, delta, helper, tone }: OpsKpiCardProps) {
  return (
    <div className={`
      bg-white border border-[#E9EDEF] border-t-4 rounded-xl p-3
      flex flex-col gap-1 min-w-0
      shadow-[0_1px_4px_rgba(0,0,0,0.05)]
      ${topAccent[tone]}
    `}>
      <div className="text-[12px] text-[#667781] font-medium">{label}</div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[22px] font-black text-[#111B21] leading-none">{value}</span>
        {delta && (
          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border whitespace-nowrap ${deltaBadge[tone]}`}>
            {delta}
          </span>
        )}
      </div>

      {helper && (
        <div className="text-[11px] text-[#667781] mt-0.5 leading-snug">{helper}</div>
      )}
    </div>
  );
}