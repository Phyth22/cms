/**
 * NavRail — Primary Side Navigation Bar
 *
 * A compact icon-based vertical rail providing top-level section
 * navigation.  Each item is rendered as a square button that highlights
 * when it is the active section.
 */
import React from "react";

interface NavRailItem {
  /** Route / section key — used as React key and active comparison. */
  key: string;
  /** Single character or emoji displayed inside the button. */
  glyph: string;
  /** Accessible label shown in the title tooltip. */
  label: string;
}

interface NavRailProps {
  items?: NavRailItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
}

const DEFAULT_ITEMS: NavRailItem[] = [
  { key: "home",     glyph: "H",  label: "Home" },
  { key: "health",   glyph: "⛑",  label: "Health" },
  { key: "alarms",   glyph: "!",  label: "Alarms" },
  { key: "tokens",   glyph: "T",  label: "Tokens" },
  { key: "billing",  glyph: "₿",  label: "Billing" },
  { key: "payments", glyph: "$",  label: "Payments" },
  { key: "veba",     glyph: "V",  label: "VEBA" },
  { key: "ai",       glyph: "W",  label: "AI" },
  { key: "rbac",     glyph: "R",  label: "RBAC" },
  { key: "audit",    glyph: "A",  label: "Audit" },
];

export function NavRail({
  items = DEFAULT_ITEMS,
  activeKey = "health",
  onSelect,
}: NavRailProps) {
  return (
    <nav className="navRail" aria-label="Primary navigation">
      {items.map((item) => (
        <button
          key={item.key}
          className={`railBtn ${item.key === activeKey ? "active" : ""}`}
          title={item.label}
          aria-current={item.key === activeKey ? "page" : undefined}
          onClick={() => onSelect?.(item.key)}
        >
          {item.glyph}
        </button>
      ))}
    </nav>
  );
}
