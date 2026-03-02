/**
 * TrashRestoreCard — Trash & Restore (Soft Delete)
 *
 * Matches BOTTOM screenshot:
 *   Header note: "Deleted rules retained 30 days. Restore requires HITL if $$ impact."
 *   Table: Deleted Item | Age | Action (Restore button)
 *   Footer: Open Audit Logs button
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export interface TrashedRule {
  id:    string;
  name:  string;
  age:   string;
  hitl?: boolean;
}

interface TrashRestoreCardProps {
  items?:          TrashedRule[];
  onRestore?:      (id: string) => void;
  onOpenAuditLogs?:() => void;
}

const DEFAULT_ITEMS: TrashedRule[] = [
  { id: "t1", name: "WhatsApp Flood Guard", age: "2d",  hitl: false },
  { id: "t2", name: "Old Fuel Rule v1",     age: "6d",  hitl: false },
  { id: "t3", name: "Overspeed Legacy",     age: "12d", hitl: true  },
];

export function TrashRestoreCard({
  items          = DEFAULT_ITEMS,
  onRestore,
  onOpenAuditLogs,
}: TrashRestoreCardProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">Trash & Restore (Soft Delete)</div>
        <div className="text-[11px] text-[#667781] mt-0.5">
          Deleted rules retained 30 days. Restore requires HITL if $$ impact.
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-[#E9EDEF] bg-[#F8F9FA]">
            {["Deleted Item", "Age", "Action"].map((h) => (
              <th key={h} className="text-left px-4 py-2 text-[11px] font-extrabold text-[#667781]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} className={`border-b border-[#E9EDEF] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
              <td className="px-4 py-2.5 font-extrabold text-[#111B21]">{item.name}</td>
              <td className="px-4 py-2.5 text-[#667781]">{item.age}</td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => onRestore?.(item.id)}
                  className="h-7 px-3 rounded-full bg-[#F0F2F5] text-[#111B21] text-[10px] font-extrabold border-none cursor-pointer hover:bg-[#E9EDEF] transition-all whitespace-nowrap"
                >
                  {item.hitl ? "Restore (HITL)" : "Restore"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#E9EDEF]">
        <button
          onClick={onOpenAuditLogs}
          className="h-8 px-4 rounded-full bg-[#34B7F1] text-white text-[11px] font-extrabold border-none cursor-pointer hover:brightness-105 transition-all whitespace-nowrap"
        >
          Open Audit Logs
        </button>
      </div>
    </div>
  );
}