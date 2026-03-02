/**
 * MoneyPage — Screen 11: THE MONEY SWITCHBOARD
 *
 * Matches v26 mockups (9 screenshots):
 *   TOP:     Header + 4 KPIs → 2-col (Gateway Health | Token+VEBA Flow + Waswa AI)
 *   MID:     Filters → Transactions table (11 rows with State/Tokens/Webhook/Risk badges)
 *   BOTTOM:  VEBA Escrow & Settlement (4 KPIs + 2-row table) → Approvals Queue (HITL/HIC)
 *   BLADE:   Tx Detail PMT-10492 (Summary, Pipeline Trace, Actions, Audit, Recent Events)
 *   MODAL:   HITL Approval Request (Action Type, Amounts, Approvers, Guardrails, Checklist, Risk)
 */
import React, { useState } from "react";

// ─── Status badge colors ─────────────────────────────────────────────────────
const txStateColor: Record<string, string> = {
  PENDING:   "bg-[#F97316] text-white",
  FAILED:    "bg-[#EF4444] text-white",
  SUCCESS:   "bg-[#25D366] text-white",
  REVERSED:  "bg-[#F97316] text-white",
  CHARGEBACK:"bg-[#FBBF24] text-[#92400E]",
  PAYOUT:    "bg-[#FBBF24] text-[#92400E]",
};
const whColor: Record<string, string> = { OK: "bg-[#25D366] text-white", FAIL: "bg-[#EF4444] text-white" };
const riskColor = (r: number) => r >= 0.5 ? "bg-[#EF4444] text-white" : r >= 0.2 ? "bg-[#FBBF24] text-[#92400E]" : "bg-[#25D366] text-white";
const gwDot: Record<string, string> = { ok: "bg-[#25D366]", warn: "bg-[#FBBF24]", crit: "bg-[#EF4444]" };

// ─── Mock Data ───────────────────────────────────────────────────────────────
const GATEWAYS = [
  { provider:"M-Pesa",              region:"KE",    sr:91.2, p95:"1.8s", wh:"7%",   dot:"warn" },
  { provider:"MTN MoMo",            region:"UG",    sr:97.9, p95:"1.1s", wh:"1%",   dot:"ok"   },
  { provider:"Airtel Money",        region:"UG",    sr:94.1, p95:"2.6s", wh:"5%",   dot:"warn" },
  { provider:"Airtel Money",        region:"KE",    sr:72.4, p95:"6.3s", wh:"18%",  dot:"crit" },
  { provider:"Cards (DPO/Pesapal)", region:"KE/UG", sr:98.5, p95:"1.5s", wh:"0.4%", dot:"ok"   },
  { provider:"Flutterwave",         region:"Multi", sr:96.9, p95:"1.9s", wh:"2%",   dot:"ok"   },
];

const PIPELINE = [
  { step:"1. Pay-In Initiated",   val:"31 pending", dot:"bg-[#FBBF24]" },
  { step:"2. Webhook Confirm",    val:"19 failed",  dot:"bg-[#F97316]" },
  { step:"3. Token Mint",         val:"14 queued",  dot:"bg-[#F97316]" },
  { step:"4. FIFO Allocate",      val:"OK",         dot:"bg-[#25D366]" },
  { step:"5. VEBA Escrow Lock",   val:"OK",         dot:"bg-[#25D366]" },
  { step:"6. Payout/Settlement",  val:"—",          dot:"bg-[#F97316]" },
];

