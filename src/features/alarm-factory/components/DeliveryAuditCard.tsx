/**
 * DeliveryAuditCard — Delivery Audit (WhatsApp/SMS/In-app)
 *
 * Matches BOTTOM screenshot:
 *   Header: "Success: 93.8% • Fail: 6.2% • Cost today: 1,210 TK"
 *   Table: Channel | Success badge | Latency
 *   Footer: Tune Noise Rules button + In-app row with 99.3%
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export interface DeliveryChannel {
  id:       string;
  channel:  string;
  success:  string;
  latency:  string;
  tone:     "ok" | "warn" | "alarm";
}

interface DeliveryAuditCardProps {
  channels?:        DeliveryChannel[];
  summarySuccess?:  string;
  summaryFail?:     string;
  costToday?:       string;
  onTuneNoise?:     () => void;
}

const toneBadge: Record<string, string> = {
  ok:    "bg-[#25D366] text-white",
  warn:  "bg-[#F97316] text-white",
  alarm: "bg-[#EF4444] text-white",
};

const DEFAULT_CHANNELS: DeliveryChannel[] = [
  { id: "wa",    channel: "WhatsApp", success: "95.2%", latency: "2.8s", tone: "ok"   },
  { id: "sms",   channel: "SMS",      success: "91.0%", latency: "5.1s", tone: "warn" },
  { id: "inapp", channel: "In-app",   success: "99.3%", latency: "0.9s", tone: "ok"   },
];

export function DeliveryAuditCard({
  channels       = DEFAULT_CHANNELS,
  summarySuccess = "93.8%",
  summaryFail    = "6.2%",
  costToday      = "1,210 TK",
  onTuneNoise,
}: DeliveryAuditCardProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">Delivery Audit (WhatsApp/SMS/In-app)</div>
        <div className="text-[11px] text-[#667781] mt-0.5">
          Success: <strong className="text-[#25D366]">{summarySuccess}</strong> •
          Fail: <strong className="text-[#EF4444]"> {summaryFail}</strong> •
          Cost today: <strong className="text-[#111B21]"> {costToday}</strong>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-[#E9EDEF] bg-[#F8F9FA]">
            {["Channel", "Success", "Latency"].map((h) => (
              <th key={h} className="text-left px-4 py-2 text-[11px] font-extrabold text-[#667781]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {channels.map((ch, i) => (
            <tr key={ch.id} className={`border-b border-[#E9EDEF] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
              <td className="px-4 py-2.5 font-extrabold text-[#111B21]">{ch.channel}</td>
              <td className="px-4 py-2.5">
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${toneBadge[ch.tone]}`}>
                  {ch.success}
                </span>
              </td>
              <td className="px-4 py-2.5 text-[#667781]">{ch.latency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#E9EDEF]">
        <button
          onClick={onTuneNoise}
          className="h-8 px-4 rounded-full bg-[#34B7F1] text-white text-[11px] font-extrabold border-none cursor-pointer hover:brightness-105 transition-all whitespace-nowrap"
        >
          Tune Noise Rules
        </button>
      </div>
    </div>
  );
}