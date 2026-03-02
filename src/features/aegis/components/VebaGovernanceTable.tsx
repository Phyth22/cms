/**
 * VebaGovernanceTable — VEBA Marketplace Governance / Leakage Prevention
 *
 * Displays a signal table matching the screenshot:
 *   Signal | Today count | Δ vs 7d | Top segment | Action link
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export interface VebaSignalRow {
  signal:     string;
  today:      number | string;
  delta:      string;
  topSegment: string;
  action:     string;
  onAction?:  () => void;
}

interface VebaGovernanceTableProps {
  rows?:     VebaSignalRow[];
  title?:    string;
  subtitle?: string;
}

const DEFAULT_ROWS: VebaSignalRow[] = [
  { signal: "Contact sharing attempts blocked", today: 342, delta: "+2.1×", topSegment: "Boda (KE-NBO)",   action: "Review offenders ▸" },
  { signal: "Unpaid-but-moving asset events",   today: 19,  delta: "+1.3×", topSegment: "Pickups (UG-KLA)",action: "Auto MoMo prompt ▸"},
  { signal: "Suspicious view→no-booking users", today: 88,  delta: "+0.4×", topSegment: "Dozers (KE-KIS)", action: "Require deposit ▸" },
  { signal: "Disputes aging >7d",               today: 14,  delta: "+0.9×", topSegment: "Vans (UG-ENT)",   action: "Open queue ▸"     },
];

export function VebaGovernanceTable({
  rows     = DEFAULT_ROWS,
  title    = "VEBA Marketplace Governance — Leakage Prevention",
  subtitle = "Airbnb-style info gating. AI flags bypass behavior; humans decide sanctions.",
}: VebaGovernanceTableProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF]">
        <div className="font-black text-[14px] text-[#111B21]">{title}</div>
        <div className="text-[11px] text-[#667781] mt-0.5">{subtitle}</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#E9EDEF]">
              {["Signal", "Today", "Δ vs 7d", "Top segment", "Action"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-[11px] font-extrabold text-[#667781] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8F9FA] transition-colors"
              >
                <td className="px-4 py-3 text-[#111B21]">{row.signal}</td>
                <td className="px-4 py-3 font-extrabold text-[#111B21]">{row.today}</td>
                <td className="px-4 py-3 font-extrabold text-[#F97316]">{row.delta}</td>
                <td className="px-4 py-3 text-[#667781] whitespace-nowrap">{row.topSegment}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={row.onAction}
                    className="text-[#34B7F1] font-extrabold hover:underline cursor-pointer bg-transparent border-none text-[12px] whitespace-nowrap"
                  >
                    {row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
