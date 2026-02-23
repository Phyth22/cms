/**
 * Dashboard — Main Workspace
 *
 * Composes the two content blades:
 *   • System Health God View (left, primary blade)
 *   • Waswa AI Co-Pilot        (right, AI blade)
 *
 * It owns only the state and data that belong to the workspace itself —
 * the Task Manager open/close toggle and the HITL action list.
 */

import React, { useMemo, useState } from "react";
import type { HitlAction } from "../types";import { Kpi, Card, Bar, MiniGateway, MiniStat } from "../primitives";
import { TaskManagerModal } from "../TaskManagerModal";

const DEFAULT_HITL: HitlAction[] = [
  {
    id: "a1",
    sev: "alarm",
    title: "Scale Kafka consumer group +1",
    reason: "Lag 4.8s trending up • risk: ingest delay + token burn drift",
    primaryCta: "Approve",
    secondaryCta: "Review",
  },
  {
    id: "a2",
    sev: "warning",
    title: "Set token burn soft-cap (80%)",
    reason: "Tenant: OLIWA_CORP_UG • run-out <72h",
    primaryCta: "Approve",
    secondaryCta: "Edit",
  },
  {
    id: "a3",
    sev: "alarm",
    title: "Gate VEBA contact unlock",
    reason: "Leakage attempts 17 today (KLA_BODA_POOL)",
    primaryCta: "Approve",
    secondaryCta: "Simulate",
  },
  {
    id: "a4",
    sev: "critical",
    title: "Suspend webhook retries (Airtel UG)",
    reason: "Fail 6.7% • risk: paid-not-credited disputes",
    primaryCta: "HIC",
    secondaryCta: "Runbook",
  },
];

