/**
 * AlarmKpiGrid — Alarm Factory Live KPI Cards (6-up grid)
 *
 * Two rows of 3 cards each matching the TOP screenshot:
 *   Row 1: P1 Critical | P2 Alarm | Noise Index
 *   Row 2: Delivery Fail | Token Burn (alerts) | VEBA Leakage
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export interface AlarmKpi {
  id:    string;
  label: string;
  value: string;
  sub:   string;
  live?: boolean;
  tone?: "critical" | "alarm" | "warn" | "ok" | "neutral";
}

interface AlarmKpiGridProps {
  kpis?: AlarmKpi[];
}

const toneCls: Record<string, string> = {
  critical: "text-[#EF4444]",
  alarm:    "text-[#F97316]",
  warn:     "text-[#FBBF24]",
  ok:       "text-[#25D366]",
  neutral:  "text-[#111B21]",
};

const DEFAULT_KPIS: AlarmKpi[] = [
  { id: "p1",       label: "P1 Critical",        value: "3",           sub: "Unacked > 30m",   live: true, tone: "critical" },
  { id: "p2",       label: "P2 Alarm",            value: "19",          sub: "Unacked > 10m",   live: true, tone: "alarm"    },
  { id: "noise",    label: "Noise Index",          value: "41/unit/day", sub: "Target < 20",     live: true, tone: "warn"     },
  { id: "delivery", label: "Delivery Fail",        value: "6.2%",        sub: "WhatsApp/SMS",    live: true, tone: "alarm"    },
  { id: "burn",     label: "Token Burn (alerts)",  value: "0.11 TK/s",   sub: "Messaging costs", live: true, tone: "warn"     },
  { id: "veba",     label: "VEBA Leakage",         value: "↑ 12%",       sub: "Boda sector",     live: true, tone: "alarm"    },
];

export function AlarmKpiGrid({ kpis = DEFAULT_KPIS }: AlarmKpiGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {kpis.map((k) => (
        <div key={k.id} className="bg-white border border-[#E9EDEF] rounded-xl p-4 flex flex-col gap-1 min-h-[96px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#667781] font-extrabold leading-tight">{k.label}</span>
            {k.live && (
              <span className="shrink-0 text-[9px] font-extrabold bg-[#F97316] text-white px-2 py-0.5 rounded-full">
                LIVE
              </span>
            )}
          </div>
          <div className={`text-[26px] font-black leading-tight ${toneCls[k.tone ?? "neutral"]}`}>
            {k.value}
          </div>
          <div className="text-[11px] text-[#667781]">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}