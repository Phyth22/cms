/**
 * CorrelationClustersCard — Correlation Clusters (Root Cause)
 *
 * Matches MID screenshot:
 *   Cluster A (orange) — Kafka lag ↔ alert delays — Impact: P2 spikes
 *   Cluster B (red)    — Leakage Guard ↔ booking drop — Impact: VEBA margin
 *   Cluster C (yellow) — MTN retry queue ↔ token top-ups — Impact: churn risk
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export interface Cluster {
  id:      string;
  label:   string;
  title:   string;
  impact:  string;
  color:   "red" | "orange" | "yellow" | "green" | "blue";
}

interface CorrelationClustersCardProps {
  clusters?: Cluster[];
}

const clusterBadgeCls: Record<string, string> = {
  red:    "bg-[#EF4444] text-white",
  orange: "bg-[#F97316] text-white",
  yellow: "bg-[#FBBF24] text-[#7A5E00]",
  green:  "bg-[#25D366] text-[#075E54]",
  blue:   "bg-[#34B7F1] text-white",
};

const DEFAULT_CLUSTERS: Cluster[] = [
  { id: "a", label: "Cluster A", title: "Kafka lag ↔ alert delays",          impact: "Impact: P2 spikes",    color: "orange" },
  { id: "b", label: "Cluster B", title: "Leakage Guard ↔ booking drop",     impact: "Impact: VEBA margin",  color: "red"    },
  { id: "c", label: "Cluster C", title: "MTN retry queue ↔ token top-ups",  impact: "Impact: churn risk",   color: "yellow" },
];

export function CorrelationClustersCard({ clusters = DEFAULT_CLUSTERS }: CorrelationClustersCardProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">Correlation Clusters (Root Cause)</div>
      </div>
      <div className="flex flex-col divide-y divide-[#E9EDEF]">
        {clusters.map((c) => (
          <div key={c.id} className="px-4 py-3 flex items-start gap-3">
            <span className={`shrink-0 text-[10px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${clusterBadgeCls[c.color]}`}>
              {c.label}
            </span>
            <div className="min-w-0">
              <div className="font-extrabold text-[12px] text-[#111B21] leading-snug">{c.title}</div>
              <div className="text-[11px] text-[#667781] mt-0.5">{c.impact}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}