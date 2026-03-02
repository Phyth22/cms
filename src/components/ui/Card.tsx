/**
 * Card — Generic bordered card with header.
 */
import React from "react";

interface CardProps { title: string; subtitle?: string; children: React.ReactNode; }

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <div className="border border-[#E9EDEF] rounded-xl bg-white">
      <div className="px-3 py-2.5 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">{title}</div>
        {subtitle && <div className="text-[11px] text-[#667781] mt-0.5">{subtitle}</div>}
      </div>
      <div className="p-3 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}
