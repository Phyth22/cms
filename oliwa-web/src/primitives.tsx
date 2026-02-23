/**
 * UI Primitives — shared building blocks used across Dashboard blades.
 */

import type { Severity } from "./types";
import type { ReactNode } from "react";

// ─── Helper: Format Severity Label ───────────────────────────────────────────

function formatSeverity(sev: Severity): string {
  return String(sev).charAt(0).toUpperCase() + String(sev).slice(1);
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

interface KpiProps {
  title: string;
  value: string;
  sub: string;
  sev: Severity;
}

export function Kpi({ title, value, sub, sev }: KpiProps) {
  return (
    <div className="kpi">
      <div className={`kpiAccent ${sev}`} />
      <div className="kpiTitle">{title}</div>
      <div className="kpiValue">{value}</div>
      <div className="kpiSub">{sub}</div>
      <span className={`pill small ${sev}`}>
        {formatSeverity(sev)}
      </span>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <div className="card">
      <div className="cardHead">
        <div className="cardTitle">{title}</div>
        {subtitle && <div className="cardSub">{subtitle}</div>}
      </div>
      <div className="cardBody">{children}</div>
    </div>
  );
}

// ─── Resource Bar ────────────────────────────────────────────────────────────

interface BarProps {
  label: string;
  /** 0–1 fractional fill value. */
  pct: number;
  meta: string;
  warn?: boolean;
}

export function Bar({ label, pct, meta, warn = false }: BarProps) {
  const fill = Math.max(0, Math.min(1, pct)) * 100;

  return (
    <div className="barRow">
      <div className="barLabel">{label}</div>
      <div className="barTrack">
        <div
          className={`barFill ${warn ? "warning" : ""}`}
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="barMeta">{meta}</div>
    </div>
  );
}

// ─── Mini Gateway ────────────────────────────────────────────────────────────

interface MiniGatewayProps {
  name: string;
  status: string;
  meta: string;
  sev: Severity;
}

export function MiniGateway({ name, status, meta, sev }: MiniGatewayProps) {
  return (
    <div className="mini">
      <div className="miniTop">
        <div className="miniName">{name}</div>
        <span className={`pill small ${sev}`}>{status}</span>
      </div>
      <div className="miniMeta">{meta}</div>
    </div>
  );
}

// ─── Mini Stat ───────────────────────────────────────────────────────────────

interface MiniStatProps {
  label: string;
  value: string;
}

export function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="miniStat">
      <div className="miniLabel">{label}</div>
      <div className="miniValue">{value}</div>
    </div>
  );
}