export function Dashboard() {
  const [showTaskManager, setShowTaskManager] = useState(false);
  const hitl = useMemo(() => DEFAULT_HITL, []);

  return (
    <>
      <main className="workspace">
        {/* ── Left blade: System Health ───────────────────────────────── */}
        <section className="blade">
          <div className="bladeHeader">
            <div className="bladeTitle">System Health — God View</div>
            <div className="bladeMeta">refresh 30s</div>
          </div>

          <div className="bladeContent">
            {/* KPI grid */}
            <div className="grid2">
              <Kpi title="Uptime (30d)"       value="99.82%"    sub="p95 API 320ms • 5xx 0.7%"          sev="green"   />
              <Kpi title="Ingest p95"          value="22s"       sub="Drop est 0.04% • dup 0.21%"         sev="warning" />
              <Kpi title="Kafka lag"           value="4.8s"      sub="URP 0 • brokers disk 61%"           sev="green"   />
              <Kpi title="Token Burn (ops)"    value="1.7 Tok/s" sub="Retry storms +0.3 Tok/s"            sev="alarm"   />
            </div>

            {/* Compute resource bars */}
            <Card title="Compute & System Resource Usage" subtitle="Percentages (cluster)">
              <Bar label="CPU"       pct={0.63} meta="63% (🟡>70 🟠>85 🔴>95)"        />
              <Bar label="RAM Free"  pct={0.18} meta="18% (🟡<20 🟠<10 🔴<5)"   warn  />
              <Bar label="Disk Free" pct={0.24} meta="24% (🟡<20 🟠<10 🔴<5)"         />
              <Bar label="Net Errors" pct={0.07} meta="0.7% (🟡>1 🟠>3 🔴>5)"         />
              <div className="cardRow">
                <button className="btn azure" onClick={() => setShowTaskManager(true)}>
                  Open Task Manager
                </button>
              </div>
            </Card>

            {/* Payment gateways */}
            <Card title="Payments & Mobile Money Gateways" subtitle="Real-time status • webhook backlog">
              <div className="grid2 compact">
                <MiniGateway name="M-Pesa KE"   status="OK"       meta="success 98.9% • p95 9.2s"            sev="green" />
                <MiniGateway name="MTN MoMo UG" status="OK"       meta="success 97.6% • p95 11.4s"           sev="green" />
                <MiniGateway name="Airtel UG"   status="DEGRADED" meta="success 91.2% • webhook fail 6.7%"   sev="alarm" />
                <MiniGateway name="Airtel KE"   status="OK"       meta="success 96.8% • settle delay 18m"    sev="green" />
              </div>
              <div className="cardRow">
                <button className="btn azure">View retries</button>
                <button className="btn green">+ New webhook rule</button>
                <button className="btn azure">Export recon</button>
              </div>
            </Card>

            {/* VEBA governance */}
            <Card title="VEBA Governance • Leakage Prevention" subtitle="Listings + tendering + escrow">
              <div className="grid4">
                <MiniStat label="Bookings today"    value="184"       />
                <MiniStat label="Leakage attempts"  value="17"        />
                <MiniStat label="Escrow balance"    value="UGX 42.8M" />
                <MiniStat label="Settlement p95"    value="18m"       />
              </div>

              <div className="table">
                <div className="thead">
                  <div>Flag</div>
                  <div>Entity</div>
                  <div>Signal</div>
                  <div>Suggested action</div>
                  <div>⋮</div>
                </div>
                {[
                  { flag: "🔴", entity: "KLA_BODA_POOL", signal: "Leakage ×17",     action: "Gate contact unlock" },
                  { flag: "🟠", entity: "OLIWA_CORP_UG",  signal: "Escrow ∆ 3.1M",  action: "Notify + escrow hold" },
                  { flag: "🟡", entity: "PIKI_KLA_POOL",  signal: "Settle delay 22m", action: "Retry STK push" },
                ].map((r) => (
                  <div key={r.entity} className="trow">
                    <div>{r.flag}</div>
                    <div>{r.entity}</div>
                    <div>{r.signal}</div>
                    <div>{r.action}</div>
                    <div>⋯</div>
                  </div>
                ))}
              </div>

              <div className="cardRow">
                <button className="btn azure">View all flags</button>
                <button className="btn green">+ New leakage rule</button>
              </div>
            </Card>
          </div>
        </section>

        {/* ── Right blade: Waswa AI ───────────────────────────────────── */}
        <section className="blade aiBlade">
          <div className="bladeHeader greenAccent">
            <div className="bladeTitle">Waswa AI — Primary Driver</div>
            <div className="bladeMeta">HITL enforced</div>
          </div>

          <div className="bladeContent">
            {/* AI status card */}
            <Card title="Waswa AI • Ops Co‑Pilot" subtitle="Proactive insights (Revenue + Health + Billing)">
              <div className="pillRow">
                <span className="pill green">ON</span>
                <span className="hint">
                  System Health 99.82% • leakage risk (VEBA) • suggest 5k mint
                </span>
              </div>
              <div className="cardRow">
                <button className="btn azure">Open HITL Queue</button>
                <button className="btn teal">Ask why?</button>
                <button className="btn ghost">Mute (1h)</button>
              </div>
            </Card>

            {/* HITL pending actions */}
            <Card title="HITL / HIC Pending Actions" subtitle="High-risk actions require approval + audit">
              <div className="hitl">
                {hitl.map((a) => (
                  <div key={a.id} className="hitlRow">
                    <div className={`sev ${a.sev}`} title={a.sev} />
                    <div className="hitlText">
                      <div className="hitlTitle">{a.title}</div>
                      <div className="hitlReason">{a.reason}</div>
                    </div>
                    <div className="hitlActions">
                      <button className={`btn ${a.primaryCta === "HIC" ? "red" : "green"}`}>
                        {a.primaryCta}
                      </button>
                      <button className="btn azure">{a.secondaryCta}</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chat */}
            <Card title="Ask Waswa (chat)" subtitle="Natural language ops • cost-aware answers (tokenized)">
              <div className="chat">
                <div className="bubble mine">Why is token burn up today?</div>
                <div className="bubble">
                  Root cause: 1) Airtel UG retries (+0.18 Tok/s), 2) SSE clients surge (+0.11 Tok/s),
                  3) Kafka replays (+0.06 Tok/s). Recommend: backoff + per-tenant caps.
                </div>
                <div className="bubble mine">Create an 80% burn alert + WhatsApp notify.</div>
                <div className="bubble">
                  Draft created (HITL). Impact: +0.02 Tok/s for notifications. Approve to activate for
                  OLIWA_CORP_UG, PIKI_KLA_POOL.
                </div>
              </div>
              <div className="chatInput">
                <input placeholder="Tell Waswa to…" />
                <button className="send">➤</button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {showTaskManager && (
        <TaskManagerModal onClose={() => setShowTaskManager(false)} />
      )}
    </>
  );
}
