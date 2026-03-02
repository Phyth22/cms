/**
 * HITLApprovalTable — HITL / HIC Approval Queue Table
 *
 * Displays the immutable approval log with time, action, state badge,
 * actor, and a Review button for pending items.
 *
 * Used in the OPS WAR ROOM main blade (bottom-right of 2-col grid).
 * Different from HITLQueueBlade (which shows a card list) — this is
 * a proper data table matching the ops war room design.
 */
import React from "react";

export type ApprovalState = "Pending" | "Approved" | "Rejected";

export interface ApprovalRow {
  id:     string;
  time:   string;
  action: string;
  state:  ApprovalState;
  actor:  string;
}

interface HITLApprovalTableProps {
  rows:             ApprovalRow[];
  onViewBrief?:     () => void;
  onOpenAuditLog?:  () => void;
  onReview?:        (id: string) => void;
}

const stateStyles: Record<ApprovalState, string> = {
  Pending:  "bg-[#FFF8E1] text-[#7A5E00] border-[#FFE08A]",
  Approved: "bg-[#EAFBEF] text-[#1A7A3A] border-[#C7F2D4]",
  Rejected: "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]",
};

export function HITLApprovalTable({ rows, onViewBrief, onOpenAuditLog, onReview }: HITLApprovalTableProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E9EDEF]">
        <span className="font-extrabold text-[13px] text-[#111B21]">HITL / HIC approval queue</span>
        <div className="flex gap-2">
          <button
            onClick={onViewBrief}
            className="h-7 px-2.5 rounded-lg border border-[#E9EDEF] bg-white text-[11px] text-[#667781] cursor-pointer hover:bg-[#F8F9FA] transition-colors"
          >
            View daily brief
          </button>
          <button
            onClick={onOpenAuditLog}
            className="h-7 px-2.5 rounded-lg border border-[#EAFBEF] bg-[#EAFBEF] text-[11px] text-[#1A7A3A] font-extrabold cursor-pointer hover:brightness-95 transition-all"
          >
            Open Audit Log
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]">
              {["Time", "Action", "State", "Actor", ""].map((h) => (
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
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#667781] whitespace-nowrap font-mono">
                  {row.time}
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] font-extrabold text-[#111B21]">
                  {row.action}
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF]">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border whitespace-nowrap ${stateStyles[row.state]}`}>
                    {row.state}
                  </span>
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF] text-[12px] text-[#667781]">
                  {row.actor}
                </td>
                <td className="px-3 py-2.5 border-b border-[#E9EDEF]">
                  {row.state === "Pending" ? (
                    <button
                      onClick={() => onReview?.(row.id)}
                      className="h-6 px-2 rounded border border-[#E9EDEF] bg-white text-[11px] text-[#667781] cursor-pointer hover:bg-[#F0F2F5] transition-colors"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-[12px] text-[#667781]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