const TXS = [
  { id:"PMT-10492", tenant:"3D-TOP",       ch:"M-Pesa", amt:"2,500,000", cur:"UGX", state:"PENDING",   tokens:",000",  wh:"OK",   risk:0.22, dot:"warn" },
  { id:"PMT-10491", tenant:"KE-Dealer-07", ch:"Airtel", amt:"75,000",    cur:"KES", state:"FAILED",    tokens:"—",     wh:"FAIL", risk:0.71, dot:"crit" },
  { id:"PMT-10490", tenant:"UG-Client-12", ch:"MTN",    amt:"180,000",   cur:"UGX", state:"SUCCESS",   tokens:",000",  wh:"OK",   risk:0.13, dot:"ok"   },
  { id:"PMT-10489", tenant:"KE-Client-02", ch:"Card",   amt:"199.00",    cur:"USD", state:"SUCCESS",   tokens:",500",  wh:"OK",   risk:0.08, dot:"ok"   },
  { id:"PMT-10488", tenant:"VEBA-OPS",     ch:"M-Pesa", amt:"45,000",    cur:"KES", state:"REVERSED",  tokens:"—",     wh:"OK",   risk:0.35, dot:"warn" },
  { id:"PMT-10487", tenant:"UG-Client-19", ch:"Airtel", amt:"320,000",   cur:"UGX", state:"SUCCESS",   tokens:",000",  wh:"OK",   risk:0.19, dot:"ok"   },
  { id:"PMT-10486", tenant:"KE-Dealer-03", ch:"Card",   amt:"1,250.00",  cur:"USD", state:"CHARGEBACK",tokens:"—",     wh:"OK",   risk:0.88, dot:"crit" },
  { id:"PMT-10485", tenant:"UG-Client-05", ch:"MTN",    amt:"50,000",    cur:"UGX", state:"SUCCESS",   tokens:",00",   wh:"OK",   risk:0.09, dot:"ok"   },
  { id:"PMT-10484", tenant:"VEBA-OPS",     ch:"M-Pesa", amt:"320,000",   cur:"KES", state:"PAYOUT",    tokens:"–",     wh:"OK",   risk:0.15, dot:"ok"   },
  { id:"PMT-10483", tenant:"UG-Dealer-01", ch:"MTN",    amt:"1,100,000", cur:"UGX", state:"SUCCESS",   tokens:",000",  wh:"OK",   risk:0.11, dot:"ok"   },
  { id:"PMT-10482", tenant:"KE-Client-11", ch:"Airtel", amt:"12,000",    cur:"KES", state:"FAILED",    tokens:"—",     wh:"FAIL", risk:0.62, dot:"crit" },
];

const ESCROW_BOOKINGS = [
  { bkg:"BKG-7781", asset:"D6 Dozer", stage:"Awaiting payout", stageTone:"bg-[#25D366] text-white", escrow:"KES 320,000", action:"Approve payout (HITL)", actionColor:"text-[#128C7E]" },
  { bkg:"BKG-7774", asset:"Boda",     stage:"Dispute opened",  stageTone:"bg-[#EF4444] text-white", escrow:"UGX 180,000", action:"Open case",             actionColor:"text-[#128C7E]" },
];

const APPROVALS = [
  { dot:"bg-[#FBBF24]", title:"Refund > KES 75,000",  sub:"PMT-10491 • Reason: callback failed after debit", badge:"HITL", badgeTone:"bg-[#128C7E] text-white" },
  { dot:"bg-[#EF4444]", title:"Manual Token Mint",     sub:"PMT-10492 • Mint 125,000 TOK to keep service live", badge:"HIC",  badgeTone:"bg-[#EF4444] text-white" },
  { dot:"bg-[#FBBF24]", title:"Escrow Release",        sub:"BKG-7781 • Approve payout to owner (instant settlement, chained).", badge:"HITL", badgeTone:"bg-[#128C7E] text-white" },
];

const BLADE_TRACE = [
  { step:"Pay-In initiated",  badge:"OK",      badgeTone:"bg-[#25D366] text-white", dot:"bg-[#25D366]" },
  { step:"Webhook received",  badge:"OK",      badgeTone:"bg-[#25D366] text-white", dot:"bg-[#25D366]" },
  { step:"Mint tokens",       badge:"WAIT",    badgeTone:"bg-[#FBBF24] text-[#92400E]", dot:"bg-[#F97316]" },
  { step:"FIFO allocate",     badge:"BLOCKED", badgeTone:"bg-[#EF4444] text-white", dot:"bg-[#25D366]" },
  { step:"Post to Odoo",      badge:"WAIT",    badgeTone:"bg-[#FBBF24] text-[#92400E]", dot:"bg-[#F97316]" },
];

