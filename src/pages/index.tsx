/**
 * pages/index.tsx — All page components for NAVAS CMS routes.
 */
import React from "react";
import NavasGatehouseAlpha    from "./NavasGatehouseAlpha";
import SystemHealthNocBridge  from "./SystemHealthNocBridge";

// ── Full-layout standalone pages ─────────────────────────────────────────────
export function GatehouseAlphaPage()   { return <NavasGatehouseAlpha />;   }
export function SystemHealthNocPage()  { return <SystemHealthNocBridge />;  }

// ── Placeholder factory ──────────────────────────────────────────────────────
function Placeholder({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#F0F2F5] p-8 min-h-0">
      <span className="text-[56px] opacity-30">{icon}</span>
      <h2 className="text-[22px] font-black text-[#111B21] m-0">{title}</h2>
      <p className="text-[13px] text-[#667781] m-0">
        This module is under construction. Replace this component with the real page.
      </p>
    </div>
  );
}

export function SystemHealthPage() { return <Placeholder title="System Health"      icon="⛑"  />; }
export function AlarmsPage()       { return <Placeholder title="Alarm Center"       icon="⚑"  />; }
export function TokensPage()       { return <Placeholder title="Token Engine"       icon="T"   />; }
export function BillingPage()      { return <Placeholder title="Billing"            icon="₿"  />; }
export function PaymentsPage()     { return <Placeholder title="Payments Gateways"  icon="$"   />; }
export function VebaPage()         { return <Placeholder title="VEBA Governance"    icon="V"   />; }
export function AIPage()           { return <Placeholder title="Waswa AI Workloads" icon="✦"  />; }
export function RbacPage()         { return <Placeholder title="RBAC Management"    icon="R"   />; }
export function AuditPage()        { return <Placeholder title="Audit Trail"        icon="A"   />; }

export function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#F0F2F5] p-8">
      <span className="text-[72px] opacity-20">404</span>
      <h2 className="text-[22px] font-black text-[#111B21] m-0">Page not found</h2>
      <p className="text-[13px] text-[#667781] m-0">
        The route you requested doesn't exist in this CMS.
      </p>
      <a
        href="/"
        className="mt-2 h-9 px-5 rounded-full bg-[#128C7E] text-white text-[12px] font-bold flex items-center hover:brightness-105 transition-all"
      >
        Go to Gatehouse Alpha
      </a>
    </div>
  );
}