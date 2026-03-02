/**
 * Bar — Horizontal resource usage bar with label and metadata.
 */
import React from "react";

interface BarProps { label: string; pct: number; meta: string; warn?: boolean; }

export function Bar({ label, pct, meta, warn = false }: BarProps) {
  const fill = `${Math.max(0, Math.min(1, pct)) * 100}%`;
  return (
    <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr_180px] gap-2 items-center">
      <div className="text-[11px] text-[#667781]">{label}</div>
      <div className="h-3 bg-[#E6E9EC] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${warn ? "bg-[#F4B400]" : "bg-[#25D366]"}`}
          style={{ width: fill }}
        />
      </div>
      <div className="col-span-2 sm:col-span-1 text-[11px] text-[#667781] sm:pl-0 pl-[68px] -mt-1 sm:mt-0">
        {meta}
      </div>
    </div>
  );
}
