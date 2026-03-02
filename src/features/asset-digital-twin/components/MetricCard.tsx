/**
 * Shared primitives: Dot, Pill, SectionTitle, MetricCard
 */
import React from 'react';
import type { CardAccent } from '../masterCardRegistry';
import { MASTER_CARD_REGISTRY } from '../masterCardRegistry';
import { COLORS } from './types';

const ACCENT_COLOR: Record<CardAccent, string> = {
  teal:    COLORS.teal,
  green:   COLORS.green,
  blue:    COLORS.blue,
  warning: COLORS.warning,
  danger:  COLORS.danger,
  neutral: COLORS.border,
};

const cardStyle: React.CSSProperties = {
  background: COLORS.card, border: `1px solid ${COLORS.border}`,
  borderRadius: 12, padding: 14, position: 'relative',
};

const accentBarStyle: React.CSSProperties = {
  position: 'absolute', left: 0, right: 0, top: 0,
  height: 5, borderTopLeftRadius: 12, borderTopRightRadius: 12,
};

const pillBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  borderRadius: 999, padding: '5px 10px',
  fontSize: 12, fontWeight: 900,
  border: `1px solid ${COLORS.border}`, background: '#fff',
};

export function Dot({ color }: { color: string }) {
  return <span style={{ width: 8, height: 8, borderRadius: 99, display: 'inline-block', background: color }} />;
}

export function Pill({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <span style={{ ...pillBase, background: bg, color: fg, borderColor: bg === '#fff' ? COLORS.border : bg }}>
      {children}
    </span>
  );
}

export function SectionTitle({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontWeight: 1000, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{subtitle}</div>
      </div>
      {right}
    </div>
  );
}

export function MetricCard({ cardId, rightChip }: { cardId: string; rightChip?: React.ReactNode }) {
  const c = MASTER_CARD_REGISTRY[cardId];
  return (
    <div style={cardStyle}>
      <div style={{ ...accentBarStyle, background: ACCENT_COLOR[c.accent] }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>{c.title}</p>
        {rightChip}
      </div>
      <p style={{ fontSize: 20, fontWeight: 1000, margin: '6px 0 0 0' }}>{c.sampleValue}</p>
      <p style={{ fontSize: 12, color: COLORS.muted, margin: '8px 0 0 0' }}>{c.subtitle}</p>
    </div>
  );
}
