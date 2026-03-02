/**
 * TenantTowerPage — Screen 07: TENANT TOWER (Clients & Accounts)
 *
 * Matches v26 mockups pixel-accurately:
 *   TOP:    Breadcrumb + Quick Actions → 4 KPIs → 2-col (Hierarchy table | Selected Tenant blade)
 *   MID:    Usage Events Ledger → Approvals Queue (HITL/HIC)
 *   BOTTOM: Audit Trail → Policy Violations → Odoo ERP Sync
 *   MODAL:  Right blade — Create Tenant / Sub-Org (tabs: Basics, Billing, Modules, RBAC, Review)
 */
import React, { useState } from "react";

// ─── Colour helpers ──────────────────────────────────────────────────────────
const okBg   = "bg-[#25D366] text-[#053B33]";
const alarmBg= "bg-[#F97316] text-white";
const critBg = "bg-[#EF4444] text-white";
const darkBg = "bg-[#075E54] text-white";

function healthBar(pct: number) {
  const c = pct >= 95 ? "bg-[#25D366]" : pct >= 90 ? "bg-[#FBBF24]" : pct >= 85 ? "bg-[#F97316]" : "bg-[#EF4444]";
  return { c, w: `${pct}%` };
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const TENANTS = [
  { tier:"TOP",    name:"3D SERVICES (TOP)",            ctry:"UG", ccy:"UGX", health:99, burn:"—",   veba:true  },
  { tier:"DEAL",   name:"Kampala Dealer Rights",        ctry:"UG", ccy:"UGX", health:96, burn:"1.8", veba:false },
  { tier:"CLIENT", name:"Nairobi Logistics Client",     ctry:"KE", ccy:"KES", health:93, burn:"4.4", veba:true  },
  { tier:"ORG",    name:"Kampala_Boda_Fleet (ORG)",     ctry:"UG", ccy:"UGX", health:88, burn:"8.6", veba:true, selected:true },
  { tier:"ORG",    name:"Mombasa_Reefer_Coldchain",     ctry:"KE", ccy:"KES", health:91, burn:"3.2", veba:true  },
  { tier:"ORG",    name:"Kisumu_Construction_Rentals",   ctry:"KE", ccy:"KES", health:84, burn:"9.8", veba:true  },
  { tier:"ORG",    name:"Gulu_Schools_Patrol",          ctry:"UG", ccy:"UGX", health:97, burn:"1.1", veba:false },
];

const USAGE = [
  { topic:"usage_events", type:"token.burn",       tenant:"Kampala_Boda_Fleet",   action:"Video snapshot",      tokens:"12.0", cost:"High", guard:"HITL: off"  },
  { topic:"usage_events", type:"payment.webhook",  tenant:"Kampala_Boda_Fleet",   action:"MTN callback retry",  tokens:"0.0",  cost:"Low",  guard:"Auto"       },
  { topic:"usage_events", type:"veba.booking",     tenant:"Kisumu_Construction",  action:"Escrow lock",         tokens:"4.5",  cost:"Med",  guard:"HITL: on"   },
  { topic:"usage_events", type:"token.burn",       tenant:"Nairobi Logistics",    action:"Route optimization",  tokens:"1.6",  cost:"Med",  guard:"Cap: 80%"   },
  { topic:"usage_events", type:"ai.inference",     tenant:"Kampala_Boda_Fleet",   action:"Leakage intent scan", tokens:"0.9",  cost:"Med",  guard:"Local SLM"  },
];

const APPROVALS = [
  { title:"Enable VEBA escrow mode",       tenant:"Kisumu_Construction_Rentals", meta:"Requested by: finance@…",  req:"HITL required" },
  { title:"Mint 1,000 tokens (dispute credit)", tenant:"Kampala_Boda_Fleet",     meta:"Requested by: support@…",  req:"HIC required"  },
  { title:"Suspend account (60+ overdue)", tenant:"Nairobi Logistics Client",    meta:"Dunning stage: 4",         req:"HIC required"  },
];

const AUDIT_TRAIL = [
  { ts:"10:21:14", tag:"RBAC", tagCls:"text-[#128C7E]", title:"Denied cross-tenant access attempt",      who:"user=ops@…"               },
  { ts:"10:20:02", tag:"PAY",  tagCls:"text-[#128C7E]", title:"MTN webhook retry queued",                who:"tenant=Kampala_Boda"      },
  { ts:"10:18:45", tag:"TOK",  tagCls:"text-[#128C7E]", title:"Burn cap reached (80%) — soft alert",     who:"tenant=Kisumu_Construct"  },
  { ts:"10:16:07", tag:"VEBA", tagCls:"text-[#128C7E]", title:"Leakage guard blocked phone number share",who:"chat_id=…"                },
];

const VIOLATIONS = [
  { icon:"⚠", title:"Hierarchy depth > 3 levels",               detail:"2 tenants (review recommended)"   },
  { icon:"⚠", title:"Template drift: non-standard RBAC roles",  detail:"Kampala_Boda_Fleet"               },
  { icon:"⚠", title:"FX mismatch: effective price deviates > 3%",detail:"Kisumu_Construction_Rentals"     },
  { icon:"💡", title:"Opportunity: bundle recommendation available",detail:"Nairobi Logistics Client"      },
];

const MODAL_TABS = ["Basics","Billing & Tokens","Modules","RBAC","Review"];

// ─── Page ────────────────────────────────────────────────────────────────────
export function TenantTowerPage() {
  const [bladeOpen, setBladeOpen] = useState(false);
  const [bladeTab, setBladeTab] = useState("Basics");

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 p-3">

          {/* ── Page Header ────────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-3">
            <nav className="text-[11px] text-[#667781] mb-1">Asset &amp; Resource Governance &rsaquo; Clients &amp; Accounts</nav>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="font-black text-[16px] text-[#111B21]">Tenant Tower</div>
              <div className="text-[11px] text-[#667781]">Dealer → Client → Org • hard isolation enforced</div>
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-[#667781]">Tenant: ALL ▾</span>
                <span className={`text-[11px] font-black px-3 py-1 rounded-full ${darkBg}`}>RBAC: SYSTEM ADMIN</span>
                <span className="text-[11px] text-[#667781]">Tokens: 12.4M • Burn 22.1/s</span>
                <span className="text-[11px] text-[#667781]">Health: Kafka 1.2s • Redis 98%</span>
                <span className={`text-[11px] font-black px-3 py-1 rounded-full ${okBg}`}>Waswa</span>
              </div>
            </div>
          </div>

          {/* ── Quick Actions ──────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-2.5 flex items-center gap-3">
            <span className="font-black text-[13px] text-[#111B21] mr-2">Quick Actions</span>
            <Pill color="green" onClick={() => setBladeOpen(true)}>+ New Tenant</Pill>
            <Pill onClick={() => setBladeOpen(true)}>Create Sub-Org</Pill>
            <Pill>Import</Pill>
            <Pill color="alarm">Trash/Restore</Pill>
          </div>

          {/* ════════════════════ TOP SCROLL ════════════════════════════════════ */}

          {/* ── 4 KPI Cards ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:"Total Accounts", value:"1,248",       sub:"Δ +12 this week"            },
              { label:"Active Units",   value:"84,210",      sub:"Online 91% • Offline 9%"    },
              { label:"Token Exposure (24h)", value:"UGX 12.8M", sub:"Run-out < 72h: 14 tenants" },
              { label:"Payment Success (24h)",value:"96.2%",     sub:"p95 latency 7.8s"         },
            ].map(k => (
              <div key={k.label} className="bg-white border border-[#E9EDEF] rounded-xl p-4">
                <div className="text-[12px] text-[#667781] font-extrabold">{k.label}</div>
                <div className="text-[26px] font-black text-[#111B21] mt-1 leading-tight">{k.value}</div>
                <div className="text-[11px] text-[#667781] mt-0.5">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* ── 2-col: Hierarchy Table | Selected Tenant ─────────────────────── */}
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 items-start">

            {/* LEFT: Service Hierarchy */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E9EDEF]">
                <div>
                  <div className="font-black text-[13px] text-[#111B21]">Service Hierarchy — Accounts</div>
                  <div className="text-[11px] text-[#667781] mt-0.5">Hard isolation: ON • Cross-tenant blocked (24h): 12</div>
                </div>
                <div className="flex gap-2">
                  <Pill>Filter ▾</Pill>
                  <Pill>Export</Pill>
                </div>
              </div>
              <table className="w-full text-[12px] table-fixed">
                <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                  {["Tier","Tenant","Ctry","CCY","Health","Burn/s","VEBA"].map(h => (
                    <th key={h} className={`text-left px-3 py-2 font-black text-[#667781] ${h==="Tenant"?"":"w-[60px]"} ${h==="Health"?"w-[100px]":""}`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {TENANTS.map(t => {
                    const hb = healthBar(t.health);
                    return (
                      <tr key={t.name} className={`border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC] cursor-pointer ${t.selected ? "bg-[#EAF7F3]" : ""}`}>
                        <td className="px-3 py-2.5 font-black text-[#667781]">{t.tier}</td>
                        <td className={`px-3 py-2.5 font-extrabold ${t.selected ? "text-[#128C7E]" : "text-[#111B21]"}`}>{t.name}</td>
                        <td className="px-3 py-2.5 text-[#667781]">{t.ctry}</td>
                        <td className="px-3 py-2.5 text-[#667781]">{t.ccy}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-2.5 rounded-full bg-[#E9EDEF] overflow-hidden">
                              <div className={`h-full rounded-full ${hb.c}`} style={{width:hb.w}} />
                            </div>
                            <span className="text-[10px] text-[#667781] w-[26px] text-right">{t.health}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[#111B21]">{t.burn}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${t.veba?okBg:"bg-[#E9EDEF] text-[#667781]"}`}>{t.veba?"ON":"OFF"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* RIGHT: Selected Tenant Panel */}
            <div className="flex flex-col gap-3">
              {/* Tenant header */}
              <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
                <div className="text-[11px] text-[#667781] font-black">Selected Tenant</div>
                <div className="font-black text-[16px] text-[#111B21] mt-1">Kampala_Boda_Fleet (ORG)</div>
                <div className="flex gap-1.5 flex-wrap mt-1.5 text-[10px]">
                  <span className="bg-[#F0F2F5] px-2 py-0.5 rounded-full text-[#667781]">UG • UGX • Timezone EA</span>
                  <span className="bg-[#F0F2F5] px-2 py-0.5 rounded-full text-[#667781]">Parent: Kampala Dealer</span>
                </div>
                <div className="text-[11px] text-[#667781] mt-2">
                  Policy: no cross-tenant share • Units: 2,140 • <span className={`font-black px-2 py-0.5 rounded-full ${alarmBg} text-[10px]`}>Health 88%</span>
                </div>
              </div>

              {/* Token Wallet (FIFO) */}
              <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
                <div className="font-black text-[13px] text-[#111B21]">Token Wallet (FIFO)</div>
                <div className="font-black text-[20px] text-[#111B21] mt-1">Balance: 2,140,500</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Burn: 8.6 tokens/s • Run-out: ~69h</div>
                <div className="h-3 rounded-full bg-[#E9EDEF] mt-2 overflow-hidden">
                  <div className="h-full rounded-full bg-[#128C7E]" style={{width:"58%"}} />
                </div>
                <div className="text-[10px] text-[#667781] mt-1.5">Top drains: Video(42%) • AI(21%) • Maps(11%)</div>
                <div className="flex gap-2 mt-2">
                  <Pill>Top-Up</Pill><Pill>Allocate</Pill>
                  <span className={`h-7 px-3 rounded-full text-[11px] font-black inline-flex items-center ${alarmBg} cursor-pointer`}>Mint (HIC)</span>
                </div>
              </div>

              {/* Payments & Gateways */}
              <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
                <div className="font-black text-[13px] text-[#111B21]">Payments &amp; Gateways</div>
                <div className="font-black text-[11px] text-[#111B21] mt-2">Mobile Money</div>
                <div className="flex flex-col gap-1.5 mt-1.5">
                  {[
                    { n:"M-Pesa",   sr:"98.4%", lat:"p95 6.1s",  tone:"bg-[#25D366]" },
                    { n:"MTN MoMo", sr:"93.1%", lat:"p95 11.8s", tone:"bg-[#FBBF24]" },
                    { n:"Airtel",   sr:"97.0%", lat:"p95 7.4s",  tone:"bg-[#25D366]" },
                  ].map(g => (
                    <div key={g.n} className="flex items-center gap-2 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${g.tone}`} />
                      <span className="font-black text-[#111B21] w-[70px]">{g.n}</span>
                      <span className="text-[#111B21]">{g.sr}</span>
                      <span className="text-[#667781] ml-auto">{g.lat}</span>
                    </div>
                  ))}
                </div>
                <div className="font-black text-[11px] text-[#111B21] mt-3">Cards / ePayments</div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#667781]">
                  <span>Pesapal • DPO • Flutterwave • Visa/Mast…</span>
                  <Pill>Retry webhooks</Pill>
                </div>
              </div>

              {/* VEBA + Waswa AI */}
              <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[13px] text-[#111B21]">VEBA + Waswa AI Governance</span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${okBg}`}>AI: ON</span>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════ MID SCROLL ════════════════════════════════════ */}

          {/* ── Usage Events Ledger ───────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E9EDEF]">
              <div>
                <div className="font-black text-[13px] text-[#111B21]">Usage Events Ledger (US-03)</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Kafka topic: usage_events • immutable • idempotent</div>
              </div>
              <Pill>Download CSV</Pill>
            </div>
            <table className="w-full text-[12px] table-fixed">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                {["Topic","Type","Tenant","Action","Tokens","Cost","Guardrail"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {USAGE.map((u, i) => (
                  <tr key={i} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2.5 text-[#667781]">{u.topic}</td>
                    <td className="px-3 py-2.5 font-extrabold text-[#111B21]">{u.type}</td>
                    <td className="px-3 py-2.5 text-[#111B21] truncate">{u.tenant}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{u.action}</td>
                    <td className={`px-3 py-2.5 font-black ${parseFloat(u.tokens) > 1 ? "text-[#F97316]" : "text-[#667781]"}`}>{u.tokens}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{u.cost}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{u.guard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Approvals Queue ───────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E9EDEF]">
              <div>
                <div className="font-black text-[13px] text-[#111B21]">Approvals Queue (HITL/HIC)</div>
                <div className="text-[11px] text-[#667781] mt-0.5">High-risk actions require approval + audit trail</div>
              </div>
              <Pill>Open AI assist</Pill>
            </div>
            <div className="flex flex-col">
              {APPROVALS.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-[#E9EDEF] last:border-0">
                  <span className="text-[16px]">☐</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[12px] text-[#111B21]">{a.title}</div>
                    <div className="text-[11px] text-[#667781] mt-0.5">{a.tenant} • {a.meta}</div>
                  </div>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap ${
                    a.req.includes("HIC") ? critBg : alarmBg
                  }`}>{a.req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════ BOTTOM SCROLL ═════════════════════════════════ */}

          {/* ── Audit Trail ───────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Audit Trail (Irrefutable)</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Hash-chained events • retention tied to plan</div>
            </div>
            <div className="flex flex-col">
              {AUDIT_TRAIL.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#E9EDEF] last:border-0">
                  <span className="text-[14px] text-[#667781]">☐</span>
                  <span className="text-[12px] font-mono text-[#667781] w-[60px] shrink-0">{a.ts}</span>
                  <span className={`text-[11px] font-black ${a.tagCls} w-[40px] shrink-0`}>{a.tag}</span>
                  <span className="text-[12px] text-[#111B21] flex-1">{a.title}</span>
                  <span className="text-[11px] text-[#667781] font-mono">{a.who}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Policy Violations & Opportunities ────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Policy Violations &amp; Opportunities</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Hierarchy depth • template drift • leakage risk • FX anomalies</div>
            </div>
            <div className="flex flex-col">
              {VIOLATIONS.map((v, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#E9EDEF] last:border-0 bg-[#F8FAFC]">
                  <span className="text-[14px]">{v.icon}</span>
                  <span className="font-extrabold text-[12px] text-[#111B21] flex-1">{v.title}</span>
                  <span className="text-[11px] text-[#667781]">{v.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Odoo ERP Sync ─────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-3 flex items-center gap-4">
            <div className="font-black text-[13px] text-[#111B21]">Odoo ERP Sync</div>
            <div className="text-[11px] text-[#667781]">Invoices batch: 02:00 • Last sync: 10:12 • Failures: 0 • Webhook: /odoo/invoice</div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full ml-auto ${okBg}`}>Status: OK</span>
          </div>

        </div>
      </main>

      {/* ── Right Blade: Create Tenant / Sub-Org ──────────────────────────── */}
      {bladeOpen && (
        <div className="w-[440px] shrink-0 bg-white border-l border-[#E9EDEF] flex flex-col overflow-hidden">
          {/* Blade header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9EDEF] shrink-0">
            <span className="font-black text-[14px] text-[#111B21]">Blade • Tenant Onboarding</span>
            <button onClick={() => setBladeOpen(false)} className="text-[11px] text-[#667781] bg-[#F0F2F5] border border-[#E9EDEF] rounded-lg px-3 py-1.5 cursor-pointer font-black hover:bg-[#E9EDEF]">ESC to close</button>
          </div>

          {/* Blade sub-header */}
          <div className="px-5 py-3 border-b border-[#E9EDEF] shrink-0">
            <div className="font-black text-[16px] text-[#111B21]">Create Tenant / Sub-Org</div>
            <div className="text-[11px] text-[#667781] mt-0.5">CRUD: Create • Update • Move to Trash • Restore</div>
            <div className="flex gap-1.5 mt-2">
              {MODAL_TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setBladeTab(t)}
                  className={`h-8 px-3 rounded-full text-[11px] font-black border-none cursor-pointer transition-all ${
                    bladeTab === t ? "bg-[#128C7E] text-white" : "bg-[#F0F2F5] text-[#667781] hover:bg-[#E9EDEF]"
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Blade body */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 py-4">

            {bladeTab === "Basics" && (
              <>
                <BladeSection title="Basics" sub="Hierarchy rules: Top cannot create units • dealer accounts should not host units">
                  <div className="grid grid-cols-2 gap-3 p-4">
                    <FormField label="Tenant name" value="Kampala_Boda_Fleet" />
                    <FormField label="Type" value="ORG ▾" />
                    <FormField label="Parent account" value="Kampala Dealer Rights ▾" />
                    <FormField label="Country" value="UG ▾" />
                    <FormField label="Currency" value="UGX ▾" />
                    <FormField label="Timezone" value="Africa/Kampala ▾" />
                  </div>
                </BladeSection>
              </>
            )}

            {bladeTab === "Billing & Tokens" && (
              <>
                <BladeSection title="Billing & Tokens (FIFO)" sub="US-02 FIFO queues per asset + domain • Safeguards: caps + 80% soft alert">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Plan & Entitlements */}
                      <div>
                        <div className="font-black text-[12px] text-[#111B21] mb-2">Plan &amp; Entitlements</div>
                        <FormField label="Billing plan" value="OLIWA-PLUS ▾" />
                        <FormField label="History retention" value="90 days" />
                        <FormField label="Daily token cap" value="300,000 tokens/day" />
                        <div className="text-[10px] text-[#667781] mt-1">Soft alert at 80% (configurable)</div>
                        <div className="text-[10px] text-[#667781] mt-1">Multi-currency: UGX/KES/USD/EUR/RWF/TZS</div>
                      </div>
                      {/* Top-Up Channels */}
                      <div>
                        <div className="font-black text-[12px] text-[#111B21] mb-2">Top-Up Channels</div>
                        {[
                          { n:"M-Pesa",       on:true  },
                          { n:"MTN MoMo",     on:true  },
                          { n:"Airtel Money",  on:true  },
                          { n:"Pesapal Cards", on:true  },
                          { n:"Flutterwave",   on:false },
                        ].map(c => (
                          <div key={c.n} className="flex items-center justify-between py-1.5">
                            <span className="text-[12px] text-[#111B21]">{c.n}</span>
                            <Toggle on={c.on} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </BladeSection>
              </>
            )}

            {bladeTab === "Modules" && (
              <BladeSection title="Modules & Add-Ons" sub="Enable/disable modules per tenant (RBAC-gated)">
                <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { n:"OLIWA Tracking",        on:true  },
                    { n:"PIKI (Motorcycle)",      on:false },
                    { n:"VEBA Marketplace",       on:true  },
                    { n:"AI Console (Waswa)",     on:true  },
                    { n:"Messaging Portal (WhatsApp/SMS)", on:true },
                    { n:"Video Telematics",       on:false },
                    { n:"Fuel & Sensors",         on:true  },
                  ].map(m => (
                    <div key={m.n} className="flex items-center justify-between">
                      <span className="text-[12px] text-[#111B21]">{m.n}</span>
                      <Toggle on={m.on} />
                    </div>
                  ))}
                </div>
              </BladeSection>
            )}

            {bladeTab === "RBAC" && (
              <BladeSection title="RBAC Roles" sub="Assign roles from templates or create custom">
                <div className="p-4 text-[12px] text-[#667781]">
                  Role templates: System Admin, Fleet Manager, Finance, Read-Only Observer, VEBA Ops, Driver (mobile-only). Custom roles require HITL approval.
                </div>
              </BladeSection>
            )}

            {bladeTab === "Review" && (
              <>
                <BladeSection title="Review & Submit (HITL/HIC)" sub="High-risk actions require approval + audit trail (Irreversible/Irrevocable/Irrefutable).">
                  <div className="p-4">
                    <div className="font-black text-[12px] text-[#111B21] mb-2">Risk checks</div>
                    {[
                      { check:"Cross-tenant share", result:"Blocked by policy" },
                      { check:"Price rule change",  result:"Requires approval" },
                      { check:"Refunds > threshold", result:"Requires HITL" },
                      { check:"Escrow payouts",     result:"Requires HIC if manual override" },
                      { check:"Data exports at scale",result:"Requires approval + logging" },
                    ].map(r => (
                      <div key={r.check} className="flex items-center gap-2 py-1.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0" />
                        <span className="font-black text-[#111B21] w-[160px]">{r.check}</span>
                        <span className="text-[#667781]">{r.result}</span>
                      </div>
                    ))}
                  </div>
                </BladeSection>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3">
                  <Pill>Save Draft</Pill>
                  <span className={`h-7 px-3 rounded-full text-[11px] font-black inline-flex items-center ${okBg} cursor-pointer`}>Request HITL Approval</span>
                  <span className={`h-7 px-3 rounded-full text-[11px] font-black inline-flex items-center ${critBg} cursor-pointer`}>Submit (after approval)</span>
                </div>

                {/* Audit Proof */}
                <BladeSection title="Audit Proof" sub="Every change is hash-chained and retained per plan.">
                  <div className="p-4">
                    <pre className="text-[11px] text-[#667781] font-mono bg-[#F8FAFC] rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
{`hash_prev: 6b2f…e91a
hash_this:  1c0d…7a22
actor: system_admin@tenant
action: create_tenant_draft
timestamp: 2026-02-24T10:22:18Z
sig: ed25519: 93af_0c1e`}
                    </pre>
                  </div>
                </BladeSection>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reusable components ─────────────────────────────────────────────────────
const pillStyles: Record<string, string> = {
  green: "bg-[#25D366] text-[#075E54]",
  alarm: "bg-[#F97316] text-white",
  ghost: "bg-white border border-[#E9EDEF] text-[#667781]",
};

function Pill({ color = "ghost", onClick, children }: { color?: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`h-7 px-3 rounded-full text-[11px] font-black border-none cursor-pointer hover:brightness-105 active:opacity-85 transition-all whitespace-nowrap ${pillStyles[color] ?? pillStyles.ghost}`}>
      {children}
    </button>
  );
}

function BladeSection({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 border border-[#E9EDEF] rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-2.5 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">{title}</div>
        {sub && <div className="text-[10px] text-[#667781] mt-0.5">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <div className="text-[10px] font-black text-[#667781] mb-1">{label}</div>
      <input defaultValue={value} className="w-full h-9 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-3 text-[12px] font-black text-[#111B21] outline-none focus:border-[#128C7E] transition-colors" />
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${on ? "bg-[#128C7E]" : "bg-[#D1D5DB]"}`}>
      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${on ? "left-[22px]" : "left-0.5"}`} />
    </div>
  );
}