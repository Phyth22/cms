/**
 * App.tsx — Root router shell for NAVAS CMS
 *
 * Route map:
 *   /                   → GatehouseAlphaPage    (standalone layout)
 *   /noc-bridge         → SystemHealthNocPage   (standalone layout)
 *   /health             → SystemHealthPage       (AppLayout)
 *   /alarms             → AlarmsPage             (AppLayout)
 *   /tokens             → TokensPage             (AppLayout)
 *   /billing            → BillingPage            (AppLayout)
 *   /payments           → PaymentsPage           (AppLayout)
 *   /veba               → VebaPage               (AppLayout)
 *   /ai                 → AIPage                 (AppLayout)
 *   /rbac               → RbacPage               (AppLayout)
 *   /audit              → AuditPage              (AppLayout)
 *   *                   → NotFoundPage
 *
 * Standalone vs AppLayout:
 *   Pages that own their full chrome (TopBar + NavRail + Sidebar)
 *   render outside AppLayout so their layout props aren't overridden.
 *   All other pages share AppLayout's shared chrome.
 */
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// ── Shared layout components ─────────────────────────────────────────────────
import { TopBar }      from "./components/TopBar";
import { StatusStrip } from "./components/StatusStrip";
import { NavRail }     from "./components/NavRail";
import { Sidebar }     from "./components/Sidebar";

// ── Pages ────────────────────────────────────────────────────────────────────
import {
  GatehouseAlphaPage,
  SystemHealthNocPage,
  SystemHealthPage,
  AlarmsPage,
  TokensPage,
  BillingPage,
  PaymentsPage,
  VebaPage,
  AIPage,
  RbacPage,
  AuditPage,
  NotFoundPage,
} from "./pages";

// ── AppLayout — shared chrome for CMS module pages ───────────────────────────
function AppLayout() {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-[#F0F2F5] pb-14 md:pb-0 overflow-x-hidden w-full">
      <TopBar />
      <StatusStrip />
      <div className="flex flex-1 min-h-0 min-w-0 overflow-x-hidden">
        <NavRail />
        <Sidebar />
        <Outlet />
      </div>
      <footer
        className="hidden md:flex items-center h-[22px] bg-white border-t border-[#E9EDEF] px-3 text-[11px] text-[#667781] overflow-x-auto whitespace-nowrap shrink-0"
        style={{ scrollbarWidth: "none" }}
      >
        Kafka lag 4.8s&nbsp;•&nbsp;Redis p95 3ms&nbsp;•&nbsp;Cassandra p95 27ms&nbsp;•&nbsp;SSE clients 2.1k&nbsp;•&nbsp;Uptime 99.82%
      </footer>
    </div>
  );
}

// ── Route table ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>

      {/* ── Standalone full-layout pages ─────────────────────────────── */}
      {/* Home — Gatehouse Alpha entry screen */}
      <Route path="/"           element={<GatehouseAlphaPage />}  />

      {/* NOC Bridge — System Health dashboard (first page we built) */}
      <Route path="/noc-bridge" element={<SystemHealthNocPage />} />

      {/* ── AppLayout pages — share TopBar / NavRail / Sidebar ────────── */}
      <Route element={<AppLayout />}>
        <Route path="/health"   element={<SystemHealthPage />} />
        <Route path="/alarms"   element={<AlarmsPage />}       />
        <Route path="/tokens"   element={<TokensPage />}       />
        <Route path="/billing"  element={<BillingPage />}      />
        <Route path="/payments" element={<PaymentsPage />}     />
        <Route path="/veba"     element={<VebaPage />}         />
        <Route path="/ai"       element={<AIPage />}           />
        <Route path="/rbac"     element={<RbacPage />}         />
        <Route path="/audit"    element={<AuditPage />}        />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}