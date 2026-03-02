/**
 * TokensPage — Screen 05: TOKEN ENGINE ROOM 🚦 (Universal Token Definition Engine)
 *
 * Matches v26 mockups pixel-accurately:
 *   TOP:    Context strip → 4 KPIs → 5 mini bars → 3-col blades (Definitions | Detail | Waswa AI)
 *   MID:    Usage Event Metering → FIFO + VEBA Leakage → System Health Snapshot
 *   BOTTOM: Price Rule Versions + Trash → HITL box → Audit Log
 *   MODAL:  Create Token Definition wizard (Step 2/4, sections A–E)
 */
import React, { useState } from "react";

// ─── Colour helpers ──────────────────────────────────────────────────────────
const okBg  = "bg-[#25D366] text-[#053B33]";
const warnBg = "bg-[#F59E0B] text-white";
const alarmBg = "bg-[#F97316] text-white";
const critBg = "bg-[#EF4444] text-white";
const darkBg = "bg-[#075E54] text-white";
const azureBg = "bg-[#34B7F1] text-white";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const TOKENS = [
  { code:"GPS_TIME_HR",     domain:"OLIWA",   rps:"8.6",  unit:"hour",   state:"Active" },
  { code:"FUEL_THEFT_EVT",  domain:"MAFUTA",  rps:"9.7",  unit:"event",  state:"Active" },
  { code:"DRIVER_SCORE",    domain:"PIKI",    rps:"9.2",  unit:"event",  state:"Active" },
  { code:"REPORT_EXPORT",   domain:"CORE",    rps:"8.3",  unit:"export", state:"Active" },
  { code:"BODA_LEAD_UNLOCK",domain:"VEBA",    rps:"9.9",  unit:"unlock", state:"Active" },
  { code:"D8_POWERON_MIN",  domain:"VEBA",    rps:"9.4",  unit:"minute", state:"Active" },
  { code:"VIDEO_SNAPSHOT",  domain:"DASHCAM", rps:"10.1", unit:"snap",   state:"Active" },
  { code:"AI_DEEP_AUDIT",   domain:"WASWA",   rps:"10.0", unit:"query",  state:"Active" },
  { code:"ROAMING_PACKET",  domain:"SIM",     rps:"8.8",  unit:"MB",     state:"Active" },
  { code:"KYC_VERIFY",      domain:"VEBA",    rps:"8.7",  unit:"check",  state:"Active" },
];

const PARAMS = [
  { param:"booking_contact_reveal", origin:"VEBA", cost:"1 unlock",   state:"Allow", control:"HITL" },
  { param:"chat_message_prepay",    origin:"VEBA", cost:"0.2 / msg",  state:"Allow", control:"Auto" },
  { param:"listing_view",           origin:"VEBA", cost:"0.05 / view",state:"Allow", control:"Auto" },
  { param:"offline_contact_detect", origin:"WASWA",cost:"0.4 / flag", state:"Allow", control:"Auto" },
  { param:"call_masking_proxy",     origin:"CORE", cost:"0.3 / min",  state:"Allow", control:"HITL" },
  { param:"payout_initiate",        origin:"PAY",  cost:"0.6 / tx",   state:"Allow", control:"HIC"  },
  { param:"refund_dispute",         origin:"PAY",  cost:"0.8 / case", state:"Allow", control:"HITL" },
];

const LEDGER = [
  { ts:"20:25:38", tenant:"Kampala_Boda_Fleet", event:"contact_reveal",   token:"BODA_LEAD_UNLOCK", d:"-1", actor:"finance@navas",   source:"api"    },
  { ts:"20:22:38", tenant:"Kampala_Boda_Fleet", event:"listing_view",     token:"LISTING_VIEW",     d:"-1", actor:"waswa-agent",     source:"worker" },
  { ts:"20:19:38", tenant:"Kampala_Boda_Fleet", event:"payout_initiate",  token:"PAYOUT_TX",        d:"-3", actor:"sysadmin@navas",  source:"kafka"  },
  { ts:"20:16:38", tenant:"Kampala_Boda_Fleet", event:"chat_msg",         token:"CHAT_PREPAY",      d:"-1", actor:"sysadmin@navas",  source:"api"    },
  { ts:"20:13:38", tenant:"Kampala_Boda_Fleet", event:"booking_confirm",  token:"VEBA_BOOK_FEE",    d:"-1", actor:"sysadmin@navas",  source:"api"    },
  { ts:"20:10:38", tenant:"Kampala_Boda_Fleet", event:"payout_initiate",  token:"PAYOUT_TX",        d:"-2", actor:"waswa-agent",     source:"api"    },
  { ts:"20:07:38", tenant:"Kampala_Boda_Fleet", event:"contact_reveal",   token:"BODA_LEAD_UNLOCK", d:"-1", actor:"waswa-agent",     source:"kafka"  },
  { ts:"20:04:38", tenant:"Kampala_Boda_Fleet", event:"payout_initiate",  token:"PAYOUT_TX",        d:"-1", actor:"sysadmin@navas",  source:"api"    },
  { ts:"20:01:38", tenant:"Kampala_Boda_Fleet", event:"contact_reveal",   token:"BODA_LEAD_UNLOCK", d:"-3", actor:"finance@navas",   source:"worker" },
];

