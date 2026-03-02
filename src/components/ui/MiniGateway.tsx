/**
 * MiniGateway — Small gateway status card with severity badge.
 */
import React from "react";
import type { Severity } from "../../types";
import { sevPill } from "../../theme/severity";

interface MiniGatewayProps { name: string; status: string; meta: string; sev: Severity; }

export function MiniGateway({ name, status, meta, sev }: MiniGatewayProps) {
  return (
    <div className="border border-[#E9EDEF] rounded-xl bg-[#F8F9FA] p-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="font-extrabold text-[#667781] text-[12px] truncate min-w-0">{name}</div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold shrink-0 ${sevPill[sev]}`}>
          {status}
        </span>
      </div>
      <div className="text-[11px] text-[#667781] mt-1.5 leading-snug">{meta}</div>
    </div>
  );
}
