/**
 * NavasGatehouseAlpha.tsx
 * Gatehouse Alpha — Intelligent Command & Control Entry
 *
 * Faithfully converted from NavasGatehouseAlpha.jsx + .css to Tailwind.
 *
 * Reused shared components:
 *   StatusStrip          — coloured scrollable chip bar
 *   StatCard             — 4-grid KPI summary cards
 *   WaswaAIBlade         — AI co-pilot chat blade
 *   HITLQueueBlade       — HITL pending queue aside
 *   HITLMintApprovalModal — mint approval modal
 *
 * Gatehouse-specific layout (NOT using shared TopBar/NavRail/Sidebar because
 * Gatehouse has distinct styling: dark-green rail, grouped sidebar, 2-line user meta):
 *   GatehouseTopBar      — inline
 *   GatehouseNavRail     — inline, dark green bg, white translucent buttons
 *   GatehousSidebar      — inline, grouped with search + NavLink routing
 */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { StatusStrip,} from "../components/StatusStrip";
import type { StatusChip } from "../components/StatusStrip";
import type { HITLQueueItem } from "../components/HITLQueueBlade";
import { StatCard }     from "../components/StatCard";
import { WaswaAIBlade }     from "../components/WaswaAIBlade";
import { HITLQueueBlade, } from "../components/HITLQueueBlade";
import { HITLMintApprovalModal }   from "../HITLMintApprovalModal";

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const CHIPS: StatusChip[] = [
  { id: "tenant",  label: "Tenant: 3D UG → BodaUnion → KLA Zone 3 ▾"  },
  { id: "rbac",    label: "RBAC: Super‑Admin",                variant: "ok"      },
  { id: "tokens",  label: "Tokens: 1.245M | Burn: 12.4/s | run‑out ~27h", variant: "success" },
  { id: "system",  label: "System: 🟢 Green | last incident 18m"        },
  { id: "alerts",  label: "Alerts: P1=2 P2=17 | unacked 9",  variant: "warn"    },
  { id: "pay",     label: "Pay: M‑Pesa✅ MTN⚠ Airtel✅ | overdue=12",  variant: "info"    },
  { id: "waswa",   label: "Waswa AI: ON | HITL pending: 3",   variant: "ok"      },
  { id: "range",   label: "Range: 1h ▾"                                 },
  { id: "audit",   label: "Audit: ON | retention 365d"                  },
];

// Glyph set from original JSX — mapped to routes
const NAV_ITEMS = [
  { key: "home",     glyph: "⌂", label: "Home",     path: "/"           },
  { key: "health",   glyph: "♥", label: "Health",   path: "/noc-bridge" },
  { key: "alarms",   glyph: "⚑", label: "Alarms",   path: "/alarms"     },
  { key: "modules",  glyph: "⧉", label: "Modules",  path: "/health"     },
  { key: "billing",  glyph: "₳", label: "Billing",  path: "/billing"    },
  { key: "tokens",   glyph: "₿", label: "Tokens",   path: "/tokens"     },
  { key: "settings", glyph: "⚙", label: "Settings", path: "/rbac"       },
  { key: "stream",   glyph: "≋", label: "Stream",   path: "/audit"      },
  { key: "ai",       glyph: "✦", label: "AI",       path: "/ai"         },
  { key: "refresh",  glyph: "↻", label: "Refresh",  path: "/"           },
  { key: "help",     glyph: "?", label: "Help",     path: "/"           },
];

