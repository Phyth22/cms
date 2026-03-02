/**
 * GatewayTable — Payments & Mobile Money Gateway Health
 *
 * Shows provider success rate, p95 latency, webhook backlog, and status
 * pill per gateway. Below the table, renders optional VEBA mini-stat boxes.
 *
 * Used in the OPS WAR ROOM main blade (top-right of 2-col grid).
 */
import React from "react";

export type GatewayStatus = "OK" | "Degraded" | "Down";

export interface GatewayRow {
  id:             string;
  provider:       string;
  successRate:    number;
  p95LatencySec:  number;
  backlog:        number;
  status:         GatewayStatus;
}

export interface VebaMiniStat {
  id:     string;
  metric: string;
  value:  string;
  tone:   "good" | "warn" | "bad" | "neutral";
}

interface GatewayTableProps {
  rows:          GatewayRow[];
  vebaMinis?:    VebaMiniStat[];
  onRerun?:      () => void;
  onOpenGateways?: () => void;
}

const statusPill: Record<GatewayStatus, string> = {
  OK:       "bg-[#EAFBEF] border-[#C7F2D4] text-[#1A7A3A]",
  Degraded: "bg-[#FFF8E1] border-[#FFE08A] text-[#7A5E00]",
  Down:     "bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]",
};

const toneBg: Record<string, string> = {
  good:    "bg-[#EAFBEF] border-[#C7F2D4]",
  warn:    "bg-[#FFF8E1] border-[#FFE08A]",
  bad:     "bg-[#FFEBEE] border-[#FFCDD2]",
  neutral: "bg-[#F8F9FA] border-[#E9EDEF]",
};

export function GatewayTable({ rows, vebaMinis, onRerun, onOpenGateways }: GatewayTableProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E9EDEF]">
        <span className="font-extrabold text-[13px] text-[#111B21]">Payments + Mobile Money health</span>
        <div className="flex gap-2">
          <button
            onClick={onRerun}
            className="h-7 px-2.5 rounded-lg border border-[#E9EDEF] bg-white text-[11px] text-[#667781] cursor-pointer hover:bg-[#F8F9FA] transition-colors"
          >
            Re-run webhooks
          </button>
          <button
            onClick={onOpenGateways}
            className="h-7 px-2.5 rounded-lg border border-[#E9EDEF] bg-[#EAFBEF] border-[#C7F2D4] text-[11px] text-[#1A7A3A] font-extrabold cursor-pointer hover:brightness-95 transition-all"
          >
            Open Gateways
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]">
              {["Provider", "Success %", "p95 (s)", "Backlog", "Status"].map((h) => (
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
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] font-extrabold text-[12px] text-[#111B21] whitespace-nowrap">
                  {row.provider}
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#111B21]">
                  {row.successRate.toFixed(1)}%
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#111B21]">
                  {row.p95LatencySec.toFixed(1)}s
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#111B21]">
                  {row.backlog}
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF]">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border whitespace-nowrap ${statusPill[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VEBA mini-stats below table */}
      {vebaMinis && vebaMinis.length > 0 && (
        <div className="grid grid-cols-2 gap-2 p-3 border-t border-[#E9EDEF]">
          {vebaMinis.map((v) => (
            <div
              key={v.id}
              className={`rounded-lg border p-2.5 ${toneBg[v.tone]}`}
            >
              <div className="text-[10px] text-[#667781] leading-tight">{v.metric}</div>
              <div className="font-extrabold text-[13px] text-[#111B21] mt-1">{v.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
