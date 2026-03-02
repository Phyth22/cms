/**
 * IncidentTimelineCard — Incident Timeline (P1/P2) + Audit Proof
 *
 * Matches BOTTOM screenshot:
 *   Header + subtitle: "Irrefutable logging: acknowledgements, snoozes, penalties are hash-chained."
 *   Timeline entries: coloured sev dot + time + bold title + sub-line
 *   Footer buttons: Generate Postmortem | Export PDF
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export type IncidentSev = "P1" | "P2" | "P3" | "P4";

export interface IncidentEntry {
  id:    string;
  sev:   IncidentSev;
  time:  string;
  title: string;
  sub:   string;
}

interface IncidentTimelineCardProps {
  entries?:          IncidentEntry[];
  onPostmortem?:     () => void;
  onExportPdf?:      () => void;
}

const sevDot: Record<IncidentSev, string> = {
  P1: "bg-[#EF4444]",
  P2: "bg-[#F97316]",
  P3: "bg-[#FBBF24]",
  P4: "bg-[#25D366]",
};

const DEFAULT_ENTRIES: IncidentEntry[] = [
  { id: "e1", sev: "P1", time: "13:38", title: "P1 Leakage Guard triggered (VEBA Boda)",  sub: "HITL pending: suspend listing?"  },
  { id: "e2", sev: "P2", time: "13:36", title: "Kafka lag crossed 5s threshold",           sub: "AI suggests autoscale consumers" },
  { id: "e3", sev: "P2", time: "13:33", title: "MTN retry queue 42",                       sub: "Auto-retry + notify finance"     },
  { id: "e4", sev: "P3", time: "13:29", title: "Tender timeout for D8-004",                sub: ""                                },
];

export function IncidentTimelineCard({
  entries       = DEFAULT_ENTRIES,
  onPostmortem,
  onExportPdf,
}: IncidentTimelineCardProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">Incident Timeline (P1/P2) + Audit Proof</div>
        <div className="text-[11px] text-[#667781] mt-0.5">
          Irrefutable logging: acknowledgements, snoozes, penalties are hash-chained.
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col divide-y divide-[#E9EDEF] flex-1">
        {entries.map((e) => (
          <div key={e.id} className="px-4 py-3 flex items-start gap-3">
            <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${sevDot[e.sev]}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#667781] shrink-0">{e.time}</span>
                <span className="font-extrabold text-[12px] text-[#111B21] leading-snug">{e.title}</span>
              </div>
              {e.sub && <div className="text-[11px] text-[#667781] mt-0.5 ml-[calc(4ch+8px)]">{e.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#E9EDEF] flex gap-2 flex-wrap justify-end">
        <button
          onClick={onPostmortem}
          className="h-8 px-4 rounded-full bg-[#34B7F1] text-white text-[11px] font-extrabold border-none cursor-pointer hover:brightness-105 transition-all whitespace-nowrap"
        >
          Generate Postmortem
        </button>
        <button
          onClick={onExportPdf}
          className="h-8 px-4 rounded-full bg-[#F0F2F5] text-[#111B21] text-[11px] font-extrabold border-none cursor-pointer hover:bg-[#E9EDEF] transition-all whitespace-nowrap"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}