// Grouped sidebar — matches original JSX groups exactly
const SIDEBAR_GROUPS = [
  {
    title: "Core Ops",
    items: [
      { label: "Dashboard Entry",  path: "/"           },
      { label: "System Health",    path: "/noc-bridge" },
      { label: "Alarm Center",     path: "/alarms"     },
    ],
  },
  {
    title: "Monetization",
    items: [
      { label: "Token Engine",      path: "/tokens"   },
      { label: "Payments Gateways", path: "/payments" },
    ],
  },
  {
    title: "VEBA",
    items: [
      { label: "VEBA Governance",   path: "/veba" },
      { label: "VEBA Bookings Ops", path: "/veba" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────
export default function NavasGatehouseAlpha() {
  const [hitlOpen,      setHitlOpen]      = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const hitlItems: HITLQueueItem[] = [
    { id: "h1", sev: "success",  title: "Token Mint Override", meta: "Mint 5,000 Type‑B tokens to BodaUnion‑KLA", onReview: () => setHitlOpen(true) },
    { id: "h2", sev: "warn",     title: "Price Rule Change",   meta: "VEBA commission 5% → 6% (KE only)"                                           },
    { id: "h3", sev: "critical", title: "Suspend Account",     meta: 'DPD 61 days: "Kampala Rentals Ltd"'                                          },
  ];

  const filteredGroups = SIDEBAR_GROUPS
    .map((g) => ({
      ...g,
      items: g.items.filter((i) =>
        i.label.toLowerCase().includes(sidebarSearch.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5] overflow-hidden">

      {/* ── TopBar ─────────────────────────────────────────────────────────── */}
      <header className="h-12 shrink-0 flex items-center justify-between gap-3 px-3 bg-[#075E54] text-white">

        {/* Brand */}
        <div className="flex items-center gap-2.5 font-bold shrink-0">
          <span className="text-[16px]">NAVAS v26</span>
          <span className="opacity-80">•</span>
          <span className="text-[13px]">Gatehouse Alpha</span>
          <span className="bg-[#128C7E] rounded-full px-2.5 py-[3px] text-[11px] font-bold hidden sm:inline">
            S01 • Dashboard Entry
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-0 max-w-[520px] hidden sm:block">
          <input
            placeholder="Search tenant / IMEI / invoice / token rule…"
            className="w-full h-[34px] rounded-full border border-white/15 bg-[#0B6B60] text-[#E9EDEF] placeholder-white/50 px-3 text-[13px] outline-none focus:bg-[#0D7A6E] transition-colors"
          />
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#25D366] text-[#075E54] font-black text-[12px] grid place-items-center">
            SA
          </div>
          <div className="hidden sm:flex flex-col leading-none gap-0.5">
            <span className="text-[12px] font-extrabold">System Admin</span>
            <span className="text-[10px] opacity-80">RBAC: Super‑Admin • Can‑Spend</span>
          </div>
        </div>
      </header>

      {/* Shell: NavRail + Sidebar + Workspace */}
      <div className="flex flex-1 min-h-0">

        {/* ── NavRail — dark green, white translucent buttons ─────────────── */}
        <aside className="w-[60px] bg-[#075E54] shrink-0 flex flex-col items-center gap-2.5 py-2.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === "/"}
              title={item.label}
              aria-label={item.label}
              className={({ isActive }) =>
                [
                  "w-10 h-[34px] rounded-[10px] border-none font-bold text-[16px]",
                  "grid place-items-center cursor-pointer no-underline shrink-0",
                  "transition-colors duration-150 text-white",
                  isActive ? "bg-[#128C7E]" : "bg-white/[0.12] hover:bg-white/[0.20]",
                ].join(" ")
              }
            >
              {item.glyph}
            </NavLink>
          ))}
        </aside>

        {/* ── Sidebar — white, grouped modules, with search ───────────────── */}
        <aside className="w-[240px] bg-white border-r border-[#E9EDEF] shrink-0 flex flex-col overflow-y-auto p-3.5 hidden lg:flex">
          {/* Header + search */}
          <div className="flex flex-col gap-2.5 mb-1">
            <div className="font-extrabold text-[#111B21]">CMS Modules</div>
            <input
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search module…"
              className="h-9 rounded-[10px] border border-[#E9EDEF] bg-[#F8F9FA] px-2.5 text-[12px] outline-none focus:border-[#128C7E] transition-colors"
            />
          </div>

          {/* Grouped nav links */}
          {filteredGroups.map((group) => (
            <div key={group.title}>
              <div className="text-[12px] text-[#667781] font-extrabold mt-3.5 mb-1.5">
                {group.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      [
                        "w-full text-left px-2.5 py-2 rounded-[10px] border text-[13px]",
                        "cursor-pointer no-underline transition-colors duration-100",
                        isActive
                          ? "bg-[#E8F5F2] border-[#128C7E] text-[#111B21] font-semibold"
                          : "border-transparent bg-transparent text-[#667781] hover:bg-[#F0F2F5]",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* ── Workspace ───────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* StatusStrip — coloured chips, no action buttons */}
          <StatusStrip chips={CHIPS} actions={[]} />

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-[18px] py-4">

            {/* Breadcrumbs */}
            <div className="text-[10px] text-[#667781] mb-1.5">
              Home &gt; Login &amp; SSO &gt; Gatehouse Alpha
            </div>

            {/* Page title */}
            <h1 className="text-[22px] font-black text-[#111B21] m-0 mb-1.5">
              Gatehouse Alpha — Intelligent Command &amp; Control Entry
            </h1>
            <p className="text-[12px] text-[#667781] m-0 mb-3.5">
              AI-first ops, tokenized billing, VEBA governance, and mobile money health in one blade workspace.
            </p>

            {/* 4-col KPI grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
              <StatCard
                title="System Health"
                badge="ok"
                badgeLabel="🟢 GREEN"
                meta="Uptime 99.8% • CPU 42% • RAM 68%"
              />
              <StatCard
                title="Token Wallet"
                badge="success"
                badgeLabel="TOP‑UP"
                meta="Balance 1.245M • Burn 12.4/s • 27h left"
                cta={{ label: "Top‑up via Mobile Money", variant: "green" }}
              />
              <StatCard
                title="Payments"
                badge="info"
                badgeLabel="LIVE"
                meta="M‑Pesa ✅  MTN ⚠  Airtel ✅"
              />
              <StatCard
                title="Alerts"
                badge="warn"
                badgeLabel="ACTION"
                meta="P1=2 • P2=17 • Unacked 9"
              />
            </div>

            {/* Blade row: Waswa AI (flex) + HITL Queue (360px) */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-3">
              <WaswaAIBlade onApproveMint={() => setHitlOpen(true)} />
              <HITLQueueBlade items={hitlItems} />
            </div>
          </div>
        </main>
      </div>

      {/* HITL Approval Modal */}
      <HITLMintApprovalModal open={hitlOpen} onClose={() => setHitlOpen(false)} />
    </div>
  );
}