const BLADE_EVENTS = [
  "10:21:08 webhook_confirmed (momo_callback_ok)",
  "10:21:10 mint_enqueue (usage_event_id ue_9a21)",
  "10:21:14 fifo_blocked (balance low? none)",
  "10:21:15 ai_hint (suggest top-up bundle)",
  "10:21:22 approval_required (manual mint)",
];

// ─── Page ────────────────────────────────────────────────────────────────────
export function MoneyPage() {
  const [bladeOpen, setBladeOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 p-3">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl px-4 py-3">
            <div className="text-[11px] text-[#667781] mb-0.5">SCREEN 11&ensp;Tokenomics &amp; Revenue &gt; Payments &amp; Mobile Money Gateways</div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[16px] text-[#111B21]">The Money Switchboard</span>
                  <span className="text-[10px] font-black bg-[#128C7E] text-white px-2 py-0.5 rounded-full">HITL/HIC</span>
                </div>
                <div className="text-[11px] text-[#667781] mt-0.5">Unified: Mobile Money + Cards + Tokens + VEBA Escrow + ERP + Waswa AI</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Pill>+ New Gateway</Pill>
                <Pill color="green">Run Payout</Pill>
                <Pill>Export</Pill>
              </div>
            </div>
          </div>

          {/* ════════════════════ TOP SCROLL ════════════════════════════ */}

          {/* 4 KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Tx success rate"    value="96.8%" sub="⚠ M-Pesa KE 91.2% (drop)" dot="bg-[#25D366]" />
            <KpiCard label="Webhook backlog"    value="248"   sub="⚠ retries queued (p95 4m)" dot="bg-[#F97316]" />
            <KpiCard label="Settlement delay p95" value="2h 14m" sub="⚠ >1h threshold (VEBA)" dot="bg-[#EF4444]" />
            <KpiCard label="Recon mismatch"     value="0.72%" sub="⚠ >0.5% value (MTD)"       dot="bg-[#EF4444]" />
          </div>

          {/* 2-col: Gateway Health | Token+VEBA Flow */}
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 items-start">
            {/* Gateway Health */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E9EDEF]">
                <div className="font-black text-[13px] text-[#111B21]">Gateway Health</div>
                <div className="text-[11px] text-[#667781]">Mobile Money + Cards + Aggregators (real-time)</div>
              </div>
              <table className="w-full text-[12px]">
                <thead><tr className="border-b border-[#E9EDEF]">
                  {["Provider","Region","SR%","p95","Webhook"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {GATEWAYS.map((g,i) => (
                    <tr key={i} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC] cursor-pointer">
                      <td className="px-3 py-2.5 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${gwDot[g.dot]} shrink-0`} />
                        <span className="text-[#111B21]">{g.provider}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[#667781]">{g.region}</td>
                      <td className="px-3 py-2.5 text-[#111B21]">{g.sr}</td>
                      <td className="px-3 py-2.5 text-[#667781]">{g.p95}</td>
                      <td className="px-3 py-2.5 text-[#667781]">{g.wh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-3 py-2 text-[10px] text-[#667781] italic border-t border-[#E9EDEF]">Tip: Click a provider row to open Azure blade → configs, webhooks, SLA feed.</div>
            </div>

            {/* Token + VEBA Escrow Flow */}
            <div className="flex flex-col gap-3">
              <div className="bg-white border border-[#E9EDEF] rounded-xl p-4">
                <div className="font-black text-[13px] text-[#111B21]">Token + VEBA Escrow Flow</div>
                <div className="text-[11px] text-[#667781] mb-3">Pay-in → Webhook → Mint → FIFO → Escrow → Settlement → ERP</div>
                {PIPELINE.map(p => (
                  <div key={p.step} className="flex items-center justify-between mb-2.5 text-[12px]">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${p.dot} shrink-0`} />
                      <span className="text-[#111B21]">{p.step}</span>
                    </span>
                    <span className="text-[#667781] font-mono text-[11px]">{p.val}</span>
                  </div>
                ))}
              </div>

              {/* Waswa AI Payment Co-Pilot */}
              <div className="bg-[#128C7E] text-white rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-[13px]">Waswa AI • Payment Co-Pilot</span>
                  <span className="text-[10px] font-black bg-[#25D366] text-[#075E54] px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <div className="text-[11px] leading-relaxed opacity-90 mb-3">
                  <div className="flex items-start gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#EF4444] mt-1 shrink-0" /><span>Airtel KE outage likely — failover to M-Pesa suggested</span></div>
                  <div className="flex items-start gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#F97316] mt-1 shrink-0" /><span>19 webhook fails → safe retry plan prepared (max 5)</span></div>
                  <div className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-[#FBBF24] mt-1 shrink-0" /><span>Leakage risk: 23 hirers attempted contact share pre…</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="h-7 px-3 rounded-full bg-[#25D366] text-[#075E54] text-[11px] font-black border-none cursor-pointer">Open approvals</button>
                  <button className="h-7 px-3 rounded-full bg-white/15 text-white text-[11px] font-black border-none cursor-pointer">Run safe retry</button>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════ MID SCROLL ════════════════════════════ */}

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {["Provider: All ▾","Channel: MoMo/Card ▾","Status: Any ▾"].map(f => (
              <span key={f} className="h-8 px-3 rounded-lg bg-white border border-[#E9EDEF] text-[12px] text-[#111B21] flex items-center">{f}</span>
            ))}
            <span className="h-8 px-3 rounded-lg bg-white border border-[#E9EDEF] text-[12px] text-[#667781] flex items-center">Currency</span>
            <span className="h-8 px-3 rounded-lg bg-white border border-[#E9EDEF] text-[12px] text-[#667781] flex items-center">Search tx/boo…</span>
            <span className="ml-auto text-[11px] font-black text-[#111B21] bg-white border border-[#E9EDEF] rounded-lg h-8 px-3 flex items-center">USD/UGX</span>
          </div>

          {/* Transactions table */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <span className="font-black text-[13px] text-[#111B21]">Transactions</span>
              <span className="text-[11px] text-[#667781] ml-3">Payments ↔ Token Mint ↔ VEBA Escrow</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-[12px] min-w-[1100px]">
              <thead><tr className="border-b border-[#E9EDEF] bg-[#F8FAFC]">
                {["Tx ID","Tenant","Channel","Amount","Cur","State","Tokens","Webhook","Risk"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-black text-[#667781] whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {TXS.map(tx => (
                  <tr key={tx.id} onClick={() => setBladeOpen(true)} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC] cursor-pointer">
                    <td className="px-3 py-2.5 whitespace-nowrap"><span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${gwDot[tx.dot]} shrink-0`} /><span className="font-black text-[#111B21]">{tx.id}</span></span></td>
                    <td className="px-3 py-2.5 text-[#111B21]">{tx.tenant}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{tx.ch}</td>
                    <td className="px-3 py-2.5 font-black text-[#111B21] text-right">{tx.amt}</td>
                    <td className="px-3 py-2.5 text-[#667781]">{tx.cur}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><span className="flex items-center gap-1.5"><span className="text-[#111B21]">{tx.state}</span><span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${txStateColor[tx.state] ?? "bg-[#E9EDEF] text-[#667781]"}`}>{tx.state}</span></span></td>
                    <td className="px-3 py-2.5 text-[#667781] font-mono">{tx.tokens}</td>
                    <td className="px-3 py-2.5"><span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${whColor[tx.wh] ?? "bg-[#E9EDEF] text-[#667781]"}`}>{tx.wh}</span></td>
                    <td className="px-3 py-2.5"><span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${riskColor(tx.risk)}`}>{tx.risk.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="px-3 py-2 text-[10px] text-[#667781] italic border-t border-[#E9EDEF]">Row action: click Tx ID → blade. High-risk actions require HITL/HIC approval.</div>
          </div>

          {/* ════════════════════ BOTTOM SCROLL ═════════════════════════ */}

          {/* VEBA Escrow & Settlement */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF]">
              <span className="font-black text-[13px] text-[#111B21]">VEBA Escrow &amp; Settlement</span>
              <span className="text-[11px] text-[#667781] ml-3">Bookings ↔ disputes ↔ payouts (instant trust)</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { dot:"bg-[#25D366]", k:"Escrow balance",     v:"KES 12.4M", sub:"Locked funds" },
                  { dot:"bg-[#F97316]", k:"Settlements pending",v:"22",        sub:"p95 2h 14m" },
                  { dot:"bg-[#FBBF24]", k:"Disputes aging",     v:"7",         sub:">7d needs review" },
                  { dot:"bg-[#25D366]", k:"Leakage prevented",  v:"143",       sub:"+9% WoW" },
                ].map(s => (
                  <div key={s.k} className="border border-[#E9EDEF] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#667781] mb-1"><span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.k}</div>
                    <div className="font-black text-[18px] text-[#111B21] leading-tight">{s.v}</div>
                    <div className="text-[10px] text-[#667781] mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>
              <table className="w-full text-[12px]">
                <thead><tr className="border-b border-[#E9EDEF]">
                  {["Booking","Asset","Stage","Escrow","Action"].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-black text-[#667781]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ESCROW_BOOKINGS.map(b => (
                    <tr key={b.bkg} className="border-b border-[#E9EDEF] last:border-0">
                      <td className="px-3 py-2.5 font-black text-[#111B21]">{b.bkg}</td>
                      <td className="px-3 py-2.5 text-[#111B21]">{b.asset}</td>
                      <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${b.stageTone}`}>{b.stage}</span></td>
                      <td className="px-3 py-2.5 text-[#111B21]">{b.escrow}</td>
                      <td className={`px-3 py-2.5 font-black ${b.actionColor} cursor-pointer`}>{b.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approvals Queue */}
          <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E9EDEF] flex items-center gap-3">
              <span className="font-black text-[13px] text-[#111B21]">Approvals Queue (HITL/HIC)</span>
              <span className="text-[11px] text-[#667781]">High-risk actions are never auto-executed</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {APPROVALS.map((a,i) => (
                <div key={i} className="flex items-center justify-between border border-[#E9EDEF] rounded-xl p-3">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${a.dot} mt-0.5 shrink-0`} />
                    <div>
                      <div className="font-black text-[13px] text-[#111B21]">{a.title}</div>
                      <div className="text-[11px] text-[#667781] mt-0.5">{a.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${a.badgeTone}`}>{a.badge}</span>
                    <Pill>View</Pill>
                    <Pill color="green" onClick={() => setModalOpen(true)}>Act</Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ── Blade: Tx Detail ─────────────────────────────────────── */}
      {bladeOpen && (
        <div className="w-[420px] shrink-0 bg-white border-l border-[#E9EDEF] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9EDEF] shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-[14px] text-[#111B21]">Tx Detail • PMT-10492</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-black">PENDING</span>
            </div>
            <button onClick={() => setBladeOpen(false)} className="w-7 h-7 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[#667781] font-black text-[13px] cursor-pointer grid place-items-center hover:bg-[#E9EDEF]">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 py-4">

            <BSection title="Summary">
              <div className="p-4"><KV rows={[
                {k:"Amount",     v:"UGX 2,500,000"},
                {k:"Channel",    v:"M-Pesa (UG)"},
                {k:"Token mint", v:"Queued (14)", vColor:"text-[#F97316]"},
                {k:"Tenant",     v:"3D-TOP"},
              ]} /></div>
            </BSection>

            <BSection title="Pipeline Trace">
              <div className="p-4 flex flex-col gap-3">
                {BLADE_TRACE.map(t => (
                  <div key={t.step} className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${t.dot} shrink-0`} /><span className="text-[#111B21]">{t.step}</span></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${t.badgeTone}`}>{t.badge}</span>
                  </div>
                ))}
              </div>
            </BSection>

            <BSection title="Actions (RBAC gated)">
              <div className="p-4">
                <div className="border border-[#E9EDEF] rounded-xl p-3 mb-3">
                  <div className="font-black text-[12px] text-[#111B21]">Safe Retry Plan</div>
                  <div className="text-[11px] text-[#667781] mt-0.5 mb-2">Retries webhook callback (max 5) — no double-mint.</div>
                  <div className="flex gap-2">
                    <button className="h-7 px-3 rounded-lg bg-[#25D366] text-[#075E54] text-[11px] font-black border-none cursor-pointer">Run retry</button>
                    <Pill>Open approvals</Pill>
                  </div>
                </div>
                <div className="border border-[#EF4444]/20 bg-[#FEF2F2] rounded-xl p-3">
                  <div className="font-black text-[12px] text-[#111B21]">High-Risk (HITL/HIC)</div>
                  <div className="text-[11px] text-[#667781] mt-0.5 mb-2">Manual mint / Refund / Escrow release require approval + audit hash</div>
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-black">HIC required</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-black">HITL review</span>
                  </div>
                  <button onClick={() => setModalOpen(true)} className="w-full h-8 rounded-lg bg-[#128C7E] text-white text-[11px] font-black border-none cursor-pointer">Start approval request</button>
                </div>
              </div>
            </BSection>

            <BSection title="Audit (Irrefutable)">
              <div className="p-4">
                <div className="text-[11px] text-[#667781] mb-0.5">hash_chain_id</div>
                <div className="font-black text-[13px] text-[#111B21] font-mono mb-2">hc_7c2f…b91e</div>
                <div className="text-[11px] text-[#667781] mb-0.5">actor</div>
                <div className="font-black text-[12px] text-[#111B21] mb-0">SystemAdmin • tim@…</div>
              </div>
            </BSection>

            <BSection title="Recent Events">
              <div className="p-4 flex flex-col gap-2">
                {BLADE_EVENTS.map((ev,i) => (
                  <div key={i} className="text-[11px] text-[#667781] border border-[#E9EDEF] rounded-lg px-3 py-2">{ev}</div>
                ))}
              </div>
            </BSection>
          </div>
        </div>
      )}

      {/* ── Modal: HITL Approval Request ─────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/35 z-50 grid place-items-center" onClick={() => setModalOpen(false)}>
          <div className="w-[min(700px,calc(100vw-24px))] max-h-[calc(100vh-24px)] bg-white rounded-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#E9EDEF] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-black text-[16px] text-[#111B21]">HITL Approval Request</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-black">HIGH-RISK</span>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[#667781] font-black text-[14px] cursor-pointer grid place-items-center hover:bg-[#E9EDEF]">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5">

              {[
                {label:"Action Type", value:"Manual Token Mint (to prevent service stop) ▾"},
                {label:"Reference",   value:"PMT-10492"},
                {label:"Tenant scope",value:"3D-TOP (Top Account)"},
                {label:"Amount",      value:"UGX 2,500,000"},
                {label:"Token impact",value:"+125,000 TOK (FIFO wallet)"},
                {label:"Reason",      value:"Callback OK but mint queue stalled (lag)"},
              ].map(f => (
                <div key={f.label} className="mb-4 border-b border-[#E9EDEF] pb-3">
                  <div className="text-[11px] text-[#667781] mb-1">{f.label}</div>
                  <div className="text-[13px] text-[#111B21]">{f.value}</div>
                </div>
              ))}

              <div className="mb-4 border-b border-[#E9EDEF] pb-3">
                <div className="text-[11px] text-[#667781] mb-1">Approvers (RBAC)</div>
                <div className="text-[12px] text-[#111B21] leading-relaxed">
                  <div>• Finance Controller (HITL)</div>
                  <div>• Platform Owner (HIC)</div>
                  <div>• Audit Bot (auto-hash)</div>
                </div>
              </div>

              {/* Guardrails */}
              <div className="bg-[#EAF7F3] border border-[#128C7E]/20 rounded-xl p-4 mb-4">
                <div className="font-black text-[13px] text-[#111B21] mb-2">Guardrails (G)</div>
                <div className="text-[12px] text-[#667781] leading-relaxed">
                  Irreversible: once approved, action cannot be undone.<br/>
                  Irrevocable: AI cannot bypass human decision.<br/>
                  Irrefutable: cryptographic audit trail is mandatory.
                </div>
              </div>

              {/* Pre-flight checklist */}
              <div className="mb-4 border-b border-[#E9EDEF] pb-3">
                <div className="text-[11px] text-[#667781] mb-2">Pre-flight Checklist</div>
                {[
                  "I confirm this will not create duplicate minting.",
                  "I confirm tenant scope is correct (no cross-tenant leakage).",
                  "I confirm FX + gateway fees have been accounted for.",
                  "I confirm this action is logged to Audit Logs & Compliance.",
                ].map((c,i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-[#111B21] border border-[#E9EDEF] rounded-lg px-3 py-2.5 mb-2">
                    <span className="w-4 h-4 rounded border border-[#E9EDEF] bg-white shrink-0" />
                    {c}
                  </div>
                ))}
              </div>

              {/* Audit note */}
              <div className="mb-4 border-b border-[#E9EDEF] pb-3">
                <div className="text-[11px] text-[#667781] mb-1">Audit note (optional)</div>
                <textarea placeholder="Type a short justification for the audit trail…" className="w-full h-20 rounded-lg border border-[#E9EDEF] px-3 py-2 text-[12px] text-[#111B21] outline-none resize-none focus:border-[#128C7E]/50" />
              </div>

              {/* Risk Summary */}
              <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl p-4">
                <div className="font-black text-[13px] text-[#111B21] mb-1">Risk Summary</div>
                <div className="text-[12px] text-[#667781]">This action mints 125,000 TOK to the 3D-TOP FIFO wallet. Dual approval is required. Once submitted, the action enters an immutable audit chain.</div>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E9EDEF] bg-white shrink-0">
              <button onClick={() => setModalOpen(false)} className="h-10 px-5 rounded-lg bg-[#F0F2F5] border border-[#E9EDEF] text-[13px] font-black text-[#111B21] cursor-pointer">Cancel</button>
              <button onClick={() => setModalOpen(false)} className="h-10 px-6 rounded-lg bg-[#25D366] text-[#075E54] text-[13px] font-black border-none cursor-pointer hover:brightness-105">Submit for approval</button>
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

function KpiCard({ label, value, sub, dot }: { label: string; value: string; sub: string; dot: string }) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl p-3 relative">
      <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${dot}`} />
      <div className="text-[11px] text-[#667781]">{label}</div>
      <div className="text-[22px] font-black text-[#111B21] mt-1 leading-tight">{value}</div>
      <div className="text-[10px] text-[#667781] mt-1">{sub}</div>
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

function KV({ rows }: { rows: { k: string; v: string; vColor?: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map(r => (
        <div key={r.k} className="flex gap-3 text-[12px]">
          <span className="text-[#667781] w-[90px] shrink-0">{r.k}</span>
          <span className={`font-black ${r.vColor ?? "text-[#111B21]"}`}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}
