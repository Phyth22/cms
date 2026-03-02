/**
 * BillingPage — Screen 10: THE IRREFUTABLE METERING LEDGER
 *
 * Matches v26 mockups (9 screenshots):
 *   TOP:     Header + 4 KPIs → 2-col (Pipeline Anchors | Top Cost Drivers) → Filters → Usage Ledger
 *   MID:     Ledger continued + Waswa AI Insights float + action buttons
 *   BOTTOM:  Reconciliation Batches → Odoo ERP Sync → Footer
 *   BLADE:   Event detail (tabs: Overview, Payload, Audit Trail, Links)
 *   MODAL:   Reconcile Run HITL (Purpose, Scope, Cost, Guardrails, Approvals, Preview, Proof, Audit)
 */
import React, { useState } from "react";

// ─── Status colors ───────────────────────────────────────────────────────────
const stColor: Record<string, string> = {
  BILLED:  "text-[#128C7E]",
  PENDING: "text-[#F97316]",
  FAILED:  "text-[#EF4444]",
  REVIEW:  "text-[#F97316]",
};
const rbColor: Record<string, string> = {
  READY:   "text-[#111B21]",
  PENDING: "text-[#F97316]",
  OK:      "text-[#25D366]",
  BLOCKED: "text-[#EF4444]",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const LEDGER = [
  { id:"EV-9821", tenant:"TEPU", domain:"VEBA",   product:"VEBA",   units:1, tokens:34.0, status:"PENDING", source:"mpesa_callback",  hash:"9f0d…c2aa" },
  { id:"EV-9820", tenant:"TEPU", domain:"AI",     product:"DASH",   units:1, tokens:12.5, status:"BILLED",  source:"ai_inference",    hash:"4b2e…a1f3" },
  { id:"EV-9819", tenant:"ACME", domain:"GPS",    product:"OLIWA",  units:1, tokens:0.6,  status:"BILLED",  source:"gps_ingest",      hash:"82c1…ff09" },
  { id:"EV-9818", tenant:"ACME", domain:"FUEL",   product:"MAFUTA", units:1, tokens:4.2,  status:"REVIEW",  source:"fuel_sensor",     hash:"d3a7…8b11" },
  { id:"EV-9817", tenant:"KLA",  domain:"MSG",    product:"CMS",    units:1, tokens:0.9,  status:"BILLED",  source:"whatsapp_api",    hash:"e9b3…09ff" },
  { id:"EV-9816", tenant:"TEPU", domain:"VEBA",   product:"VEBA",   units:1, tokens:34.0, status:"FAILED",  source:"mpesa_callback",  hash:"7aa1…bd12" },
  { id:"EV-9815", tenant:"TEPU", domain:"GPS",    product:"PIKI",   units:4, tokens:2.4,  status:"BILLED",  source:"socket_ingest",   hash:"19c2…f3a0" },
  { id:"EV-9814", tenant:"ACME", domain:"SIM",    product:"CMS",    units:1, tokens:1.1,  status:"BILLED",  source:"telco_api",       hash:"2c11…ca70" },
  { id:"EV-9813", tenant:"KLA",  domain:"VEBA",   product:"VEBA",   units:1, tokens:8.0,  status:"PENDING", source:"escrow_service",  hash:"a11e…6e22" },
  { id:"EV-9812", tenant:"TEPU", domain:"REPORT", product:"BI",     units:1, tokens:3.0,  status:"BILLED",  source:"report_job",      hash:"0b1c…aa00" },
];

const RECON_BATCHES = [
  { batch:"RB-221", window:"Last 6h (UTC)", tenants:12, mismatches:84,  value:"UGX 2.4M", mode:"DRY-RUN", approval:"HITL", status:"READY"   },
  { batch:"RB-220", window:"00:00–06:00",   tenants:12, mismatches:19,  value:"KES 188k", mode:"APPLY",   approval:"HITL", status:"PENDING" },
  { batch:"RB-219", window:"Yesterday",     tenants:9,  mismatches:0,   value:"—",        mode:"APPLY",   approval:"AUTO", status:"OK"      },
  { batch:"RB-218", window:"Backfill 7d",   tenants:4,  mismatches:311, value:"USD 4.1k", mode:"DRY-RUN", approval:"HIC",  status:"BLOCKED" },
];

const TOP_DRIVERS = [
  { name:"AI video_retrieval", rps:"RPS 10.1", dot:"bg-[#FBBF24]" },
  { name:"maps_route_api",     rps:"RPS 9.7",  dot:"bg-[#F97316]" },
  { name:"whatsapp_alert",     rps:"RPS 8.8",  dot:"bg-[#25D366]" },
  { name:"fuel_theft_event",   rps:"RPS 8.6",  dot:"bg-[#25D366]" },
  { name:"gps_ping",           rps:"RPS 5.1",  dot:"bg-[#25D366]" },
];

const BLADE_TABS = ["Overview","Payload","Audit Trail","Links"];

const MISMATCHES = [
  { ev:"EV-9821", type:"PAY",  reason:"Webhook timeout; callback retry pending",  impact:"UGX 420k" },
  { ev:"EV-9816", type:"PAY",  reason:"Callback failed; token credit not applied",impact:"UGX 610k" },
  { ev:"EV-9818", type:"TOK",  reason:"Rule version mismatch (needs approval)",   impact:"KES 188k" },
  { ev:"EV-9813", type:"VEBA", reason:"Booking ended; no invoice link",           impact:"UGX 96k"  },
  { ev:"EV-9804", type:"MSG",  reason:"WhatsApp template resend; duplicated",     impact:"UGX 12k"  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export function BillingPage() {
  const [bladeOpen, setBladeOpen] = useState(false);
  const [bladeTab, setBladeTab] = useState("Overview");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 p-3">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-3">
            <div className="text-[10px] font-black text-[#128C7E] bg-[#EAF7F3] border border-[#128C7E] px-2 py-0.5 rounded-full inline-block mb-1">SCREEN 10</div>
            <div className="text-[11px] text-[#667781] mb-0.5">Token Engine ▸ Usage Event Metering (US-03)</div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[16px] text-[#111B21]">The Irrefutable Metering Ledger</span>
                  <span className="text-[10px] font-black bg-[#128C7E] text-white px-2 py-0.5 rounded-full">HIC / HITL</span>
                </div>
                <div className="text-[11px] text-[#667781] mt-0.5">Single source of truth for billable events • Immutable log • Kafka-aligned • Odoo-ready</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Pill>+ New Rule</Pill>
                <Pill color="green" onClick={() => setModalOpen(true)}>Run reconcile</Pill>
                <Pill>Export</Pill>
              </div>
            </div>
          </div>

          {/* ════════════════════ TOP SCROLL ════════════════════════════ */}

          {/* ── 4 KPI Cards ──────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard id="UEM-01" title="Usage events/min" value="18.4k" delta="+6%" deltaTone="text-[#25D366]" sub="p95 ingest < 2s" dot="bg-[#25D366]" bar />
            <KpiCard id="UBL-01" title="Unbilled backlog" value="2h 10m" delta="+48m" deltaTone="text-[#F97316]" sub="p95 age" dot="bg-[#F97316]" bar />
            <KpiCard id="REC-01" title="Recon mismatch" value="0.8%" delta="+0.3%" deltaTone="text-[#F97316]" sub="value" dot="bg-[#EF4444]" />
            <KpiCard id="TOK-01" title="Burn rate" value="12.8 tok/s" delta="-0.4" deltaTone="text-[#EF4444]" sub="forecast 9.2d" dot="bg-[#25D366]" />
          </div>

          {/* ── 2-col: Pipeline Anchors | Top Cost Drivers ───────────── */}
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 items-start">
            {/* Pipeline Anchors */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
              <div className="font-black text-[13px] text-[#111B21] mb-1">Pipeline Anchors</div>
              <div className="text-[11px] text-[#667781] mb-3">Kafka topic: usage_events • Partitioned by tenant_id • Idempotent keys</div>
              {[
                { k:"Source:", v:"Python ingest → Kafka producer (Node.js)" },
                { k:"Write:",  v:"Cassandra usage_raw (immutable) + Postgres billing_ledger" },
                { k:"Cache:",  v:"Redis latest_usage (SSE feeds UI)" },
                { k:"Proof:",  v:"Hash chain OK (no gaps detected)" },
              ].map(a => (
                <div key={a.k} className="flex items-center gap-2.5 mb-2 text-[12px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shrink-0" />
                  <span className="font-black text-[#111B21] w-[60px] shrink-0">{a.k}</span>
                  <span className="text-[#667781]">{a.v}</span>
                </div>
              ))}
            </div>

            {/* Top Cost Drivers */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
              <div className="font-black text-[13px] text-[#111B21] mb-3">Top Cost Drivers (RPS)</div>
              {TOP_DRIVERS.map(d => (
                <div key={d.name} className="flex items-center justify-between mb-2.5 text-[12px]">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.dot} shrink-0`} />
                    <span className="font-mono text-[#111B21]">{d.name}</span>
                  </span>
                  <span className="text-[10px] font-black text-white bg-[#128C7E] px-2 py-0.5 rounded-full">{d.rps}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Filters ──────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-[13px] text-[#111B21]">Filters</span>
              <span className="text-[11px] text-[#667781]">Tenant • Domain • Time range • Status • Source • Risk</span>
            </div>
            <Pill>Reset</Pill>
          </div>

          {/* ── Usage Ledger ─────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Usage Ledger (immutable)</div>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-[12px] min-w-[1000px]">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                {["Event ID","Tenant","Domain","Product","Units","Tokens","Status","Source","Hash"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {LEDGER.map(e => (
                  <tr key={e.id} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC] cursor-pointer" onClick={() => { setBladeOpen(true); setBladeTab("Overview"); }}>
                    <td className="px-3 py-2.5 font-black text-[#111B21]">{e.id}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{e.tenant}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{e.domain}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{e.product}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{e.units}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{e.tokens}</td>
                    <td className={`px-3 py-2.5 font-black ${stColor[e.status] ?? "text-[#111B21]"}`}>{e.status}</td>
                    <td className="px-3 py-2.5 font-mono text-[#667781]">{e.source}</td>
                    <td className="px-3 py-2.5 font-mono text-[#667781]">{e.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {/* Actions row */}
            <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-[#E9EDEF]">
              <Pill>Open mismatch</Pill>
              <Pill color="green" onClick={() => setModalOpen(true)}>Run reconcile</Pill>
            </div>
          </div>

          {/* ── Waswa AI Insights (floating card in mockup, inline here) */}
          <div className="bg-[#128C7E] text-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-[13px]">Waswa AI • Insights</span>
              <span className="text-[12px] opacity-70 cursor-pointer">···</span>
            </div>
            <div className="text-[11px] leading-relaxed opacity-90">
              <div>• Recon drift: 0.8% value (↑) — top cause: webhook retries</div>
              <div>• Suspected leakage: VEBA booking completed without payment match</div>
              <div>• Suggest: run DRY-RUN reconcile (last 6h) + approve patch</div>
            </div>
          </div>

          {/* ════════════════════ BOTTOM SCROLL ═════════════════════════ */}

          {/* ── Reconciliation Batches ────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Reconciliation Batches</div>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-[12px] min-w-[900px]">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E9EDEF]">
                {["Batch","Window","Tenants","Mismatches","Est. Value","Mode","Approval","Status"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {RECON_BATCHES.map(b => (
                  <tr key={b.batch} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2.5 font-black text-[#111B21]">{b.batch}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{b.window}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{b.tenants}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{b.mismatches}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{b.value}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{b.mode}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{b.approval}</td>
                    <td className={`px-3 py-2.5 font-black ${rbColor[b.status] ?? "text-[#111B21]"}`}>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* ── Odoo ERP Sync ────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
            <div className="font-black text-[13px] text-[#111B21]">Odoo ERP Sync (Back Office)</div>
            <div className="text-[11px] text-[#667781] mt-0.5 mb-3">Push invoices, payments, and usage proof to Odoo projects &amp; finance ledgers.</div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { dot:"bg-[#25D366]", k:"Last sync", v:"3m ago" },
                { dot:"bg-[#FBBF24]", k:"Queue",     v:"14 jobs" },
                { dot:"bg-[#FBBF24]", k:"Failures",  v:"2 (retry)" },
                { dot:"bg-[#25D366]", k:"Mapping",   v:"Tenant→Odoo OK" },
              ].map(s => (
                <div key={s.k} className="border border-[#E9EDEF] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#667781] mb-1">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    {s.k}
                  </div>
                  <div className="font-black text-[14px] text-[#111B21]">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <Pill>Open mapping</Pill>
              <Pill color="green">Run sync</Pill>
              <Pill>Export proof PDF</Pill>
            </div>
            <div className="text-[10px] text-[#667781]">HIC rule: Any action that changes invoice totals, refunds, or credits requires approval + cryptographic audit trail.</div>
          </div>

          <div className="text-[11px] text-[#667781] italic px-1 pb-2">End of page</div>
        </div>
      </main>

      {/* ── Blade: Event Detail ───────────────────────────────────── */}
      {bladeOpen && (
        <div className="w-[420px] shrink-0 bg-white border-l border-[#E9EDEF] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9EDEF] shrink-0">
            <div className="font-black text-[14px] text-[#111B21]">Blade • Event EV-9821</div>
            <button onClick={() => setBladeOpen(false)} className="w-7 h-7 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[#667781] font-black text-[13px] cursor-pointer grid place-items-center hover:bg-[#E9EDEF]">✕</button>
          </div>
          <div className="flex gap-1.5 px-5 py-2.5 border-b border-[#E9EDEF] shrink-0">
            {BLADE_TABS.map(t => (
              <button key={t} onClick={() => setBladeTab(t)} className={`h-8 px-3 rounded-full text-[11px] font-black border-none cursor-pointer transition-all ${bladeTab === t ? "bg-[#128C7E] text-white" : "bg-[#F0F2F5] text-[#667781] hover:bg-[#E9EDEF]"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 py-4">

            {bladeTab === "Overview" && (<>
              <BSection title="Event Summary">
                <div className="p-4"><KV rows={[
                  {k:"Domain:",  v:"VEBA"}, {k:"Product:", v:"VEBA"}, {k:"Tenant:",  v:"3D • TEPU"},
                  {k:"Tokens:",  v:"34.0"}, {k:"Status:",  v:"PENDING (webhook retry)"}, {k:"Hash:", v:"9f0d…c2aa"},
                ]} /></div>
              </BSection>
              <BSection title="HITL Actions">
                <div className="p-4 flex gap-2 flex-wrap">
                  <button className="h-8 px-3 rounded-lg bg-[#128C7E] text-white text-[11px] font-black border-none cursor-pointer">Replay to Kafka</button>
                  <button className="h-8 px-3 rounded-lg bg-[#EF4444] text-white text-[11px] font-black border-none cursor-pointer">Mark disputed</button>
                  <button className="h-8 px-3 rounded-lg bg-[#34B7F1] text-white text-[11px] font-black border-none cursor-pointer">Open booking</button>
                </div>
              </BSection>
              <BSection title="Payload (masked PII)">
                <pre className="p-4 text-[11px] font-mono text-[#667781] leading-relaxed whitespace-pre-wrap">{"{\n  \"event_id\": \"EV-9821\",\n  \"tenant_id\": \"TEPU\",\n  \"domain\": \"VEBA\",\n  \"booking_id\": \"BK-77102\",\n  \"payment_ref\": \"MPESA-…-1142\",\n  \"tokens\": 34.0,\n  \"rps\": 9.7,\n  \"ts\": \"2026-02-24T11:42:10Z\"\n}"}</pre>
              </BSection>
              <BSection title="Audit Trail (Irrefutable)">
                <div className="p-4 flex flex-col gap-2">
                  {[
                    {ts:"11:42:10", dot:"bg-[#25D366]", ev:"Usage event emitted"},
                    {ts:"11:42:11", dot:"bg-[#25D366]", ev:"Kafka write OK"},
                    {ts:"11:42:12", dot:"bg-[#25D366]", ev:"Billing ledger insert"},
                    {ts:"11:43:01", dot:"bg-[#FBBF24]", ev:"Payment callback timeout"},
                    {ts:"11:43:31", dot:"bg-[#FBBF24]", ev:"Retry #1 scheduled"},
                  ].map(a => (
                    <div key={a.ts} className="flex items-center gap-2.5 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
                      <span className="font-black text-[#111B21] w-[56px] font-mono">{a.ts}</span>
                      <span className="text-[#667781]">{a.ev}</span>
                    </div>
                  ))}
                </div>
              </BSection>
              <BSection title="Linked Objects">
                <div className="p-4"><KV rows={[
                  {k:"Booking:", v:"BK-77102"}, {k:"Invoice:", v:"INV-TEPU-22014"},
                  {k:"Txn:",     v:"MPESA-…-1142"}, {k:"Asset:", v:"KLA-BODA-044"},
                ]} /></div>
              </BSection>
            </>)}

            {bladeTab === "Payload" && (
              <BSection title="Raw Payload (masked PII)">
                <pre className="p-4 text-[11px] font-mono text-[#667781] leading-relaxed whitespace-pre-wrap">{"{\n  \"event_id\": \"EV-9821\",\n  \"tenant_id\": \"TEPU\",\n  \"domain\": \"VEBA\",\n  \"booking_id\": \"BK-77102\",\n  \"payment_ref\": \"MPESA-…-1142\",\n  \"tokens\": 34.0,\n  \"rps\": 9.7,\n  \"ts\": \"2026-02-24T11:42:10Z\"\n}"}</pre>
              </BSection>
            )}
            {bladeTab === "Audit Trail" && (<>
              <BSection title="Audit Trail (Irrefutable)">
                <div className="p-4 flex flex-col gap-2">
                  {[
                    {ts:"11:42:10", dot:"bg-[#25D366]", ev:"Usage event emitted"},
                    {ts:"11:42:11", dot:"bg-[#25D366]", ev:"Kafka write OK"},
                    {ts:"11:42:12", dot:"bg-[#25D366]", ev:"Billing ledger insert"},
                    {ts:"11:43:01", dot:"bg-[#FBBF24]", ev:"Payment callback timeout"},
                    {ts:"11:43:31", dot:"bg-[#FBBF24]", ev:"Retry #1 scheduled"},
                  ].map(a => (
                    <div key={a.ts} className="flex items-center gap-2.5 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
                      <span className="font-black text-[#111B21] w-[56px] font-mono">{a.ts}</span>
                      <span className="text-[#667781]">{a.ev}</span>
                    </div>
                  ))}
                </div>
              </BSection>
              <BSection title="Linked Objects">
                <div className="p-4"><KV rows={[
                  {k:"Booking:", v:"BK-77102"}, {k:"Invoice:", v:"INV-TEPU-22014"},
                  {k:"Txn:",     v:"MPESA-…-1142"}, {k:"Asset:", v:"KLA-BODA-044"},
                ]} /></div>
              </BSection>
            </>)}
            {bladeTab === "Links" && (
              <BSection title="Linked Objects">
                <div className="p-4"><KV rows={[
                  {k:"Booking:", v:"BK-77102"}, {k:"Invoice:", v:"INV-TEPU-22014"},
                  {k:"Txn:",     v:"MPESA-…-1142"}, {k:"Asset:", v:"KLA-BODA-044"},
                ]} /></div>
              </BSection>
            )}
          </div>
        </div>
      )}

      {/* ── Modal: Reconcile Run (HITL) ──────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/35 z-50 grid place-items-center" onClick={() => setModalOpen(false)}>
          <div className="w-[min(900px,calc(100vw-24px))] max-h-[calc(100vh-24px)] bg-white rounded-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-[#075E54] text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="font-black text-[15px]">Modal • Reconcile Run (HITL)</div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-white/15 text-white font-black text-[14px] border-none cursor-pointer grid place-items-center hover:bg-white/25">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5 bg-[#FBFBFB]">

              <MSection title="Purpose">
                <div className="text-[12px] text-[#667781] mb-1">Reconcile usage_events ↔ payments ↔ invoices. High-risk: may change money outcomes.</div>
              </MSection>
              <MSection title="Scope">
                <div className="text-[12px] text-[#111B21] leading-relaxed">
                  • Time window: Last 6 hours (UTC)<br/>• Tenants: TEPU, ACME, KLA (12 total)<br/>• Domains: VEBA, PAY, TOKENS<br/>• Mode: DRY-RUN (no writes)
                </div>
              </MSection>
              <MSection title="Cost Estimate">
                <div className="text-[12px] text-[#111B21] leading-relaxed">
                  • Compute: ~1.2 vCPU-min + 180MB read<br/>• Messaging: 0 (no WhatsApp/SMS in dry-run)<br/>• Expected mismatches: 84 (est)<br/>• Potential recovered value: UGX 2.4M (est)
                </div>
              </MSection>
              <MSection title="Guardrails (Hard Rules)">
                <div className="text-[12px] text-[#111B21] leading-relaxed">
                  • Any APPLY run requires HITL approval + audit hash<br/>• Refunds/credits &gt; threshold require HIC (2-person)<br/>• Cross-tenant writes are blocked by design<br/>• All actions logged (irreversible/irrevocable/irrefutable)
                </div>
              </MSection>
              <MSection title="Approvals">
                <div className="flex flex-col gap-2.5 mb-3">
                  {[
                    {dot:"bg-[#25D366]", k:"System Admin", v:"You (SA)"},
                    {dot:"bg-[#FBBF24]", k:"Finance",      v:"Pending"},
                    {dot:"bg-[#25D366]", k:"Security",     v:"Auto-check: OK"},
                    {dot:"bg-[#FBBF24]", k:"2FA",          v:"Required on APPLY"},
                  ].map(a => (
                    <div key={a.k} className="flex items-center gap-2.5 text-[12px]">
                      <span className={`w-2.5 h-2.5 rounded-full ${a.dot} shrink-0`} />
                      <span className="font-black text-[#111B21] w-[120px]">{a.k}</span>
                      <span className="text-[#667781]">{a.v}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[12px] text-[#128C7E] font-black mb-1">Notes</div>
                <div className="text-[12px] text-[#667781]">Dry-run produces a signed proof report for audit and dispute resolution.</div>
              </MSection>
              <MSection title="Preview (Top mismatches)">
                <table className="w-full text-[12px]">
                  <thead><tr className="border-b border-[#E9EDEF]">
                    {["Event","Type","Reason","Impact"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-black text-[#667781]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {MISMATCHES.map(m => (
                      <tr key={m.ev} className="border-b border-[#E9EDEF] last:border-0">
                        <td className="px-2 py-1.5 text-[#111B21]">{m.ev}</td>
                        <td className="px-2 py-1.5 text-[#667781]">{m.type}</td>
                        <td className="px-2 py-1.5 text-[#667781]">{m.reason}</td>
                        <td className="px-2 py-1.5 font-black text-[#EF4444]">{m.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </MSection>
              <div className="mb-4 border border-[#E9EDEF] rounded-xl overflow-hidden bg-[#EAF7F3]">
                <div className="px-4 py-2.5 bg-[#EAF7F3] border-b border-[#128C7E]/20">
                  <div className="font-black text-[13px] text-[#111B21]">Proof Bundle (Generated)</div>
                </div>
                <div className="p-4 text-[12px] text-[#667781] leading-relaxed">
                  • Signed PDF: reconcile_proof_2026-02-24.pdf<br/>• CSV diff: mismatches_export.csv<br/>• Kafka replay plan: replay_jobs.json<br/>• Hash chain: merkle_root + per-event signature
                </div>
              </div>
              <MSection title="Audit & Non-Repudiation">
                <div className="flex flex-col gap-2 text-[12px]">
                  {[
                    {k:"Irreversible:", v:"Once APPLY is confirmed, entries cannot be edited — only reversed."},
                    {k:"Irrevocable:",  v:"AI cannot bypass a human decision (HITL/HIC enforced)."},
                    {k:"Irrefutable:",  v:"Every action is signed + stored with a verifiable hash chain."},
                  ].map(a => (
                    <div key={a.k} className="flex gap-2">
                      <span className="font-black text-[#111B21] w-[100px] shrink-0">{a.k}</span>
                      <span className="text-[#667781]">{a.v}</span>
                    </div>
                  ))}
                </div>
              </MSection>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E9EDEF] bg-white shrink-0">
              <button onClick={() => setModalOpen(false)} className="h-10 px-5 rounded-lg bg-white border border-[#E9EDEF] text-[13px] font-black text-[#111B21] cursor-pointer">Cancel</button>
              <div className="flex gap-2">
                <button className="h-10 px-5 rounded-lg bg-white border border-[#E9EDEF] text-[13px] font-black text-[#111B21] cursor-pointer">Generate proof</button>
                <button className="h-10 px-5 rounded-lg bg-[#25D366] text-[#075E54] text-[13px] font-black border-none cursor-pointer hover:brightness-105">Start dry-run</button>
              </div>
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
  dark:  "bg-[#075E54] text-white",
  ghost: "bg-white border border-[#E9EDEF] text-[#667781]",
};

function Pill({ color = "ghost", onClick, children }: { color?: string; onClick?: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`h-7 px-3 rounded-full text-[11px] font-black border-none cursor-pointer hover:brightness-105 active:opacity-85 transition-all whitespace-nowrap ${pillStyles[color] ?? pillStyles.ghost}`}>{children}</button>;
}

function KpiCard({ id, title, value, delta, deltaTone, sub, dot, bar }: {
  id: string; title: string; value: string; delta: string; deltaTone: string; sub: string; dot: string; bar?: boolean;
}) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl p-3 relative">
      <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${dot}`} />
      <div className="text-[10px] font-black text-[#667781]">{id}</div>
      <div className="font-black text-[12px] text-[#111B21] mt-0.5">{title}</div>
      <div className="text-[22px] font-black text-[#111B21] mt-1 leading-tight">{value}</div>
      <div className="flex items-center gap-3 mt-1">
        <span className={`text-[11px] font-black ${deltaTone}`}>{delta}</span>
        {bar && <div className="h-1.5 flex-1 rounded-full bg-[#E9EDEF] overflow-hidden"><div className={`h-full rounded-full ${deltaTone.includes("25D366") ? "bg-[#25D366]" : "bg-[#F97316]"}`} style={{width:"40%"}} /></div>}
        <span className="text-[11px] text-[#667781]">{sub}</span>
      </div>
    </div>
  );
}

function BSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 border border-[#E9EDEF] rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E9EDEF]"><div className="font-black text-[12px] text-[#111B21]">{title}</div></div>
      {children}
    </div>
  );
}

function MSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 border border-[#E9EDEF] rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E9EDEF]"><div className="font-black text-[13px] text-[#111B21]">{title}</div></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function KV({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map(r => (
        <div key={r.k} className="flex gap-3 text-[12px]">
          <span className="text-[#667781] w-[80px] shrink-0">{r.k}</span>
          <span className="font-black text-[#111B21]">{r.v}</span>
        </div>
      ))}
    </div>
  );
}