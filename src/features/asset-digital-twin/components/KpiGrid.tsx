/**
 * Two rows of 4 KPI metric cards.
 */
import React from 'react';
import { MetricCard, Pill } from './MetricCard';
import { COLORS } from './types';

const grid4: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginTop: 14,
};

const warnChip  = <Pill bg="#fff" fg={COLORS.warning}>🟡</Pill>;
const alertChip = <Pill bg="#fff" fg={COLORS.warning}>🟠</Pill>;

export function KpiGrid() {
  return (
    <>
      <div style={grid4}>
        <MetricCard cardId="assets_total" />
        <MetricCard cardId="assets_online_offline" rightChip={warnChip} />
        <MetricCard cardId="maintenance_due"        rightChip={alertChip} />
        <MetricCard cardId="docs_expiring"          rightChip={warnChip} />
      </div>
      <div style={grid4}>
        <MetricCard cardId="utilization" />
        <MetricCard cardId="veba_bookings_today" />
        <MetricCard cardId="escrow_pending" rightChip={warnChip} />
        <MetricCard cardId="token_burn"     rightChip={warnChip} />
      </div>
    </>
  );
}
