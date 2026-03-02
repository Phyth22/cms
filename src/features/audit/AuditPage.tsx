/**
 * AuditPage — Screen 12: IRREFUTABLE CONTROL VAULT
 *
 * Matches v26 mockups (6 screenshots):
 *   TOP:    Header + Export/Approvals → 4 KPIs (bar accent) → Filters + Live Stream
 *           → Audit Stream table (20 rows) + right sidebar (Waswa AI + Approval Queue)
 *   MID:    Table cont. → Tamper Evidence Hash Chain (5 blocks) + Compliance Snapshot
 *   BOTTOM: Retention + Export Controls (4 cards)
 *   MODAL:  Export Audit Pack (HIC) — 4-step wizard (Scope, Format, Redaction, Approval)
 */
import React, { useState } from "react";

// ─── Severity dot colors ─────────────────────────────────────────────────────
const sevDot: Record<string, string> = {
  Info: "bg-[#9CA3AF]", Warn: "bg-[#FBBF24]", Alarm: "bg-[#F97316]", Crit: "bg-[#EF4444]",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const AUDIT_EVENTS = [
  { time:"09:12:06", actor:"waswa.agent",   action:"SUGGEST",  object:"Leakage spike: VEBA-Boda",   domain:"VEBA",  sev:"Warn"  },
  { time:"09:12:13", actor:"sys.admin",     action:"APPROVE",  object:"Export Audit Pack",           domain:"AUDIT", sev:"Alarm" },
  { time:"09:12:20", actor:"mtn.momo",      action:"WEBHOOK",  object:"Callback retry queued",       domain:"PAY",   sev:"Warn"  },
  { time:"09:13:27", actor:"svc.billing",   action:"BURN",     object:"Tokens/sec → 0.83",           domain:"TOK",   sev:"Info"  },
  { time:"09:13:34", actor:"sys.admin",     action:"EDIT",     object:"Price rule v18 → v19",        domain:"TOK",   sev:"Crit"  },
  { time:"09:13:41", actor:"rbac.guard",    action:"BLOCK",    object:"Cross-tenant scope denied",   domain:"RBAC",  sev:"Crit"  },
  { time:"09:14:48", actor:"mpesa",         action:"SETTLE",   object:"Escrow release #VB-44921",    domain:"VEBA",  sev:"Alarm" },
  { time:"09:14:55", actor:"svc.kafka",     action:"LAG",      object:"Consumer lag 18s",            domain:"INFRA", sev:"Warn"  },
  { time:"09:14:02", actor:"sys.admin",     action:"MINT",     object:"Manual token credit",         domain:"TOK",   sev:"Alarm" },
  { time:"09:15:09", actor:"ai.modelops",   action:"DEPLOY",   object:"Waswa v2.6 hotfix",           domain:"AI",    sev:"Alarm" },
  { time:"09:15:30", actor:"sys.admin",     action:"SUSPEND",  object:"Account suspend requested",   domain:"BILL",  sev:"Crit"  },
  { time:"09:16:37", actor:"svc.export",    action:"EXPORT",   object:"CSV export started",          domain:"AUDIT", sev:"Warn"  },
  { time:"09:16:44", actor:"device.parser", action:"ERROR",    object:"Unknown field spike",         domain:"INFRA", sev:"Warn"  },
  { time:"09:17:51", actor:"sys.admin",     action:"RESTORE",  object:"Restore from Trash",          domain:"CMS",   sev:"Info"  },
  { time:"09:17:58", actor:"waswa.agent",   action:"Nudge",    object:"Suggest cap: Video spend",    domain:"AI",    sev:"Warn"  },
  { time:"09:17:05", actor:"svc.pay",       action:"RECON",    object:"Paid-not-credited risk",      domain:"PAY",   sev:"Alarm" },
  { time:"09:18:12", actor:"sys.admin",     action:"ACK",      object:"P1 incident acknowledged",    domain:"ALRM",  sev:"Alarm" },
  { time:"09:18:19", actor:"svc.redis",     action:"EVICT",    object:"Cache evictions high",        domain:"INFRA", sev:"Warn"  },
  { time:"09:18:26", actor:"sys.admin",     action:"EXPORT",   object:"Audit pack PDF",              domain:"AUDIT", sev:"Alarm" },
  { time:"09:19:33", actor:"svc.veba",      action:"FLAG",     object:"Owner contact leak attempt",  domain:"VEBA",  sev:"Warn"  },
];

const HASH_BLOCKS = [201, 202, 203, 204, 205];

const APPROVAL_QUEUE = [
  { dot:"bg-[#F97316]", title:"Price rule v19",      sub:"Needs 1 approver",  badge:"HITL" },
  { dot:"bg-[#EF4444]", title:"Refund > UGX 2M",    sub:"Needs 2 approvers", badge:"HIC"  },
  { dot:"bg-[#34B7F1]", title:"Export audit pack",   sub:"Scheduled 10:00",   badge:"HIC"  },
  { dot:"bg-[#25D366]", title:"VEBA escrow release", sub:"On trip complete",  badge:"HIC"  },
];

const ARTIFACTS = [
  "Audit stream (Kafka) — immutable event log",
  "HIC Overrides log (kill-switch / suspensions)",
  "HITL Approvals log (pricing / refunds / deployments)",
  "Payments reconciliations (M-Pesa/MTN/Airtel) + webhooks",
  "Token ledger snapshot (FIFO instances) + burn history",
  "VEBA escrow settlements + dispute events",
  "RBAC changes + privileged access review",
  "Exports + data access proofs",
  "Hash chain blocks + signatures",
  "System health microstats (Kafka lag / DB p95)",
  "Waswa AI suggestions + acceptance/reject trail",
  "Redaction policy + applied masks",
  "Checksum manifest (SHA256)",
];

// ─── Page Component ──────────────────────────────────────────────────────────
export function AuditPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 p-3">

          {/* Header */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-black text-[16px] text-[#111B21]">Audit Logs &amp; Compliance</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Home &gt; Asset &amp; Resource Gov &gt; Audit Logs</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Pill color="green" onClick={() => setModalOpen(true)}>Export</Pill>
                <Pill>Approvals</Pill>
              </div>
            </div>
          </div>

          {/* ════════════════════ TOP SCROLL ════════════════════════════ */}

          {/* 4 KPIs with vertical bar accent */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Audit ingest p95" value="18s"  sub="Target <60s"          bar="bg-[#34B7F1]" />
            <KpiCard label="Log gaps"         value="1"    sub="Last 24h"             bar="bg-[#EF4444]" />
            <KpiCard label="Sensitive actions" value="14"  sub="Pricing/Refund/RBAC"  bar="bg-[#F97316]" />
            <KpiCard label="Retention"        value="180d" sub="Plan entitlement"     bar="bg-[#25D366]" />
          </div>

          {/* Filters + Live Stream toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-black text-[#111B21]">Filters</span>
            {["Domain: ALL","Severity: ANY","Approval: HITL/HIC","Range: 24h"].map(f => (
              <span key={f} className="h-8 px-3 rounded-lg bg-white border border-[#E9EDEF] text-[12px] text-[#111B21] flex items-center">{f}</span>
            ))}
            <span className="ml-auto h-8 px-4 rounded-full bg-[#075E54] text-white text-[11px] font-black flex items-center cursor-pointer">Live Stream: ON</span>
          </div>

          {/* Audit Stream Table */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF] flex items-center gap-3">
              <span className="font-black text-[13px] text-[#111B21]">AUDIT STREAM (Kafka topic: audit_events)</span>
              <div className="ml-auto flex gap-2">
                <Pill color="green" onClick={() => setModalOpen(true)}>Export Pack</Pill>
                <Pill>+ Rule</Pill>
              </div>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-[12px] min-w-[900px]">
                <thead><tr className="border-b-2 border-[#128C7E]/30">
                  {["Time","Actor","Action","Object","Domain","Sev"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {AUDIT_EVENTS.map((e,i) => (
                    <tr key={i} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC] cursor-pointer">
                      <td className="px-3 py-2 font-mono text-[#667781] whitespace-nowrap">{e.time}</td>
                      <td className="px-3 py-2 text-[#667781]">{e.actor}</td>
                      <td className="px-3 py-2">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-[#128C7E] text-white">{e.action}</span>
                      </td>
                      <td className="px-3 py-2 text-[#111B21]">{e.object}</td>
                      <td className="px-3 py-2 text-[#667781]">{e.domain}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block align-middle ${sevDot[e.sev] ?? "bg-[#9CA3AF]"}`} />
                        <span className="ml-1.5 text-[#667781] align-middle">{e.sev}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 text-[10px] text-[#667781] italic border-t border-[#E9EDEF]">
              Tip: click a row → right blade (Event Details) • High-risk actions require HITL/HIC + hash-chain proof.
            </div>
          </div>

          {/* ════════════════════ MID SCROLL ════════════════════════════ */}

          {/* Tamper Evidence (Hash Chain) */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
            <div className="font-black text-[13px] text-[#111B21]">Tamper Evidence (Hash Chain)</div>
            <div className="text-[11px] text-[#667781] mt-0.5 mb-3">
              Irrefutable logs: every event signed + chained. Any gap triggers auto-escalation.
            </div>
            <div className="flex gap-0 items-center overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {HASH_BLOCKS.map((id, i) => (
                <React.Fragment key={id}>
                  <div className="min-w-[150px] bg-[#F8FAFC] border border-[#E9EDEF] rounded-xl p-3 relative shrink-0">
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                    <div className="font-black text-[13px] text-[#111B21]">Block {id}</div>
                    <div className="text-[11px] text-[#667781] mt-0.5">SHA256</div>
                  </div>
                  {i < HASH_BLOCKS.length - 1 && (
                    <div className="flex items-center shrink-0 px-1">
                      <span className="w-5 h-0.5 bg-[#25D366] rounded-full" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ════════════════════ BOTTOM SCROLL ═════════════════════════ */}

          {/* Retention + Export Controls */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
            <div className="font-black text-[13px] text-[#111B21] mb-3">Retention + Export Controls</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { k:"Plan Entitlement",  v:"180 days",     sub:"Tied to billing plan" },
                { k:"Export Rate Limit",  v:"500 rows/min", sub:"Prevents data exfil" },
                { k:"Redaction",          v:"PII masked",   sub:"RBAC + audit proofs" },
                { k:"Archive",            v:"S3/Blob",      sub:"Immutable cold storage" },
              ].map(c => (
                <div key={c.k} className="border border-[#E9EDEF] rounded-xl p-3">
                  <div className="text-[11px] text-[#667781] mb-1">{c.k}</div>
                  <div className="font-black text-[16px] text-[#128C7E] leading-tight">{c.v}</div>
                  <div className="text-[10px] text-[#667781] mt-1">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ── Right Sidebar: Waswa AI + Approval Queue ─────────────── */}
      <aside className="w-[380px] shrink-0 bg-white border-l border-[#E9EDEF] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-4 flex flex-col gap-3">

        {/* Waswa AI Co-Pilot */}
        <div className="bg-[#128C7E] text-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-[13px]">Waswa AI • Co-Pilot</span>
            <span className="text-[10px] font-black bg-[#25D366] text-[#075E54] px-2 py-0.5 rounded-full">ON</span>
          </div>
          <div className="text-[11px] leading-relaxed opacity-90 mb-3">
            {[
              "Leakage risk ↑ in VEBA Boda: 2.1x baseline",
              "Suggest: enable 'Info Gating' + token unlock",
              "Payments: Airtel UG p95 latency 11s → retry window",
              "AI cost: route low-risk events to Local Engine (Tier 1)",
            ].map((t,i) => (
              <div key={i} className="flex items-start gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] mt-1 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <input
            placeholder="Ask Waswa...  (e.g., 'show HIC overrides last 24h')"
            className="w-full h-8 rounded-lg bg-white/15 border-none px-3 text-[11px] text-white placeholder:text-white/60 outline-none"
          />
        </div>

        {/* Auto + HIC badges */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#9CA3AF]" /><span className="text-[#667781]">Auto</span></span>
          <span className="font-mono font-black text-[#111B21]">AU-440135</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span className="text-[#128C7E] font-black">HIC</span>
          <span className="font-mono font-black text-[#111B21] ml-1">AU-440123</span>
        </div>

        {/* HITL / HIC Approval Queue */}
        <div className="border border-[#E9EDEF] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E9EDEF]">
            <div className="font-black text-[13px] text-[#111B21]">HITL / HIC Approval Queue</div>
          </div>
          <div className="p-3 flex flex-col gap-3">
            {APPROVAL_QUEUE.map((a,i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${a.dot} mt-0.5 shrink-0`} />
                  <div>
                    <div className="font-black text-[12px] text-[#111B21]">{a.title}</div>
                    <div className="text-[10px] text-[#667781]">{a.sub}</div>
                  </div>
                </div>
                <span className="text-[11px] font-black text-[#111B21]">{a.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Snapshot */}
        <div className="bg-[#075E54] text-white rounded-xl p-4">
          <div className="font-black text-[13px] mb-2.5">Compliance Snapshot</div>
          {[
            { dot:"bg-[#25D366]", k:"Retention OK",  v:"180/180 days" },
            { dot:"bg-[#25D366]", k:"Crypto seal",   v:"valid" },
            { dot:"bg-[#FBBF24]", k:"Gaps",          v:"1 incident" },
            { dot:"bg-[#F97316]", k:"Approvals",     v:"HIC backlog: 2" },
          ].map(c => (
            <div key={c.k} className="flex items-center justify-between mb-1.5 text-[12px]">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />{c.k}
              </span>
              <span className="font-black">{c.v}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Modal: Export Audit Pack (HIC) ────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/35 z-50 grid place-items-center" onClick={() => setModalOpen(false)}>
          <div className="w-[min(720px,calc(100vw-24px))] max-h-[calc(100vh-24px)] bg-white rounded-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E9EDEF] flex items-center justify-between shrink-0">
              <div>
                <div className="font-black text-[16px] text-[#111B21]">Export Audit Pack (HIC)</div>
                <div className="text-[11px] text-[#667781] mt-0.5">PDF/CSV + signatures + redaction • requires approval</div>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[#667781] font-black text-[14px] cursor-pointer grid place-items-center hover:bg-[#E9EDEF]">✕</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5">

              {/* Warning banner */}
              <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] shrink-0" />
                <span className="text-[12px] font-black text-[#111B21]">High-risk export: cross-tenant leakage prevention enforced.</span>
              </div>

              {/* Wizard steps */}
              <div className="flex gap-2 mb-5">
                {["1. Scope","2. Format","3. Redaction","4. Approval"].map((s,i) => (
                  <span key={s} className={`flex-1 h-9 rounded-lg text-[12px] font-black flex items-center justify-center border cursor-pointer ${i === 0 ? "bg-[#128C7E]/10 border-[#128C7E]/30 text-[#128C7E]" : "bg-white border-[#E9EDEF] text-[#667781]"}`}>{s}</span>
                ))}
              </div>

              {/* ─── Scope ─── */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Scope</div>
              <div className="border border-[#E9EDEF] rounded-xl p-3 mb-4">
                <div className="flex gap-6 text-[12px] mb-2">
                  <span><span className="text-[#667781]">Tenant</span> <span className="font-black text-[#111B21] ml-2">3D-TEPU (UG) ▾</span></span>
                </div>
                <div className="flex gap-6 text-[12px]">
                  <span><span className="text-[#667781]">Date range</span> <span className="font-black text-[#111B21] ml-2">Last 24h</span></span>
                  <span><span className="text-[#667781]">Include sub-tenants:</span> <span className="font-black text-[#111B21] ml-2">NO</span></span>
                </div>
              </div>

              {/* ─── Artifacts included ─── */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Artifacts included</div>
              <div className="border border-[#E9EDEF] rounded-xl p-3 mb-4">
                {ARTIFACTS.map(a => (
                  <div key={a} className="flex items-center gap-2 text-[12px] text-[#111B21] mb-1.5 last:mb-0">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0" />{a}
                  </div>
                ))}
              </div>

              {/* ─── Formats ─── */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Formats</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { fmt:"PDF (signed)", on:true  }, { fmt:"CSV",  on:true  },
                  { fmt:"XLSX",         on:false }, { fmt:"JSON", on:true  },
                ].map(f => (
                  <div key={f.fmt} className="flex items-center gap-2 border border-[#E9EDEF] rounded-xl px-3 py-2.5 text-[12px]">
                    <span className={`w-2.5 h-2.5 rounded-full ${f.on ? "bg-[#25D366]" : "bg-[#9CA3AF]"} shrink-0`} />
                    <span className="text-[#111B21]">{f.fmt}</span>
                  </div>
                ))}
              </div>

              {/* ─── Redaction ─── */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Redaction</div>
              <div className="bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-xl p-4 mb-4">
                <div className="font-black text-[12px] text-[#F97316] mb-1.5">Mask PII (phone, email, ID)</div>
                <div className="text-[12px] text-[#111B21] leading-relaxed">
                  Policy: RBAC-driven. System Admin sees masked fields unless escalated.<br/>
                  <strong>Include raw payloads: NO (recommended)</strong><br/>
                  <strong>Export watermark: ON</strong><br/>
                  <strong>Recipient channels: Email + WhatsApp (link)</strong>
                </div>
              </div>

              {/* ─── Approval ─── */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Approval</div>
              <div className="bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-xl p-4">
                <div className="font-black text-[12px] text-[#EF4444] mb-1.5">HIC required</div>
                <div className="text-[12px] text-[#111B21] mb-2"><strong>Select approvers (2):</strong></div>
                <div className="border border-[#E9EDEF] rounded-lg px-3 py-2 text-[12px] text-[#111B21] bg-white mb-2">
                  Finance Lead ▾ &ensp;+ &ensp;Compliance Officer ▾
                </div>
                <div className="text-[11px] text-[#667781]">Audit seal will be appended to manifest.</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-[#E9EDEF] bg-white shrink-0">
              <button onClick={() => setModalOpen(false)} className="h-10 px-6 rounded-lg bg-white border border-[#E9EDEF] text-[13px] font-black text-[#111B21] cursor-pointer hover:bg-[#F8FAFC]">Cancel</button>
              <button onClick={() => setModalOpen(false)} className="h-10 px-6 rounded-lg bg-[#25D366] text-[#075E54] text-[13px] font-black border-none cursor-pointer hover:brightness-105">Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reusable Components ─────────────────────────────────────────────────────
const pillStyles: Record<string, string> = {
  green: "bg-[#25D366] text-[#075E54]",
  ghost: "bg-white border border-[#E9EDEF] text-[#667781]",
};

function Pill({ color = "ghost", onClick, children }: { color?: string; onClick?: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`h-7 px-3 rounded-full text-[11px] font-black border-none cursor-pointer hover:brightness-105 active:opacity-85 transition-all whitespace-nowrap ${pillStyles[color] ?? pillStyles.ghost}`}>{children}</button>;
}

function KpiCard({ label, value, sub, bar }: { label: string; value: string; sub: string; bar: string }) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl p-3 relative overflow-hidden">
      <div className={`absolute top-0 right-3 w-1.5 h-full ${bar} rounded-b-full`} />
      <div className="text-[11px] text-[#667781]">{label}</div>
      <div className="text-[22px] font-black text-[#111B21] mt-1 leading-tight">{value}</div>
      <div className="text-[10px] text-[#667781] mt-1">{sub}</div>
    </div>
  );
}