const FIFO = [
  { asset:"BODA-UG-1182",  bundle:"VEBA_10K",  remain:"3,120", next:"2h 10m" },
  { asset:"CAR-KE-8841",   bundle:"GPS_30D",   remain:"17d",   next:"17d"    },
  { asset:"D8-KE-0093",    bundle:"POH_2K",    remain:"880",   next:"46m"    },
  { asset:"AMB-UG-0411",   bundle:"GPS_30D",   remain:"24d",   next:"24d"    },
  { asset:"Piki-UG-4402",  bundle:"DRIVE_EVT", remain:"210",   next:"—"      },
  { asset:"Reefer-KE-2020",bundle:"COLD_1D",   remain:"8h",    next:"8h"     },
];

const SUSPECTS = [
  { id:"hirer_0912",  risk:"0.82", detail:"14 views • 0 pays"       },
  { id:"owner_4420",  risk:"0.77", detail:"6 chats • 0 bookings"    },
  { id:"broker_1201", risk:"0.73", detail:"contact share patterns"   },
];

const PROCESSES = [
  { name:"python-sockets",  cpu:46, ram:38, state:"OK"   },
  { name:"flask-api",       cpu:21, ram:24, state:"OK"   },
  { name:"kafka-consumer",  cpu:34, ram:42, state:"OK"   },
  { name:"cassandra",       cpu:58, ram:61, state:"WARN" },
  { name:"redis-cache",     cpu:12, ram:18, state:"OK"   },
  { name:"waswa-ml-worker", cpu:72, ram:55, state:"WARN" },
];

const VERSIONS = [
  { ver:"v12", token:"BODA_LEAD_UNLOCK", change:"UGX 450→500",  by:"sysadmin", state:"HITL"     },
  { ver:"v11", token:"GPS_TIME_HR",      change:"hour rate -5%", by:"finance",  state:"Approved" },
  { ver:"v10", token:"VIDEO_SNAPSHOT",   change:"enable KE",     by:"product",  state:"Pending"  },
  { ver:"v9",  token:"FUEL_THEFT_EVT",   change:"RPS 9.5→9.7",  by:"product",  state:"Approved" },
  { ver:"v8",  token:"ROAMING_PACKET",   change:"TZS added",     by:"finance",  state:"Approved" },
];

const TRASH_ITEMS = [
  { object:"TOKEN:AI_DEEP_AUDIT", type:"Token",  by:"product",  age:"2d"  },
  { object:"RULE:CAP_OLIWA",      type:"Rule",   by:"sysadmin", age:"6h"  },
  { object:"BUNDLE:VEBA_1K",      type:"Bundle", by:"finance",  age:"8d"  },
  { object:"TOKEN:CALL_MASK",     type:"Token",  by:"sysadmin", age:"14d" },
];

const AUDIT = [
  { ts:"2026-02-22 20:25", actor:"waswa-agent",     action:"EXPORT_CSV",     object:"CAP_DAILY",        result:"DENY", hash:"45a54ec860e1" },
  { ts:"2026-02-22 20:18", actor:"sysadmin@navas",  action:"PRICE_REQUEST",  object:"CAP_DAILY",        result:"HITL", hash:"6fe75b41b5ff" },
  { ts:"2026-02-22 20:11", actor:"sysadmin@navas",  action:"RESTORE_TRASH",  object:"BODA_LEAD_UNLOCK", result:"HITL", hash:"577ef4ad8e22" },
  { ts:"2026-02-22 20:04", actor:"finance@navas",   action:"EXPORT_CSV",     object:"VEBA_10K",         result:"HITL", hash:"71db9759b0fe" },
  { ts:"2026-02-22 19:57", actor:"waswa-agent",     action:"EXPORT_CSV",     object:"BODA_LEAD_UNLOCK", result:"OK",   hash:"efcfb5f937d7" },
];

