/**
 * Sidebar — Secondary Side Navigation Bar
 * Uses react-router-dom NavLink for URL-driven active state.
 */
import React from "react";
import { NavLink } from "react-router-dom";

export interface SidebarItem { key: string; label: string; path?: string; }
interface SidebarTip  { title: string; body: string; }
interface SidebarProps {
  title?:    string;
  subtitle?: string;
  items?:    SidebarItem[];
  onSelect?: (key: string) => void;
  tip?:      SidebarTip;
  open?:     boolean;
}

const DEFAULT_ITEMS: SidebarItem[] = [
  // ── Entry points ──────────────────────────────────────────────────────────
  { key: "gatehouse",          label: "Gatehouse Alpha",      path: "/"           },
  { key: "noc-bridge",         label: "NOC Bridge (Health)",  path: "/noc-bridge" },

  // ── System Health sub-pages ───────────────────────────────────────────────
  { key: "api-edge",           label: "API & Edge",           path: "/health"     },
  { key: "ingestion",          label: "Ingestion Pipeline",   path: "/health"     },
  { key: "kafka",              label: "Kafka",                path: "/health"     },
  { key: "compute",            label: "Compute",              path: "/health"     },

  // ── Other modules ─────────────────────────────────────────────────────────
  { key: "messaging-payments", label: "Messaging + Payments", path: "/payments"   },
  { key: "ai-workloads",       label: "AI Workloads",         path: "/ai"         },
  { key: "task-manager",       label: "Task Manager (Diag)",  path: "/health"     },
  { key: "runbooks",           label: "Runbooks",             path: "/audit"      },
  { key: "incidents",          label: "Incidents",            path: "/alarms"     },
];

const DEFAULT_TIP: SidebarTip = {
  title: "Waswa Tip",
  body:  'Type: "why burn↑" to trace token drains to infra.',
};

export function Sidebar({
  title    = "System Health CMS",
  subtitle = "SRE God View • Ops+Revenue",
  items    = DEFAULT_ITEMS,
  onSelect,
  tip      = DEFAULT_TIP,
  open     = false,
}: SidebarProps) {
  return (
    <aside
      className={[
        "w-[240px] bg-white border-r border-[#E9EDEF]",
        "flex flex-col gap-2.5 p-3.5 shrink-0 overflow-y-auto",
        "hidden lg:flex",
        open ? "md:flex md:fixed md:left-[60px] md:top-[86px] md:bottom-0 md:z-[150] md:shadow-xl" : "",
      ].join(" ")}
    >
      <div className="font-extrabold text-[#111B21] text-[13px]">{title}</div>
      <div className="text-[11px] text-[#667781]">{subtitle}</div>

      <nav className="flex flex-col gap-1.5" aria-label="Secondary navigation">
        {items.map((item) => {
          const to = item.path ?? `/${item.key}`;
          return (
            <NavLink
              key={item.key}
              to={to}
              end={to === "/"}
              onClick={() => onSelect?.(item.key)}
              className={({ isActive }) =>
                [
                  "relative h-[34px] rounded-lg border flex items-center",
                  "px-2.5 text-[12px] cursor-pointer select-none no-underline",
                  "transition-colors duration-100",
                  isActive
                    ? "bg-[#E9F7F4] text-[#111B21] border-[#C2E8E1]"
                    : "text-[#667781] border-[#E9EDEF] hover:bg-[#F0F2F5]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-[#128C7E]" />
                  )}
                  <span className="pl-1">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {tip && (
        <div className="mt-auto border border-[#E9EDEF] bg-[#F0F2F5] rounded-xl p-2.5">
          <div className="font-bold text-[12px] text-[#111B21]">{tip.title}</div>
          <div className="mt-1 text-[11px] text-[#667781] leading-snug">{tip.body}</div>
        </div>
      )}
    </aside>
  );
}