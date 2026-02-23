/**
 * SystemHealthNocBridge — Root composition
 *
 * Wires together the five independent layout components:
 *
 *   1. TopBar        — primary navigation bar
 *   2. StatusStrip   — secondary navigation / status bar
 *   3. NavRail       — primary side navigation
 *   4. Sidebar       — secondary side navigation
 *   5. Dashboard     — main workspace blades
 */
import React from "react";
import "./SystemHealthNocBridge.css";

import { TopBar }      from "./components/TopBar";
import { StatusStrip } from "./components/StatusStrip";
import { NavRail }     from "./components/NavRail";
import { Sidebar }     from "./components/Sidebar";
import { Dashboard }   from "./components/Dashboard";

export default function SystemHealthNocBridge() {
  return (
    <div className="nvas-root">
      {/* 1. Primary navigation bar */}
      <TopBar />

      {/* 2. Secondary navigation bar */}
      <StatusStrip />

      <div className="body">
        {/* 3. Primary side navigation */}
        <NavRail />

        {/* 4. Secondary side navigation */}
        <Sidebar />

        {/* 5. Dashboard (main workspace) */}
        <Dashboard />
      </div>

      <footer className="footer">
        Kafka lag 4.8s • Redis p95 3ms • Cassandra p95 27ms • SSE clients 2.1k • Uptime 99.82%
      </footer>
    </div>
  );
}