const MODAL_PARAMS = [
  { param:"booking_contact_reveal", origin:"VEBA", rps:"9.9", bill:"Yes", state:"ON"   },
  { param:"call_masking_proxy",     origin:"CORE", rps:"9.1", bill:"Yes", state:"ON"   },
  { param:"chat_message_prepay",    origin:"VEBA", rps:"8.6", bill:"Yes", state:"ON"   },
  { param:"listing_view",           origin:"VEBA", rps:"8.3", bill:"Yes", state:"ON"   },
  { param:"payout_initiate",        origin:"PAY",  rps:"9.6", bill:"Yes", state:"HIC"  },
  { param:"refund_dispute",         origin:"PAY",  rps:"9.0", bill:"Yes", state:"HITL" },
  { param:"kyc_verify",             origin:"VEBA", rps:"8.7", bill:"Yes", state:"ON"   },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export function TokensPage() {
  const [selected, setSelected] = useState("BODA_LEAD_UNLOCK");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 p-3">

          {/* ── Context Strip ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2.5 bg-white border border-[#E9EDEF] rounded-xl p-2.5">
            {[
              { l:"Tenant",    v:"Dealer ▸ Client ▸ Org ▸ Sub-Org" },
              { l:"Tokens",    v:"Balance 128,400 • Burn 1.8/s • Run-out 19h" },
              { l:"System",    v:"🟢 Green • Last incident 2d ago" },
              { l:"Freshness", v:"p95 ingest 18s • last msg 4s" },
            ].map(f => (
              <div key={f.l} className="bg-[#F8FAFC] border border-[#E9EDEF] rounded-lg px-3 py-2">
                <div className="text-[9px] font-black text-[#667781]">{f.l}</div>
                <div className="text-[11px] text-[#111B21] mt-0.5">{f.v}</div>
              </div>
            ))}
            <button className="bg-[#0B6B60] text-[#E9FFFA] rounded-lg px-3 py-2 text-left border-none cursor-pointer min-w-[130px]">
              <div className="font-black text-[12px]">Waswa AI</div>
              <div className="text-[10px] text-[#BFEFE6] mt-0.5">HITL: 3 pending</div>
            </button>
          </div>

          {/* ════════════════════ TOP SCROLL ════════════════════════════════════ */}

          {/* ── 4 KPI Cards ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:"Wallet",            value:"128,400 NVT", sub:"Pool • Allocations • Escrow",       tone:darkBg  },
              { label:"Burn Rate",         value:"1.8 NVT/s",   sub:"OLIWA 0.9 • VEBA 0.6 • AI 0.3",   tone:alarmBg },
              { label:"Run-out Forecast",  value:"19h 12m",     sub:"Soft alert at 72h • Hard stop at 6h",tone:warnBg },
              { label:"Unbilled Backlog",  value:"0.4%",        sub:"Kafka ledger synced • last recon 6m",tone:okBg   },
            ].map(k => (
              <div key={k.label} className="bg-white border border-[#E9EDEF] rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[13px] text-[#111B21]">{k.label}</span>
                  <span className={`text-[12px] font-black px-2.5 py-1 rounded-full ${k.tone}`}>{k.value}</span>
                </div>
                <div className="text-[11px] text-[#667781] mt-1.5">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* ── 5 Mini KPI bars ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label:"System CPU",  value:"62%",  pct:62, tone:"bg-[#128C7E]" },
              { label:"RAM Free",    value:"38%",  pct:38, tone:"bg-[#F97316]" },
              { label:"Disk Free",   value:"14%",  pct:14, tone:"bg-[#F97316]" },
              { label:"Gateways OK", value:"3/4",  pct:75, tone:"bg-[#25D366]" },
              { label:"HITL Queue",  value:"2",    pct:20, tone:"bg-[#34B7F1]" },
            ].map(b => (
              <div key={b.label} className="bg-white border border-[#E9EDEF] rounded-xl p-3">
                <div className="font-black text-[12px] text-[#111B21]">{b.label}</div>
                <div className="font-black text-[22px] text-[#111B21] leading-tight mt-0.5">{b.value}</div>
                <div className="h-2 rounded-full bg-[#E9EDEF] mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${b.tone}`} style={{width:`${b.pct}%`}} />
                </div>
              </div>
            ))}
          </div>

          {/* ── 3-col Blades: Definitions | Detail | Waswa AI ────────────────── */}
          <div className="grid grid-cols-[280px_1fr_1fr] gap-3 items-start">

            {/* LEFT: Token Definitions */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#E9EDEF] bg-[#F8FAFC]">
                <div>
                  <div className="font-black text-[13px] text-[#111B21]">Token Definitions</div>
                  <div className="text-[10px] text-[#667781]">Type A (Telematics) • Type B (VEBA)</div>
                </div>
                <Pill color="green" onClick={() => setModalOpen(true)}>+ New</Pill>
              </div>
              <div className="flex gap-2 px-3 py-2 border-b border-[#E9EDEF]">
                <Pill>Import</Pill><Pill>Export</Pill><Pill>Trash</Pill>
                <span className="text-[11px] font-black text-[#128C7E] bg-[#EAF7F3] border border-[#128C7E] px-2 py-1 rounded-full">Sort: RPS ↓</span>
              </div>
              <table className="w-full text-[11px] table-fixed">
                <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                  <th className="text-left px-2 py-2 font-black text-[#667781]">Code</th>
                  <th className="text-left px-2 py-2 font-black text-[#667781] w-[60px]">Domain</th>
                  <th className="text-left px-2 py-2 font-black text-[#667781] w-[36px]">RPS</th>
                  <th className="text-left px-2 py-2 font-black text-[#667781] w-[44px]">Unit</th>
                </tr></thead>
                <tbody>
                  {TOKENS.map(t => (
                    <tr
                      key={t.code}
                      onClick={() => setSelected(t.code)}
                      className={`border-b border-[#E9EDEF] cursor-pointer transition-colors ${
                        t.code === selected ? "bg-[#EAF7F3] border-l-[3px] border-l-[#25D366]" : "hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <td className="px-2 py-2 font-extrabold text-[#111B21] truncate">{t.code}</td>
                      <td className="px-2 py-2 text-[#667781]">{t.domain}</td>
                      <td className="px-2 py-2 font-black text-[#128C7E]">{t.rps}</td>
                      <td className="px-2 py-2 text-[#667781]">{t.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MIDDLE: Token Detail */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E9EDEF] bg-[#F8FAFC]">
                <div>
                  <div className="font-black text-[13px] text-[#111B21]">Token Detail</div>
                  <div className="text-[10px] text-[#667781]">{selected} • Version v12</div>
                </div>
                <span className={`text-[11px] font-black px-3 py-1 rounded-full ${azureBg}`}>Edit</span>
              </div>
              <div className="flex gap-2 px-4 py-2 border-b border-[#E9EDEF]">
                <Pill>Copy</Pill>
                <Pill color="green">Save</Pill>
                <Pill>Move to trash</Pill>
              </div>

              {/* Definition grid */}
              <div className="px-4 py-3">
                <div className="font-black text-[12px] text-[#111B21] mb-2">Definition</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k:"Type",        v:"Type B — VEBA Rental/Marketplace" },
                    { k:"Billing unit",v:"unlock (contact reveal)" },
                    { k:"RPS",         v:"9.9 (high leakage protection)" },
                    { k:"Countries",   v:"UGX 500 • KES 15 • USD 0.12" },
                    { k:"FIFO queue",  v:"Enabled per Hirer wallet" },
                    { k:"Pause rules", v:"Pause when listing hidden / asset offline" },
                  ].map(d => (
                    <div key={d.k} className="flex gap-2 text-[11px]">
                      <span className="text-[#667781] font-black w-[90px] shrink-0">{d.k}</span>
                      <span className="text-[#111B21]">{d.v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] font-black text-[#075E54] bg-[#EAF7F3] border border-[#128C7E] px-2 py-1 rounded-full">Safeguard: 80% cap alert</span>
                  <span className="text-[10px] font-black text-[#F97316] bg-[#FFF7ED] border border-[#F97316] px-2 py-1 rounded-full">HITL required: price changes</span>
                </div>
              </div>

              {/* Parameter Mapping */}
              <div className="px-4 py-3 border-t border-[#E9EDEF]">
                <div className="font-black text-[12px] text-[#111B21] mb-2">Parameter Mapping (feature gating)</div>
                <table className="w-full text-[11px] table-fixed">
                  <thead><tr className="border-b border-[#E9EDEF]">
                    {["Param","Origin","Cost","State","Control"].map(h => (
                      <th key={h} className="text-left py-1.5 font-black text-[#667781]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {PARAMS.map(p => (
                      <tr key={p.param} className="border-b border-[#E9EDEF] last:border-0">
                        <td className="py-1.5 text-[#111B21]">{p.param}</td>
                        <td className="py-1.5 text-[#667781]">{p.origin}</td>
                        <td className="py-1.5 text-[#667781]">{p.cost}</td>
                        <td className="py-1.5 text-[#667781]">{p.state}</td>
                        <td className={`py-1.5 font-black ${p.control==="HIC"?"text-[#EF4444]":p.control==="HITL"?"text-[#F97316]":""}`}>{p.control}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: Waswa AI — Treasurer */}
            <div className="flex flex-col gap-3">
              <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E9EDEF] bg-[#F8FAFC]">
                  <div>
                    <div className="font-black text-[13px] text-[#111B21]">Waswa AI — Treasurer</div>
                    <div className="text-[10px] text-[#667781]">AI-first ops • leakage + health + billing</div>
                  </div>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full ${okBg}`}>LIVE</span>
                </div>

                {/* Proactive Brief */}
                <div className="m-3 bg-[#0B6B60] rounded-xl p-3">
                  <div className="font-black text-[12px] text-[#E9FFFA]">Proactive Brief</div>
                  <div className="text-[11px] text-[#BFEFE6] mt-1.5 leading-relaxed">
                    System Health 99.8% • Kafka lag 0.6s • MTN MoMo latency 8.2s (WARN)<br/>
                    Leakage shield blocked 14 contact shares in Boda sector<br/>
                    Recommend: mint 5,000 NVT to 'Kampala_Boda_Fleet'
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <Pill color="green">Review HITL Queue (3)</Pill>
                    <button className="h-7 px-3 rounded-full bg-[#0F7A6E] border border-[#0F7A6E] text-[#E9FFFA] text-[11px] font-black cursor-pointer">Apply Safe Fixes</button>
                  </div>
                </div>

                {/* Payments & Mobile Money */}
                <div className="px-4 py-3 border-t border-[#E9EDEF]">
                  <div className="font-black text-[12px] text-[#111B21] mb-1">Payments &amp; Mobile Money</div>
                  <div className="text-[10px] text-[#667781] mb-2">Real-time gateway status • webhook backlog • settlement</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { n:"M-Pesa",    s:"OK",   lat:"p95 2.1s" },
                      { n:"MTN MoMo",  s:"WARN", lat:"p95 8.2s" },
                      { n:"Airtel UG", s:"OK",   lat:"p95 2.7s" },
                      { n:"Airtel KE", s:"OK",   lat:"p95 3.0s" },
                    ].map(g => (
                      <div key={g.n} className="flex items-center gap-2 text-[11px]">
                        <span className="font-black text-[#111B21]">{g.n}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${g.s==="OK"?okBg:warnBg}`}>{g.s}</span>
                        <span className="text-[#667781]">{g.lat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safeguards */}
                <div className="px-4 py-3 border-t border-[#E9EDEF]">
                  <div className="font-black text-[12px] text-[#111B21] mb-1">Safeguards • Billing Shock Prevention</div>
                  <div className="text-[10px] text-[#667781] mb-2">Caps, alerts, lock states, approvals</div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="font-black text-[#667781] w-[110px]">Daily cap (NVT):</span>
                    <input defaultValue="15,000" className="w-[80px] h-7 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-2 text-[12px] font-black text-[#111B21] outline-none" />
                  </div>
                  <div className="mt-2 text-[10px] text-[#667781]">Soft alert at 80%</div>
                  <div className="h-3 rounded-full bg-[#E9EDEF] mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-[#25D366]" style={{width:"64%"}} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] mt-3">
                    <span className="font-black text-[#667781] w-[110px]">Monthly cap (NVT):</span>
                    <input defaultValue="420,000" className="w-[80px] h-7 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-2 text-[12px] font-black text-[#111B21] outline-none" />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-[11px]">
                    <span className="font-black text-[#667781]">Lock state:</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${okBg}`}>UNLOCKED</span>
                  </div>
                  <div className="mt-3 text-[11px] text-[#667781]">Pending approvals:</div>
                  <div className="mt-1.5 border border-[#F97316] rounded-lg p-2 bg-[#FFF7ED] flex items-center gap-2 text-[11px]">
                    <span className="text-[#111B21] flex-1">HITL #A129 • Price change request: BODA_LEAD_UNLOCK UGX 450→500</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${alarmBg} cursor-pointer`}>Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════ MID SCROLL ════════════════════════════════════ */}

          {/* ── Usage Event Metering ──────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Usage Event Metering (US-03) — Immutable Ledger</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Kafka → Cassandra (immutable) • Denominator enforced • idempotent keys</div>
            </div>
            <table className="w-full text-[11px] table-fixed">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                {["ts","tenant","event","token","ΔNVT","actor","source"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {LEDGER.map((r, i) => (
                  <tr key={i} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2 font-mono text-[#667781]">{r.ts}</td>
                    <td className="px-3 py-2 text-[#111B21] truncate">{r.tenant}</td>
                    <td className="px-3 py-2 text-[#667781]">{r.event}</td>
                    <td className="px-3 py-2 font-extrabold text-[#111B21]">{r.token}</td>
                    <td className="px-3 py-2 font-black text-[#EF4444]">{r.d}</td>
                    <td className="px-3 py-2 text-[#667781]">{r.actor}</td>
                    <td className="px-3 py-2 text-[#667781]">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 text-[10px] text-[#667781] italic border-t border-[#E9EDEF]">
              Tip: RBAC governs *who sees cost* vs *who sees raw params*.
            </div>
          </div>

          {/* ── FIFO + VEBA Leakage (2-col) ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {/* FIFO */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E9EDEF]">
                <div className="font-black text-[13px] text-[#111B21]">FIFO Subscription Instances (US-02)</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Multiple bundles per asset • auto-rollover • pause/resume supported</div>
              </div>
              <table className="w-full text-[11px]">
                <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                  {["Asset","Bundle","Remain","Next"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {FIFO.map(f => (
                    <tr key={f.asset} className="border-b border-[#E9EDEF] last:border-0">
                      <td className="px-3 py-2 font-extrabold text-[#111B21]">{f.asset}</td>
                      <td className="px-3 py-2 text-[#667781]">{f.bundle}</td>
                      <td className="px-3 py-2 text-[#111B21]">{f.remain}</td>
                      <td className="px-3 py-2 text-[#667781]">{f.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 px-4 py-2.5 border-t border-[#E9EDEF]">
                <Pill color="green">+ Allocate</Pill><Pill>Pause/Resume</Pill><Pill>Export</Pill>
              </div>
            </div>

            {/* VEBA Leakage Shield */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E9EDEF]">
                <div className="font-black text-[13px] text-[#111B21]">VEBA Leakage Shield (AI-driven)</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Airbnb-style info gating • anomaly detection • penalty tokens</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-[11px] text-[#667781] mb-1">Leakage attempts (last 24h)</div>
                <div className="h-3.5 rounded-full bg-[#E9EDEF] overflow-hidden">
                  <div className="h-full rounded-full bg-[#F97316]" style={{width:"68%"}} />
                </div>
                <div className="font-black text-[12px] text-[#111B21] mt-4 mb-2">Top suspects (risk score)</div>
                {SUSPECTS.map(s => (
                  <div key={s.id} className="flex items-center gap-3 py-2 border-b border-[#E9EDEF] last:border-0">
                    <span className="font-black text-[12px] text-[#111B21] w-[90px]">{s.id}</span>
                    <span className="text-[10px] font-black text-[#EF4444] bg-[#FFF0F0] border border-[#FFB4B4] px-2 py-0.5 rounded-full">risk {s.risk}</span>
                    <span className="text-[11px] text-[#667781] flex-1">{s.detail}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${okBg} cursor-pointer`}>Review</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 px-4 py-2.5 border-t border-[#E9EDEF]">
                <Pill color="green">Open Case</Pill><Pill>Auto-Nudge</Pill><Pill>Penalty Rules</Pill>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${okBg} cursor-pointer self-center`}>Review</span>
              </div>
            </div>
          </div>

          {/* ── System Health Snapshot ────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">System Health Snapshot (Task-Manager style)</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Real-time server processes • CPU/RAM/Disk • queue depth • restart rate</div>
            </div>
            <table className="w-full text-[11px] table-fixed">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                {["Process","CPU%","","RAM%","","State"].map((h,i) => (
                  <th key={i} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {PROCESSES.map(p => (
                  <tr key={p.name} className="border-b border-[#E9EDEF] last:border-0">
                    <td className="px-3 py-2 font-extrabold text-[#111B21]">{p.name}</td>
                    <td className="px-3 py-2">
                      <div className="h-3 rounded-full bg-[#E9EDEF] overflow-hidden">
                        <div className={`h-full rounded-full ${p.cpu>50?"bg-[#128C7E]":"bg-[#25D366]"}`} style={{width:`${p.cpu}%`}} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#667781] w-[36px]">{p.cpu}</td>
                    <td className="px-3 py-2">
                      <div className="h-3 rounded-full bg-[#E9EDEF] overflow-hidden">
                        <div className={`h-full rounded-full ${p.ram>50?"bg-[#F97316]":"bg-[#25D366]"}`} style={{width:`${p.ram}%`}} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#667781] w-[36px]">{p.ram}</td>
                    <td className="px-3 py-2 w-[50px]">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${p.state==="OK"?okBg:warnBg}`}>{p.state}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ════════════════════ BOTTOM SCROLL ═════════════════════════════════ */}

          {/* ── Price Rule Versions + Trash (2-col) ──────────────────────────── */}
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
            {/* Price Rule Versions */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E9EDEF]">
                <div className="font-black text-[13px] text-[#111B21]">Price Rule Versions &amp; Approvals</div>
                <div className="text-[11px] text-[#667781] mt-0.5">HITL enforced • immutable audit trail • restore from trash</div>
              </div>
              <table className="w-full text-[11px]">
                <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                  {["Ver","Token","Change","By","State"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {VERSIONS.map(v => (
                    <tr key={v.ver} className="border-b border-[#E9EDEF] last:border-0">
                      <td className="px-3 py-2 text-[#667781]">{v.ver}</td>
                      <td className="px-3 py-2 font-extrabold text-[#111B21]">{v.token}</td>
                      <td className="px-3 py-2 text-[#111B21]">{v.change}</td>
                      <td className="px-3 py-2 text-[#667781]">{v.by}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          v.state==="HITL"?"bg-[#F97316] text-white":
                          v.state==="Pending"?"bg-[#FBBF24] text-[#111]":
                          "bg-[#25D366] text-[#053B33]"
                        }`}>{v.state}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* HITL pending box */}
              <div className="m-3 border border-[#F97316] bg-[#FFF7ED] rounded-xl p-3">
                <div className="font-black text-[12px] text-[#111B21]">HITL pending: v12 price change requires approval</div>
                <div className="text-[11px] text-[#667781] mt-1">Reason: leakage prevention • align to FX rates • avoid billing shock</div>
                <div className="flex gap-2 mt-2">
                  <Pill color="green">Approve</Pill>
                  <Pill>Reject</Pill>
                </div>
              </div>
            </div>

            {/* Trash Bin */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E9EDEF]">
                <div className="font-black text-[13px] text-[#111B21]">Trash Bin (Soft Delete)</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Delete → Move to trash • Recover → Restore • RBAC guarded</div>
              </div>
              <table className="w-full text-[11px]">
                <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                  {["Object","Type","Deleted by","Age"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {TRASH_ITEMS.map(t => (
                    <tr key={t.object} className="border-b border-[#E9EDEF] last:border-0">
                      <td className="px-3 py-2 font-extrabold text-[#111B21]">{t.object}</td>
                      <td className="px-3 py-2 text-[#667781]">{t.type}</td>
                      <td className="px-3 py-2 text-[#667781]">{t.by}</td>
                      <td className="px-3 py-2 text-[#667781]">{t.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 px-4 py-2.5 border-t border-[#E9EDEF]">
                <Pill color="green">Restore</Pill>
                <span className="text-[11px] font-black text-[#EF4444] bg-[#FFF0F0] border border-[#FFB4B4] px-3 py-1 rounded-full cursor-pointer">Purge (HIC)</span>
                <Pill>Export list</Pill>
              </div>
            </div>
          </div>

          {/* ── Audit Log ─────────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Audit Log • Irrefutable (HIC/HITL)</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Cryptographic chain • non-repudiation • retention 178d remaining</div>
            </div>
            <table className="w-full text-[11px] table-fixed">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                {["ts","actor","action","object","result","hash"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {AUDIT.map((a, i) => (
                  <tr key={i} className="border-b border-[#E9EDEF] last:border-0">
                    <td className="px-3 py-2 font-mono text-[#667781]">{a.ts}</td>
                    <td className="px-3 py-2 text-[#111B21]">{a.actor}</td>
                    <td className="px-3 py-2 text-[#667781]">{a.action}</td>
                    <td className="px-3 py-2 font-extrabold text-[#111B21]">{a.object}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        a.result==="DENY"?critBg:a.result==="HITL"?alarmBg:okBg
                      }`}>{a.result}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[#667781]">{a.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* ── Create Token Modal ─────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9000] bg-[#111B21]/55 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[780px] max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#075E54] shrink-0">
              <span className="font-black text-[15px] text-white">Create Token Definition — Universal Token Engine</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black bg-[#128C7E] text-white px-3 py-1 rounded-full">Step 2/4</span>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 border border-white/25 text-white font-black text-[14px] cursor-pointer grid place-items-center">✕</button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto bg-[#F0F2F5] p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {/* A) Token Identity */}
              <ModalSection title="A) Token Identity">
                {[
                  { l:"Code",                   v:"BODA_LEAD_UNLOCK" },
                  { l:"Domain",                  v:"VEBA" },
                  { l:"Type",                    v:"Type B — Rental/Marketplace" },
                  { l:"Billing Unit",            v:"unlock" },
                  { l:"Revenue Potential Score", v:"9.9" },
                ].map(f => (
                  <div key={f.l} className="flex items-center border-b border-[#E9EDEF] last:border-0 py-3 px-4">
                    <span className="text-[12px] font-black text-[#667781] w-[180px] shrink-0">{f.l}</span>
                    <span className="text-[13px] text-[#111B21]">{f.v}</span>
                  </div>
                ))}
              </ModalSection>

              {/* B) Pricing */}
              <ModalSection title="B) Pricing • Multi-Currency">
                <div className="p-4 flex flex-col gap-3">
                  {[
                    { cur:"UGX", val:"500" },
                    { cur:"KES", val:"15"  },
                    { cur:"USD", val:"0.12"},
                    { cur:"TZS", val:"320" },
                    { cur:"RWF", val:"140" },
                  ].map(c => (
                    <div key={c.cur} className="flex items-center gap-3">
                      <span className="text-[13px] font-black text-[#111B21] w-[50px]">{c.cur}</span>
                      <input defaultValue={c.val} className="w-[120px] h-9 rounded-lg border border-[#E9EDEF] bg-white px-3 text-[13px] text-[#111B21] outline-none focus:border-[#128C7E]" />
                    </div>
                  ))}
                </div>
              </ModalSection>

              {/* C) Parameter Mapping */}
              <ModalSection title="C) Parameter Mapping (Origin + RPS sorting)">
                <table className="w-full text-[12px]">
                  <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                    {["Param","Origin","RPS","Bill","State"].map(h => (
                      <th key={h} className="text-left px-4 py-2 font-black text-[#667781]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {MODAL_PARAMS.map(p => (
                      <tr key={p.param} className="border-b border-[#E9EDEF] last:border-0">
                        <td className="px-4 py-2 text-[#111B21]">{p.param}</td>
                        <td className="px-4 py-2 text-[#667781]">{p.origin}</td>
                        <td className="px-4 py-2 text-[#111B21]">{p.rps}</td>
                        <td className="px-4 py-2 text-[#667781]">{p.bill}</td>
                        <td className={`px-4 py-2 font-black ${p.state==="HIC"?"text-[#EF4444]":p.state==="HITL"?"text-[#F97316]":""}`}>{p.state}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ModalSection>

              {/* D) Safeguards */}
              <ModalSection title="D) Safeguards & Approvals (HITL/HIC)">
                <div className="p-4 flex flex-col gap-2">
                  {[
                    "Any price change → HITL approval + audit hash chain",
                    "Refunds above threshold → HITL, service suspension → HIC",
                    "Daily/Monthly caps enforced in realtime (write-time + read-time checks)",
                    "Escrow settlement uses mobile money webhooks + retry queue",
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-[12px]">
                      <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0 mt-[6px]" />
                      <span className="text-[#111B21]">{t}</span>
                    </div>
                  ))}
                </div>
              </ModalSection>

              {/* E) Preview */}
              <ModalSection title="E) Preview & Create">
                <div className="m-4 bg-[#0B6B60] rounded-xl p-3">
                  <div className="font-black text-[12px] text-[#25D366]">Waswa recommendation:</div>
                  <div className="text-[11px] text-[#BFEFE6] mt-1 leading-relaxed">
                    Enable call masking + escrow payout tokens for first 50 contacts (reduces leakage).
                  </div>
                </div>
              </ModalSection>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-[#E9EDEF] bg-white shrink-0">
              <button onClick={() => setModalOpen(false)} className="h-9 px-5 rounded-lg bg-white border border-[#E9EDEF] text-[12px] font-black text-[#111B21] cursor-pointer hover:bg-[#F8FAFC]">Back</button>
              <button onClick={() => setModalOpen(false)} className="h-9 px-5 rounded-lg bg-[#128C7E] border-none text-white text-[12px] font-black cursor-pointer hover:brightness-110">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reusable components ─────────────────────────────────────────────────────
const pillStyles: Record<string, string> = {
  green: "bg-[#25D366] text-[#075E54]",
  azure: "bg-[#34B7F1] text-white",
  teal:  "bg-[#128C7E] text-white",
  ghost: "bg-white border border-[#E9EDEF] text-[#667781]",
};

function Pill({ color = "ghost", onClick, children }: { color?: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-7 px-3 rounded-full text-[11px] font-black border-none cursor-pointer hover:brightness-105 active:opacity-85 transition-all whitespace-nowrap ${pillStyles[color] ?? pillStyles.ghost}`}
    >
      {children}
    </button>
  );
}

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 border border-[#E9EDEF] rounded-xl overflow-hidden bg-white">
      <div className="bg-[#E9EDEF] px-4 py-2.5 font-black text-[13px] text-[#111B21]">{title}</div>
      {children}
    </div>
  );
}