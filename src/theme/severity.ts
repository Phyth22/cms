/**
 * theme/severity.ts — Severity-based styling maps
 *
 * Consolidates severity color logic from primitives.tsx and types.ts
 * into a single reusable module.
 */
import type { Severity } from "../types";

// ── Tailwind class maps ──────────────────────────────────────────────────────

export const sevAccent: Record<Severity, string> = {
  green:    "bg-[#25D366]",
  warning:  "bg-[#F4B400]",
  alarm:    "bg-[#FB8C00]",
  critical: "bg-[#D93025]",
};

export const sevPill: Record<Severity, string> = {
  green:    "bg-[#25D366] text-white",
  warning:  "bg-[#F4B400] text-[#111]",
  alarm:    "bg-[#FB8C00] text-[#111]",
  critical: "bg-[#D93025] text-white",
};

export const sevLabel: Record<Severity, string> = {
  green:    "Active",
  warning:  "Warning",
  alarm:    "Alarm",
  critical: "Critical",
};
