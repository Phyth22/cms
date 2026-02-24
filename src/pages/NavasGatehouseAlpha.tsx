/**
 * NavasGatehouseAlpha — Gatehouse Alpha Home Screen
 *
 * The CMS entry point. Imports and composes:
 *   Existing shared components:
 *     • TopBar          (primary nav bar)
 *     • StatusStrip     (secondary / context bar)
 *     • NavRail         (primary side nav — desktop rail / mobile tab bar)
 *     • Sidebar         (secondary side nav — module tree)
 *     • Card            (generic card wrapper from primitives)
 *
 *   New page-specific components:
 *     • StatCard            (4-grid summary KPI cards)
 *     • WaswaAIBlade        (AI co-pilot blade)
 *     • HITLQueueBlade      (pending HITL actions aside)
 *     • HITLMintApprovalModal (mint approval modal)
 */
import React, { useState } from "react";

// ── Existing shared components ───────────────────────────────────────────────
import { TopBar }      from "../components/TopBar";
import { StatusStrip } from "../components/StatusStrip";
import { NavRail }     from "../components/NavRail";
import { Sidebar }     from "../components/Sidebar";

// ── New page-specific components ─────────────────────────────────────────────
import { StatCard }               from "../components/StatCard";
import { WaswaAIBlade }           from "../components/WaswaAIBlade";
import { HITLQueueBlade } from "../components/HITLQueueBlade";
import type { HITLQueueItem } from "../components/HITLQueueBlade";
import { HITLMintApprovalModal }  from "../HITLMintApprovalModal";

// ── Gatehouse-specific StatusStrip chips ────────────────────────────────────
const GATEHOUSE_CHIPS = [
  { id: "tenant",  label: "Tenant: 3D UG → BodaUnion → KLA Zone 3 ▾" },
  { id: "rbac",    label: "RBAC: Super‑Admin" },
  { id: "tokens",  label: "Tokens: 1.245M | Burn: 12.4/s | run‑out ~27h" },
  { id: "system",  label: "System: 🟢 Green | last incident 18m" },
  { id: "alerts",  label: "Alerts: P1=2 P2=17 | unacked 9" },
  { id: "pay",     label: "Pay: M‑Pesa ✅ MTN ⚠ Airtel ✅ | overdue=12" },
  { id: "waswa",   label: "Waswa AI: ON | HITL pending: 3" },
  { id: "range",   label: "Range: 1h ▾" },
  { id: "audit",   label: "Audit: ON | retention 365d" },
];

// ── Gatehouse-specific NavRail items ─────────────────────────────────────────
const GATEHOUSE_NAV = [
  { key: "home",     glyph: "⌂",  label: "Home"       },
  { key: "health",   glyph: "♥",  label: "Health"     },
  { key: "alerts",   glyph: "⚑",  label: "Alerts"     },
  { key: "modules",  glyph: "⧉",  label: "Modules"    },
  { key: "billing",  glyph: "₳",  label: "Billing"    },
  { key: "tokens",   glyph: "₿",  label: "Tokens"     },
  { key: "settings", glyph: "⚙",  label: "Settings"   },
  { key: "stream",   glyph: "≋",  label: "Stream"     },
  { key: "ai",       glyph: "✦",  label: "AI"         },
  { key: "refresh",  glyph: "↻",  label: "Refresh"    },
  { key: "help",     glyph: "?",  label: "Help"       },
];

// ── Gatehouse Sidebar module groups ─────────────────────────────────────────
const SIDEBAR_ITEMS = [
  // Core Ops group
  { key: "dashboard",     label: "Dashboard Entry"    },
  { key: "system-health", label: "System Health"      },
  { key: "alarm-center",  label: "Alarm Center"       },
  // Monetization
  { key: "token-engine",  label: "Token Engine"       },
  { key: "payments",      label: "Payments Gateways"  },
  // VEBA
  { key: "veba-gov",      label: "VEBA Governance"    },
  { key: "veba-bookings", label: "VEBA Bookings Ops"  },
];

const SIDEBAR_TIP = {
  title: "Waswa Tip",
  body:  'Ask "why burn↑" to trace token drains to infra.',
};

// ── HITL queue items ─────────────────────────────────────────────────────────
// (onReview wired up after component mounts — passed as prop below)

export default function NavasGatehouseAlpha() {
  const [hitlOpen, setHitlOpen] = useState(false);

  const hitlItems: HITLQueueItem[] = [
    { id: "h1", sev: "success",  title: "Token Mint Override", meta: "Mint 5,000 Type-B tokens to BodaUnion-KLA", onReview: () => setHitlOpen(true) },
    { id: "h2", sev: "warn",     title: "Price Rule Change",   meta: "VEBA commission 5% → 6% (KE only)"                                           },
    { id: "h3", sev: "critical", title: "Suspend Account",     meta: "DPD 61 days: \"Kampala Rentals Ltd\""                                         },
  ];

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-[#F0F2F5] pb-14 md:pb-0 overflow-x-hidden w-full">

      {/* 1. Primary nav bar — Gatehouse branding */}
      <TopBar
        brandName="NAVAS v26"
        pageTitle="Gatehouse Alpha"
        searchPlaceholder="Search tenant / IMEI / invoice / token rule…"
        roles={[{ label: "S01 • Dashboard Entry", variant: "teal" }]}
        avatarInitial="SA"
        whoLabel="System Admin • Super‑Admin"
      />

      {/* 2. Secondary nav / status strip — Gatehouse context chips */}
      <StatusStrip chips={GATEHOUSE_CHIPS} actions={[]} />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-x-hidden">

        {/* 3. Primary side nav */}
        <NavRail items={GATEHOUSE_NAV} />

        {/* 4. Secondary side nav — CMS module tree */}
        <Sidebar
        title="CMS Modules"
        subtitle="Gatehouse Alpha • S01"
        items={SIDEBAR_ITEMS}
        tip={SIDEBAR_TIP}
      />

        {/* 5. Main workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex flex-col">

          {/* Page header */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-[10px] text-[#667781] mb-1">
              Home &gt; Login &amp; SSO &gt; Gatehouse Alpha
            </div>
            <h1 className="text-[22px] font-black text-[#111B21] m-0 leading-tight">
              Gatehouse Alpha — Intelligent Command &amp; Control Entry
            </h1>
            <p className="text-[12px] text-[#667781] mt-1 mb-0">
              AI-first ops, tokenized billing, VEBA governance, and mobile money health in one blade workspace.
            </p>
          </div>

          {/* 4-column summary KPI grid */}
          <div className="px-4 py-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

          {/* Main blade row: AI co-pilot + HITL queue */}
          <div className="px-4 pb-4 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-3">

            {/* Waswa AI co-pilot blade */}
            <WaswaAIBlade onApproveMint={() => setHitlOpen(true)} />

            {/* HITL pending queue */}
            <HITLQueueBlade items={hitlItems} />
          </div>
        </main>
      </div>

      {/* HITL Mint Approval Modal */}
      <HITLMintApprovalModal
        open={hitlOpen}
        onClose={() => setHitlOpen(false)}
      />
    </div>
  );
}
