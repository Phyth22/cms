/**
 * ProtocolPage — Screen 13: PROTOCOL PORT — Device Integrations
 *
 * Matches v26 mockups (7 screenshots):
 *   TOP:    Header + 4 KPIs → Protocol Health Matrix (6 rows) → Replay & Backfill Queue (3 rows)
 *   MID:    Decoder & Field Failures (5 bars) → Firmware Compatibility Matrix (4×5 grid)
 *   BOTTOM: Integration Test Suite → 2-col Partner/OEM | ePayment hooks → Metrics & Limits
 *   BLADE:  Protocol Detail (4 tabs: Overview, Fields, Tests, Billing, Audit)
 *   MODAL:  New Protocol Mapping wizard (5 steps)
 */
import React, { useState } from "react";

// ─── Status colors ───────────────────────────────────────────────────────────
const sBadge: Record<string, string> = {
  OK:    "bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30",
  WARN:  "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30",
  ALARM: "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30",
};
const jobBadge: Record<string, string> = {
  Running:"border-[#128C7E] text-[#128C7E]",
  Queued: "border-[#F97316] text-[#F97316]",
  Paused: "border-[#667781] text-[#667781]",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PROTOCOLS = [
  { name:"Teltonika",     ver:"2.8", ingest:"4,820", err:"0.8%",  unk:"0.10%", ack:"99%", status:"OK"    },
  { name:"Concox GT06",   ver:"1.9", ingest:"2,140", err:"1.9%",  unk:"0.55%", ack:"97%", status:"WARN"  },
  { name:"Queclink",      ver:"3.1", ingest:"1,620", err:"0.4%",  unk:"0.08%", ack:"99%", status:"OK"    },
  { name:"Jimi",          ver:"2.2", ingest:"980",   err:"0.9%",  unk:"0.12%", ack:"98%", status:"OK"    },
  { name:"Ruptela",       ver:"1.4", ingest:"640",   err:"3.8%",  unk:"1.22%", ack:"95%", status:"ALARM" },
  { name:"OEM Partner X", ver:"0.9", ingest:"220",   err:"0.2%",  unk:"0.02%", ack:"99%", status:"OK"    },
];

const BACKFILL = [
  { job:"BF-9021", type:"Backfill", topic:"navas.teltonika", eta:"12m", state:"Running" },
  { job:"RP-1140", type:"Replay",   topic:"navas.gt06",      eta:"3m",  state:"Queued"  },
  { job:"BF-8870", type:"Backfill", topic:"navas.queclink",  eta:"—",   state:"Paused"  },
];

const FIELD_FAILURES = [
  { field:"gt06.acc",          pct:62, color:"bg-[#EF4444]" },
  { field:"teltonika.io_239",  pct:48, color:"bg-[#F97316]" },
  { field:"ruptela.temp_2",    pct:39, color:"bg-[#F97316]" },
  { field:"jimi.can_rpm",      pct:27, color:"bg-[#FBBF24]" },
  { field:"unknown.field_91",  pct:18, color:"bg-[#34B7F1]" },
];

const FW_VERSIONS = ["v1.9","v2.1","v2.4","v2.8","v3.1"];
const FW_MATRIX: Record<string, string[]> = {
  Teltonika: ["OK","WARN","OK","ALARM","OK"],
  GT06:      ["OK","OK","WARN","OK","ALARM"],
  Queclink:  ["ALARM","OK","OK","WARN","OK"],
  Jimi:      ["OK","ALARM","OK","OK","WARN"],
};

const PARTNERS = [
  { name:"OEM Partner X", dot:"bg-[#25D366]", badge:"OK"   },
  { name:"OEM Partner Y", dot:"bg-[#F97316]", badge:"WARN" },
  { name:"OEM Partner Z", dot:"bg-[#25D366]", badge:"OK"   },
];

const EPAYMENTS = [
  { name:"M-Pesa callbacks", dot:"bg-[#F97316]", badge:"Queue 21", badgeTone:"border-[#F97316] text-[#F97316]" },
  { name:"MTN MoMo",         dot:"bg-[#25D366]", badge:"OK",       badgeTone:"border-[#25D366] text-[#25D366]" },
  { name:"Airtel Money",     dot:"bg-[#25D366]", badge:"OK",       badgeTone:"border-[#25D366] text-[#25D366]" },
  { name:"Card gateway",     dot:"bg-[#25D366]", badge:"OK",       badgeTone:"border-[#25D366] text-[#25D366]" },
];

const METRICS = [
  { k:"Parser errors",      v:"Warn >0.5% • Alarm >2% • Critical >5%" },
  { k:"Unknown messages",   v:"Alarm if sudden spike >2× baseline" },
  { k:"Decoder latency p95",v:"Warn >200ms • Alarm >500ms • Critical >1s" },
  { k:"Backfill jobs",      v:"Critical if backlog age >24h" },
  { k:"Pricing changes",    v:"Critical if parser deploy bypasses HITL" },
];

const BLADE_AUDIT = [
  { time:"02:11", action:"Parser deployed",    actor:"SYS_ADMIN" },
  { time:"02:12", action:"HITL approval",      actor:"PLATFORM_OWNER" },
  { time:"02:14", action:"Regression tests",   actor:"WASWA_AI" },
  { time:"02:18", action:"Rollback window set",actor:"SRE" },
  { time:"02:25", action:"Evidence pack",       actor:"AUDIT" },
];

const SCHEMA_ROWS = [
  { raw:"io_239",   canonical:"fuel_level",      billing:"Fuel Tokens", mask:"OFF" },
  { raw:"gps_spd",  canonical:"speed",           billing:"GPS Time",    mask:"OFF" },
  { raw:"ai_event", canonical:"driver_fatigue",  billing:"AI Tokens",   mask:"ON"  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export function ProtocolPage() {
  const [bladeOpen, setBladeOpen] = useState(false);
  const [bladeTab, setBladeTab] = useState("Overview");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 p-3">

          {/* Header */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="font-black text-[18px] text-[#111B21] tracking-wide">PROTOCOL PORT</span>
                <span className="text-[13px] text-[#667781]">— Device Integrations</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Pill color="green" onClick={() => setModalOpen(true)}>+ New</Pill>
                <Pill>Import</Pill>
              </div>
            </div>
          </div>

          {/* ════════════════════ TOP SCROLL ════════════════════════════ */}

          {/* 4 KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Active Protocols" value="38"    badge="OK"    />
            <KpiCard label="Parser Err Rate"  value="1.2%"  badge="WARN"  />
            <KpiCard label="Unknown Msgs"     value="0.34%" badge="OK"    />
            <KpiCard label="Decoder p95"      value="240ms" badge="ALARM" />
          </div>

          {/* Protocol Health Matrix */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Protocol Health Matrix</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Throughput • schema drift • parser errors • ACK rate</div>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-[12px] min-w-[800px]">
              <thead><tr className="border-b border-[#E9EDEF] bg-[#F8FAFC]">
                {["Protocol","Ver","Ingest msg/s","Parser Err","Unknown","ACK","Status"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {PROTOCOLS.map(p => (
                  <tr key={p.name} onClick={() => { setBladeOpen(true); setBladeTab("Overview"); }} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC] cursor-pointer">
                    <td className="px-3 py-2.5 font-black text-[#111B21]">{p.name}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{p.ver}</td>
                    <td className="px-3 py-2.5 text-[#111B21]">{p.ingest}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{p.err}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{p.unk}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{p.ack}</td>
                    <td className="px-3 py-2.5"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${sBadge[p.status]}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Replay & Backfill Queue */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF] flex items-center justify-between">
              <div>
                <div className="font-black text-[13px] text-[#111B21]">Replay &amp; Backfill Queue</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Backfill jobs • replay windows • Kafka topic mapping</div>
              </div>
              <Pill>+ New Job</Pill>
            </div>
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-[#E9EDEF]">
                {["Job","Type","Topic","ETA","State"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {BACKFILL.map(b => (
                  <tr key={b.job} className="border-b border-[#E9EDEF] last:border-0">
                    <td className="px-3 py-2.5 font-black text-[#111B21]">{b.job}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{b.type}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{b.topic}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{b.eta}</td>
                    <td className="px-3 py-2.5"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border ${jobBadge[b.state]}`}>{b.state}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ════════════════════ MID SCROLL ════════════════════════════ */}

          {/* Decoder & Field Failures */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
            <div className="font-black text-[13px] text-[#111B21]">Decoder &amp; Field Failures</div>
            <div className="text-[11px] text-[#667781] mt-0.5 mb-3">Top failing fields • schema mismatch • time drift</div>
            <div className="flex flex-col gap-3">
              {FIELD_FAILURES.map(f => (
                <div key={f.field} className="flex items-center gap-3 text-[12px]">
                  <span className="w-[140px] shrink-0 text-[#111B21] font-mono">{f.field}</span>
                  <div className="flex-1 h-5 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div className={`h-full ${f.color} rounded-full`} style={{ width:`${f.pct}%` }} />
                  </div>
                  <span className="w-[40px] text-right font-black text-[#111B21]">{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Firmware Compatibility Matrix */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <div className="font-black text-[13px] text-[#111B21]">Firmware Compatibility Matrix</div>
              <div className="text-[11px] text-[#667781] mt-0.5">Firmware → parser compatibility • rollout risk</div>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-[12px] min-w-[700px]">
              <thead><tr className="border-b border-[#E9EDEF]">
                <th className="text-left px-3 py-2 font-black text-[#667781]" />
                {FW_VERSIONS.map(v => <th key={v} className="text-center px-3 py-2 font-black text-[#667781]">{v}</th>)}
              </tr></thead>
              <tbody>
                {Object.entries(FW_MATRIX).map(([proto, cells]) => (
                  <tr key={proto} className="border-b border-[#E9EDEF] last:border-0">
                    <td className="px-3 py-2.5 font-black text-[#111B21]">{proto}</td>
                    {cells.map((c,i) => (
                      <td key={i} className="px-3 py-2.5 text-center"><span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${sBadge[c]}`}>{c}</span></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* ════════════════════ BOTTOM SCROLL ═════════════════════════ */}

          {/* Integration Test Suite */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
            <div className="font-black text-[13px] text-[#111B21]">Integration Test Suite</div>
            <div className="text-[11px] text-[#667781] mt-0.5 mb-3">Decoder regression • schema contracts • golden packets</div>
            <div className="border border-[#E9EDEF] rounded-lg px-3 py-2.5 flex items-center justify-between text-[12px] mb-2">
              <span className="text-[#111B21]">Last run: 02:14 UTC • 1,248 tests</span>
              <span className="px-2 py-0.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/15 text-[#25D366] text-[10px] font-black">PASS 97%</span>
            </div>
            <div className="border border-[#E9EDEF] rounded-lg px-3 py-2.5 flex items-center justify-between text-[12px]">
              <span className="text-[#667781]">Failing: GT06 checksum edge-case • Ruptela temp_2</span>
              <button className="h-7 px-3 rounded-lg bg-[#25D366] text-[#075E54] text-[11px] font-black border-none cursor-pointer">Run Tests</button>
            </div>
          </div>

          {/* 2-col: Partner/OEM | ePayment hooks */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
              <div className="font-black text-[13px] text-[#111B21]">Partner / OEM Feed Health</div>
              <div className="text-[11px] text-[#667781] mt-0.5 mb-3">OEM webhooks • SLA • throttling</div>
              {PARTNERS.map(p => (
                <div key={p.name} className="flex items-center justify-between mb-2.5 text-[12px]">
                  <span className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${p.dot} shrink-0`} /><span className="text-[#111B21]">{p.name}</span></span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${sBadge[p.badge]}`}>{p.badge}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
              <div className="font-black text-[13px] text-[#111B21]">ePayment + Mobile Money Hooks</div>
              <div className="text-[11px] text-[#667781] mt-0.5 mb-3">Shared callback infra • retries • reconciliation</div>
              {EPAYMENTS.map(e => (
                <div key={e.name} className="flex items-center justify-between mb-2.5 text-[12px]">
                  <span className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${e.dot} shrink-0`} /><span className="text-[#111B21]">{e.name}</span></span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${e.badgeTone}`}>{e.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics & Limits */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
            <div className="font-black text-[13px] text-[#111B21]">Metrics &amp; Limits — What to Watch</div>
            <div className="text-[11px] text-[#667781] mt-0.5 mb-3">Configurable thresholds (Warning/Alarm/Critical) • RBAC gated</div>
            {METRICS.map(m => (
              <div key={m.k} className="flex items-start gap-3 mb-2.5 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#25D366] mt-1 shrink-0" />
                <span className="font-black text-[#111B21] w-[160px] shrink-0">{m.k}</span>
                <span className="text-[#667781]">{m.v}</span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* ── Right: Waswa AI sidebar OR Blade ──────────────────────── */}
      <aside className={`${bladeOpen ? "w-[440px]" : "w-[380px]"} shrink-0 bg-white border-l border-[#E9EDEF] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col`}>
        {bladeOpen ? (
          /* ── Blade: Protocol Detail ──────────────────────────────── */
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9EDEF] shrink-0">
              <div>
                <span className="text-[10px] font-black bg-[#128C7E] text-white px-2 py-0.5 rounded">BLADE</span>
                <span className="font-black text-[14px] text-[#111B21] ml-2">Teltonika v2.8</span>
                <div className="text-[10px] text-[#667781] mt-0.5">Blade: Overview → Billing Hooks → Audit</div>
              </div>
              <button onClick={() => setBladeOpen(false)} className="w-7 h-7 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[#667781] font-black text-[13px] cursor-pointer grid place-items-center">✕</button>
            </div>
            {/* Tabs */}
            <div className="flex gap-1.5 px-4 py-2 border-b border-[#E9EDEF] shrink-0">
              {["Overview","Fields","Tests","Billing","Audit"].map(t => (
                <button key={t} onClick={() => setBladeTab(t)} className={`h-7 px-3 rounded-lg text-[11px] font-black cursor-pointer border ${bladeTab === t ? "bg-[#128C7E]/10 border-[#128C7E]/30 text-[#128C7E]" : "bg-white border-[#E9EDEF] text-[#667781]"}`}>{t}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 py-4">
              {bladeTab === "Overview" && <>
                <BSection title="Registry">
                  <div className="p-4 text-[12px] text-[#111B21] leading-relaxed">
                    <div>Kafka topic: navas.teltonika</div>
                    <div>ACK success: 99% • time drift: 0.4s</div>
                    <div>Decoder p95: 190ms • errors: 0.8%</div>
                  </div>
                </BSection>
                <BSection title="Billing Hooks (Token Engine)">
                  <div className="p-4 text-[12px] text-[#111B21] leading-relaxed">
                    <div>Usage event topic: usage_events</div>
                    <div>Token scope: Type A (Telematics) — ingest/parse</div>
                    <div>FIFO queue: per-asset, auto-rollover</div>
                    <div className="mt-2 bg-[#25D366]/15 border border-[#25D366]/30 rounded-lg px-3 py-2 text-[11px] font-black text-[#128C7E]">Mask UI when out-of-token: ON</div>
                    <div className="mt-1.5 bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-lg px-3 py-2 text-[11px] font-black text-[#F97316]">High-risk: pricing/metering changes require HITL</div>
                  </div>
                </BSection>
                <BSection title="Deploy Parser Update">
                  <div className="p-4 text-[12px] text-[#111B21] leading-relaxed">
                    <div>Change: v2.8 → v2.8.1 (checksum fix)</div>
                    <div>Impact: reduces unknown msg rate (GT06 parity)</div>
                    <div className="mt-2 bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-lg px-3 py-2 text-[11px] font-black text-[#F97316]">HITL Required: Add approval note + reviewer</div>
                    <div className="flex gap-2 mt-2">
                      <button className="h-7 px-4 rounded-lg bg-[#25D366] text-[#075E54] text-[11px] font-black border-none cursor-pointer">Request Approval</button>
                      <Pill>Dry Run</Pill>
                    </div>
                  </div>
                </BSection>
                <BSection title="Audit Trail">
                  <div className="p-4">
                    {BLADE_AUDIT.map((a,i) => (
                      <div key={i} className="flex items-center justify-between mb-2 text-[12px]">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[#667781] w-[36px]">{a.time}</span>
                          <span className="font-black text-[#111B21]">{a.action}</span>
                        </span>
                        <span className="text-[#667781]">{a.actor}</span>
                      </div>
                    ))}
                  </div>
                </BSection>
              </>}
              {bladeTab === "Billing" && <>
                <BSection title="Registry">
                  <div className="p-4 text-[12px] text-[#111B21] leading-relaxed">
                    <div>Kafka topic: navas.teltonika</div>
                    <div>ACK success: 99% • time drift: 0.4s</div>
                    <div>Decoder p95: 190ms • errors: 0.8%</div>
                  </div>
                </BSection>
                <BSection title="Billing Hooks (Token Engine)">
                  <div className="p-4 text-[12px] text-[#111B21] leading-relaxed">
                    <div>Usage event topic: usage_events</div>
                    <div>Token scope: Type A (Telematics) — ingest/parse</div>
                    <div>FIFO queue: per-asset, auto-rollover</div>
                    <div className="mt-2 bg-[#25D366]/15 border border-[#25D366]/30 rounded-lg px-3 py-2 text-[11px] font-black text-[#128C7E]">Mask UI when out-of-token: ON</div>
                    <div className="mt-1.5 bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-lg px-3 py-2 text-[11px] font-black text-[#F97316]">High-risk: pricing/metering changes require HITL</div>
                  </div>
                </BSection>
              </>}
              {(bladeTab === "Fields" || bladeTab === "Tests" || bladeTab === "Audit") && (
                <div className="text-[12px] text-[#667781] p-4 text-center border border-[#E9EDEF] rounded-xl">{bladeTab} detail view — parser fields, regression tests, or full audit chain</div>
              )}
            </div>
          </>
        ) : (
          /* ── Waswa AI Co-Pilot sidebar ───────────────────────────── */
          <div className="p-4 flex flex-col gap-3">
            <div className="border border-[#E9EDEF] rounded-xl p-4">
              <div className="font-black text-[13px] text-[#111B21]">Waswa AI Co-Pilot</div>
              <div className="text-[11px] text-[#667781] mt-0.5">HIC: suggestions need approval</div>
              <div className="mt-3 bg-[#128C7E]/10 border border-[#128C7E]/20 rounded-xl p-3">
                <div className="font-black text-[12px] text-[#128C7E] mb-1">Insight</div>
                <div className="text-[11px] text-[#111B21] leading-relaxed">
                  Schema drift spike detected in GT06 (KE) — unknown.field_91 …<br/>
                  Suggested action: enable safe-mode masking + ship parser ho…<br/>
                  Revenue risk: token leakage if metering gaps persist.
                </div>
              </div>
            </div>

            <div className="font-black text-[13px] text-[#111B21]">Recommended Actions</div>
            <button className="w-full h-9 rounded-lg bg-[#25D366] text-[#075E54] text-[12px] font-black border-none cursor-pointer">Approve Hotfix (HITL)</button>
            <div className="font-black text-[12px] text-[#111B21] px-1">Open Evidence Pack</div>
            <button className="w-full h-9 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-[12px] font-black cursor-pointer">Kill-Switch (HIC)</button>

            <div className="font-black text-[13px] text-[#111B21] mt-1">Quick Links</div>
            <div className="border border-[#128C7E]/20 rounded-lg px-3 py-2.5 text-[12px] font-black text-[#128C7E] cursor-pointer hover:bg-[#128C7E]/5">Token Top-Up (MoMo / Card)</div>
            <div className="border border-[#128C7E]/20 rounded-lg px-3 py-2.5 text-[12px] font-black text-[#128C7E] cursor-pointer hover:bg-[#128C7E]/5">VEBA Leakage Monitor</div>

            <input placeholder="Ask Waswa... (e.g., 'why decoder p95 spiked?')" className="w-full h-8 rounded-lg border border-[#E9EDEF] px-3 text-[11px] text-[#111B21] placeholder:text-[#667781] outline-none mt-auto" />
          </div>
        )}
      </aside>

      {/* ── Modal: New Protocol Mapping ───────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/35 z-50 grid place-items-center" onClick={() => setModalOpen(false)}>
          <div className="w-[min(760px,calc(100vw-24px))] max-h-[calc(100vh-24px)] bg-white rounded-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#E9EDEF] flex items-center justify-between shrink-0">
              <div>
                <div className="font-black text-[16px] text-[#111B21]">New Protocol Mapping</div>
                <div className="text-[11px] text-[#667781] mt-0.5">Wizard • create / test / deploy • audit-linked</div>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[#667781] font-black text-[14px] cursor-pointer grid place-items-center">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5">

              {/* Wizard steps */}
              <div className="flex gap-2 mb-5">
                {["1  Metadata","2  Schema","3  Metering","4  Test","5  Deploy"].map((s,i) => (
                  <span key={s} className={`flex-1 h-9 rounded-lg text-[12px] font-black flex items-center justify-center border cursor-pointer ${i === 2 ? "bg-[#128C7E]/10 border-[#128C7E]/30 text-[#128C7E]" : "bg-white border-[#E9EDEF] text-[#667781]"}`}>{s}</span>
                ))}
              </div>

              {/* Protocol Identity */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Protocol Identity</div>
              <div className="border border-[#E9EDEF] rounded-xl p-4 mb-4 text-[12px] text-[#667781] leading-relaxed">
                Name: ________&ensp; Version: ____&ensp; Vendor: ________<br/>
                Kafka topic: navas.________&ensp; Port: ____&ensp; Transport: TCP/UDP<br/>
                ACK/Handshake: Enabled&ensp; Time sync: Enabled
              </div>

              {/* Schema Mapping */}
              <div className="text-[12px] font-black text-[#667781] mb-2">Schema Mapping</div>
              <div className="text-[11px] text-[#667781] mb-2">Map raw fields → canonical params (lat, lon, speed, ign, fuel, …)</div>
              <div className="border border-[#E9EDEF] rounded-xl overflow-hidden mb-4">
                <table className="w-full text-[12px]">
                  <thead><tr className="border-b border-[#E9EDEF] bg-[#F8FAFC]">
                    {["Raw","Canonical","Billing","Mask"].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {SCHEMA_ROWS.map(r => (
                      <tr key={r.raw} className="border-b border-[#E9EDEF] last:border-0">
                        <td className="px-3 py-2 font-mono font-black text-[#111B21]">{r.raw}</td>
                        <td className="px-3 py-2 text-[#667781]">{r.canonical}</td>
                        <td className="px-3 py-2 text-[#667781]">{r.billing}</td>
                        <td className="px-3 py-2 text-[#667781]">{r.mask}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Metering (US-03) */}
              <div className="bg-[#128C7E]/10 border border-[#128C7E]/20 rounded-xl p-4 mb-4">
                <div className="font-black text-[12px] text-[#128C7E] mb-1">Metering (US-03)</div>
                <div className="text-[12px] text-[#111B21] leading-relaxed">
                  <strong>Emit usage_events for every billable ingest / parameter / AI inference</strong><br/>
                  Token scope: Type A + VEBA (optional) • FIFO per asset
                </div>
                <div className="border border-[#E9EDEF] rounded-lg px-3 py-2 mt-2 text-[12px] text-[#111B21] bg-white">
                  <strong>Out-of-token behavior: Store raw, mask UI (upsell safe)</strong>
                </div>
              </div>

              {/* High-risk deploy warning */}
              <div className="bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-xl p-4">
                <div className="font-black text-[12px] text-[#EF4444]">High-risk deploy requires HITL approval + audit chain (irrefutable)</div>
                <div className="text-[11px] text-[#667781] mt-1">Applies to: pricing changes, refunds, suspensions, kill-switch</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-[#E9EDEF] bg-white shrink-0">
              <button onClick={() => setModalOpen(false)} className="h-10 px-6 rounded-lg bg-white border border-[#E9EDEF] text-[13px] font-black text-[#111B21] cursor-pointer">Cancel</button>
              <button onClick={() => setModalOpen(false)} className="h-10 px-6 rounded-lg bg-[#25D366] text-[#075E54] text-[13px] font-black border-none cursor-pointer hover:brightness-105">Save &amp; Continue</button>
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

function KpiCard({ label, value, badge }: { label: string; value: string; badge: string }) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl p-3 relative">
      <span className={`absolute top-3 right-3 px-1.5 py-0.5 rounded-full text-[9px] font-black ${sBadge[badge]}`}>{badge}</span>
      <div className="text-[11px] text-[#667781]">{label}</div>
      <div className="text-[22px] font-black text-[#111B21] mt-1 leading-tight">{value}</div>
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
