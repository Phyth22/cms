/**
 * App.tsx — Root application component with routing.
 *
 * All routes are defined here. Each feature exports its page
 * component via a barrel export in features/<name>/index.ts.
 */
import { Routes, Route } from "react-router-dom";

// ── Shared layout components ─────────────────────────────────────────────────
import { TopBar }      from "../components/navigation";
import { StatusStrip } from "../components/navigation";
import { NavRail }     from "../components/navigation";
import { Sidebar }     from "../components/navigation";

// ── Auth context ─────────────────────────────────────────────────────────────
import { AuthProvider } from "../auth/AuthContext";

// ── Feature pages ────────────────────────────────────────────────────────────
import { AegisDashboardPage }  from "../features/aegis";
import { NocBridgePage }       from "../features/noc-bridge";
import { OpsWarRoomPage }      from "../features/ops-war-room";
import { GatehousePage }       from "../features/gatehouse";
import { AlarmFactoryPage }    from "../features/alarm-factory";
import { SystemHealthPage }    from "../features/health";
import { AlarmsPage }          from "../features/alarms";
import { TokensPage }          from "../features/tokens";
import { BillingPage }         from "../features/billing";
import { PaymentsPage }        from "../features/payments";
import { VebaPage }            from "../features/veba";
import { AIWorkloadsPage }     from "../features/ai-workloads";
import { RbacPage }            from "../features/rbac";
import { AuditPage }           from "../features/audit";
import { TenantTowerPage }     from "../features/tenant-tower";
import { BillingInvoicingPage } from "../features/billing-invoicing";
import { MoneyPage }            from "../features/money";
import { ProtocolPage }         from "../features/protocol";
import { FirmwarePage }         from "../features/firmware";
import { SimPage }             from "../features/sim";

import { AssetDigitalTwinPage }  from "../features/asset-digital-twin";

// ── 404 ──────────────────────────────────────────────────────────────────────
import { NotFoundPage } from "./NotFoundPage";


export default function App() {
  return (
    <AuthProvider>
    <div className="h-dvh flex flex-col bg-[#F0F2F5] overflow-hidden w-full">
      <TopBar />
      <StatusStrip />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        <NavRail />
        <Sidebar />

        <Routes>
          {/* ── Built pages ──────────────────────────────────────────────── */}
          <Route path="/"               element={<AegisDashboardPage />} />
          <Route path="/aegis"          element={<AegisDashboardPage />} />
          <Route path="/noc-bridge"     element={<NocBridgePage />} />
          <Route path="/ops"            element={<OpsWarRoomPage />} />
          <Route path="/gatehouse"      element={<GatehousePage />} />
          <Route path="/alarms-factory" element={<AlarmFactoryPage />} />
          <Route path="/tenant-tower"   element={<TenantTowerPage />} />
          <Route path="/billing-invoicing" element={<BillingInvoicingPage />} />
          <Route path="/money"            element={<MoneyPage />} />
          <Route path="/protocol"         element={<ProtocolPage />} />
          <Route path="/firmware"         element={<FirmwarePage />} />
          <Route path="/sim"             element={<SimPage />} />
          <Route path="/asset-digital-twin" element={<AssetDigitalTwinPage />} />
          {/* ── Placeholder pages (to be built) ──────────────────────────── */}
          <Route path="/health"   element={<SystemHealthPage />} />
          <Route path="/alarms"   element={<AlarmsPage />} />
          <Route path="/tokens"   element={<TokensPage />} />
          <Route path="/billing"  element={<BillingPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/veba"     element={<VebaPage />} />
          <Route path="/ai"       element={<AIWorkloadsPage />} />
          <Route path="/rbac"     element={<RbacPage />} />
          <Route path="/audit"    element={<AuditPage />} />

          {/* ── 404 ─────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <footer className="hidden md:flex items-center h-[22px] bg-white border-t border-[#E9EDEF] px-3 text-[11px] text-[#667781] overflow-x-auto whitespace-nowrap shrink-0">
        Kafka lag 4.8s • Redis p95 3ms • Cassandra p95 27ms • SSE clients 2.1k • Uptime 99.82%
      </footer>
    </div>
    </AuthProvider>
  );
}