/**
 * AlarmTable — Live Alarms Table (P1/P2/P3)
 *
 * Displays live alarm rows with a coloured severity dot, alert name,
 * event count, age, notification channel, and an Open CTA per row.
 *
 * Used in the OPS WAR ROOM main blade (top-left of the 2-col grid).
 */
import React from "react";

export type AlarmSeverity = "warning" | "alarm" | "critical";

export interface AlarmRow {
  id:       string;
  name:     string;
  count:    number;
  severity: AlarmSeverity;
  age:      string;
  channel:  string;
}

interface AlarmTableProps {
  rows:         AlarmRow[];
  onAckAll?:    () => void;
  onOpenCenter?: () => void;
  onOpenRow?:   (id: string) => void;
}

const sevDot: Record<AlarmSeverity, string> = {
  warning:  "bg-[#FBBF24]",
  alarm:    "bg-[#F97316]",
  critical: "bg-[#EF4444]",
};

export function AlarmTable({ rows, onAckAll, onOpenCenter, onOpenRow }: AlarmTableProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E9EDEF]">
        <span className="font-extrabold text-[13px] text-[#111B21]">Live alarms (P1/P2/P3)</span>
        <div className="flex gap-2">
          <button
            onClick={onAckAll}
            className="h-7 px-2.5 rounded-lg border border-[#E9EDEF] bg-white text-[11px] text-[#667781] cursor-pointer hover:bg-[#F8F9FA] transition-colors"
          >
            Acknowledge all
          </button>
          <button
            onClick={onOpenCenter}
            className="h-7 px-2.5 rounded-lg border border-[#E9EDEF] bg-white text-[11px] text-[#667781] cursor-pointer hover:bg-[#F8F9FA] transition-colors"
          >
            Open Alarm Center
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]">
              {["Sev", "Alert", "Count", "Age", "Channel", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] text-[#667781] font-extrabold px-3 py-2.5 border-b border-[#E9EDEF] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#FBFEFD] transition-colors">
                {/* Severity dot */}
                <td className="px-3 py-2.5 border-b border-[#E9EDEF]">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${sevDot[row.severity]}`} />
                </td>

                {/* Alert name */}
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] font-extrabold text-[12px] text-[#111B21] max-w-[240px]">
                  {row.name}
                </td>

                {/* Count */}
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#667781]">
                  {row.count}
                </td>

                {/* Age */}
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#667781] whitespace-nowrap">
                  {row.age}
                </td>

                {/* Channel */}
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#667781] whitespace-nowrap">
                  {row.channel}
                </td>

                {/* Action */}
                <td className="px-3 py-2.5 border-b border-[#E9EDEF]">
                  <button
                    onClick={() => onOpenRow?.(row.id)}
                    className="h-6 px-2 rounded border border-[#E9EDEF] bg-white text-[11px] text-[#667781] cursor-pointer hover:bg-[#F0F2F5] transition-colors"
                  >
                    Open
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
