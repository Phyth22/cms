/**
 * MiniStat — Small stat display with label and value.
 */
import React from "react";

interface MiniStatProps { label: string; value: string; }

export function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="border border-[#E9EDEF] rounded-xl bg-white p-2.5">
      <div className="text-[11px] text-[#667781]">{label}</div>
      <div className="mt-1.5 font-black text-[14px] text-[#111B21]">{value}</div>
    </div>
  );
}
