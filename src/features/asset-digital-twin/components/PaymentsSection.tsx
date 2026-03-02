/**
 * Payments & Settlement Control — KPIs, audit trail, integrity checks, reports.
 */
import React from 'react';
import { COLORS, btn, btnPrimary, btnBlue } from './types';
import { MetricCard, Pill, SectionTitle } from './MetricCard';

const grid4: React.CSSProperties  = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginTop: 14 };
const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 14, marginTop: 14 };
const card: React.CSSProperties   = { background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14 };

const warnChip = <Pill bg="#fff" fg={COLORS.warning}>🟡</Pill>;

const INTEGRITY_ITEMS = [
  { n: '0',  t: 'IMEI duplicates',           d: 'No device mapped to multiple assets',    ok: true  },
  { n: '1',  t: 'ICCID duplicates',          d: 'SIM appears in 2 assets → resolve',      ok: false },
  { n: '12', t: 'Orphan SIMs',               d: 'Active SIMs not linked to any asset',    ok: false },
  { n: '5',  t: 'Missing driver attribution', d: 'Trips without driver/agent',             ok: false },
  { n: '7',  t: 'Cross-tenant link attempts', d: 'Blocked by hard rule (audit logged)',    ok: true  },
];

export function PaymentsSection() {
  return (
    <div style={{ ...card, marginTop: 14 }}>
      <SectionTitle
        title="Payments & Settlement Control"
        subtitle="MTN / Airtel / M‑Pesa • Escrow → Instant Payout • Reconciliation"
        right={<Pill bg="#fff" fg={COLORS.blue}>Open Transactions</Pill>}
      />

      <div style={grid4}>
        <MetricCard cardId="payments_tx_success" />
        <MetricCard cardId="webhook_failures" rightChip={warnChip} />
        <MetricCard cardId="settlement_delay" />
        <MetricCard cardId="chargebacks"      rightChip={warnChip} />
      </div>

      {/* Audit trail */}
      <div style={{ marginTop: 14, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, background: '#F8F9FA' }}>
        <div style={{ fontWeight: 1000, fontSize: 12 }}>Audit (Irrefutable):</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>SA • approved payout override • Booking #VEBA-22918 • hash 9f3c…</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>SA • linked IMEI 8619… → Asset KLA-DOZER-D6-019 • reason: install QA</div>
      </div>

      <div style={twoCol}>
        {/* Digital Twin Integrity Checks */}
        <div style={card}>
          <SectionTitle
            title="Digital Twin Integrity Checks"
            subtitle="Mapping integrity • RBAC scope • Privacy gates"
            right={<Pill bg="#fff" fg={COLORS.blue}>Open Diagnostics</Pill>}
          />
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            {INTEGRITY_ITEMS.map((it) => (
              <div key={it.t} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Pill bg="#F0FBF9" fg={COLORS.tealDark}>{it.n}</Pill>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 12 }}>{it.t}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{it.d}</div>
                  </div>
                </div>
                <Pill bg={it.ok ? COLORS.green : COLORS.warning} fg={it.ok ? COLORS.tealDark : '#fff'}>
                  {it.ok ? '✓' : '⚠'}
                </Pill>
              </div>
            ))}
          </div>
        </div>

        {/* Reports & Exports */}
        <div style={card}>
          <SectionTitle
            title="Reports & Exports"
            subtitle="PDF/CSV/XLS • Scheduled • WhatsApp/email delivery"
            right={<Pill bg="#fff" fg={COLORS.warning}>HITL</Pill>}
          />
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            <MetricCard cardId="export_queue"     rightChip={warnChip} />
            <MetricCard cardId="retention_policy" />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <button style={btn}>Create Template</button>
            <button style={{ ...btn, ...btnBlue }}>Schedule</button>
            <button style={{ ...btn, ...btnPrimary }}>Export Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
