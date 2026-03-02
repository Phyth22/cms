/**
 * types/index.ts — Shared TypeScript types for NAVAS CMS
 *
 * Re-exports all shared types from a single entry point.
 */

// ── Severity ─────────────────────────────────────────────────────────────────
export type Severity = "green" | "warning" | "alarm" | "critical";

// ── HITL (Human-in-the-Loop) ─────────────────────────────────────────────────
export type HitlAction = {
  id: string;
  sev: Severity;
  title: string;
  reason: string;
  primaryCta: "Approve" | "HIC";
  secondaryCta: string;
};
