/**
 * Sidebar — Secondary Side Navigation Bar
 *
 * A wider panel that presents section-specific sub-navigation links
 * for the currently active top-level section, along with a contextual
 * tip card at the bottom.
 */
import React from "react";

interface SidebarItem {
  key: string;
  label: string;
}

interface SidebarTip {
  title: string;
  body: string;
}

interface SidebarProps {
  title?: string;
  subtitle?: string;
  items?: SidebarItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  tip?: SidebarTip;
}

const DEFAULT_ITEMS: SidebarItem[] = [
  { key: "overview",           label: "Overview" },
  { key: "api-edge",           label: "API & Edge" },
  { key: "ingestion",          label: "Ingestion Pipeline" },
  { key: "kafka",              label: "Kafka" },
  { key: "databases",          label: "Databases" },
  { key: "compute",            label: "Compute" },
  { key: "messaging-payments", label: "Messaging + Payments" },
  { key: "ai-workloads",       label: "AI Workloads" },
  { key: "task-manager",       label: "Task Manager (Diag)" },
  { key: "runbooks",           label: "Runbooks" },
  { key: "incidents",          label: "Incidents" },
];

const DEFAULT_TIP: SidebarTip = {
  title: "Waswa Tip",
  body: 'Type: "why burn↑" to trace token drains to infra.',
};

export function Sidebar({
  title = "System Health CMS",
  subtitle = "SRE God View • Ops+Revenue",
  items = DEFAULT_ITEMS,
  activeKey = "overview",
  onSelect,
  tip = DEFAULT_TIP,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sideTitle">{title}</div>
      <div className="sideSub">{subtitle}</div>

      <nav className="sideMenu" aria-label="Secondary navigation">
        {items.map((item) => (
          <div
            key={item.key}
            className={`sideItem ${item.key === activeKey ? "active" : ""}`}
            role="button"
            tabIndex={0}
            aria-current={item.key === activeKey ? "page" : undefined}
            onClick={() => onSelect?.(item.key)}
            onKeyDown={(e) => e.key === "Enter" && onSelect?.(item.key)}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {tip && (
        <div className="tip">
          <div className="tipTitle">{tip.title}</div>
          <div className="tipBody">{tip.body}</div>
        </div>
      )}
    </aside>
  );
}
