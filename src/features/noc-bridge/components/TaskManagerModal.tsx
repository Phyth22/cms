/**
 * TaskManagerModal
 *
 * Full-screen dark overlay modal showing live NAVAS core process stats.
 * When `metrics` is provided, renders real supervisor + systemd processes.
 * All styles use Tailwind utility classes only.
 */
import React, { useMemo } from "react";
import type { ServerMetrics } from "../../../api";

interface TaskManagerModalProps {
  onClose: () => void;
  metrics?: ServerMetrics | null;
}

export function TaskManagerModal({ onClose, metrics }: TaskManagerModalProps) {
  const rows = useMemo(() => {
    if (!metrics) return [];

    const supervisor = Object.values(metrics.processes.supervisor).map((p) => ({
      name: p.program,
      status: p.status,
      cpu: p.cpu_percent.toFixed(1),
      mem: p.mem_percent.toFixed(2),
      rss: p.rss_MB.toFixed(0),
      pid: p.pid,
    }));

    const systemd = Object.values(metrics.processes.systemd).map((s) => ({
      name: s.service,
      status: s.status,
      cpu: s.cpu_percent.toFixed(1),
      mem: s.mem_percent.toFixed(2),
      rss: s.rss_MB.toFixed(0),
      pid: s.pid,
    }));

    const gunicorn = metrics.processes.gunicorn
      ? Object.entries(metrics.processes.gunicorn).map(([label, g]) => ({
          name: `gunicorn (${label.replace("gunicorn:", "PID ")})`,
          status: g.status || "running",
          cpu: g.cpu_percent.toFixed(1),
          mem: g.mem_percent.toFixed(2),
          rss: g.rss_MB.toFixed(0),
          pid: g.pid,
        }))
      : [];

    return [...supervisor, ...systemd, ...gunicorn];
  }, [metrics]);

  const summary = useMemo(() => {
    if (!metrics) return [["CPU", "—"], ["Memory", "—"], ["Disk", "—"]];
    return [
      ["CPU", `${metrics.system.cpu_percent}%`],
      ["Memory", `${metrics.system.memory_percent}%`],
      ["Disk", `${metrics.system.disk_space_root_percent}%`],
    ];
  }, [metrics]);

  // Shared grid columns for head + body rows
  const ROW_GRID = "grid grid-cols-[2.2fr_0.9fr_0.6fr_0.6fr_0.6fr_0.6fr] gap-2 items-center min-w-[540px]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 grid place-items-center p-0 xs:p-4 z-[500] overflow-hidden"
    >
      <div className="
        flex flex-col overflow-hidden
        w-full h-[100dvh]
        xs:w-[min(1080px,96vw)] xs:h-[min(700px,90dvh)]
        xs:rounded-xl
        bg-[#121417] border border-[#2B3137]
        shadow-[0_20px_60px_rgba(0,0,0,0.5)]
      ">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="h-12 flex items-center justify-between px-3.5 bg-[#1A1E23] text-white shrink-0 gap-2.5">
          <span className="font-black text-[13px] truncate">
            Task Manager — {metrics?.hostname ?? "NAVAS Core"} (Live)
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full px-2.5 py-1 text-[12px] font-extrabold bg-[#25D366] text-white">Live</span>
            <button className="h-[28px] rounded-full px-3 text-[12px] font-bold bg-[#D93025] text-white cursor-pointer hover:brightness-105">
              End task
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-[34px] h-[34px] rounded-lg border border-[#2B3137] text-[#9AA6B2] cursor-pointer hover:bg-[#2B3137] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Summary stats ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3.5 px-3.5 py-2.5 text-white shrink-0">
          {summary.map(([k, v]) => (
            <div key={k} className="min-w-[80px]">
              <div className="font-black">{v}</div>
              <div className="text-[12px] text-[#9AA6B2]">{k}</div>
            </div>
          ))}
        </div>

        {/* ── Process table ────────────────────────────────────────────── */}
        <div className="
          flex flex-col min-h-0 flex-1
          mx-3.5 mb-3.5 rounded-xl overflow-hidden
          bg-[#0F1216] border border-[#2B3137]
        ">
          {/* Table head */}
          <div className={`${ROW_GRID} px-2.5 py-2.5 text-[#9AA6B2] font-black text-[12px] border-b border-[#20262D] shrink-0`}>
            <div>Name</div><div>Status</div><div>CPU %</div>
            <div>Mem %</div><div>RSS MB</div><div>PID</div>
          </div>

          {/* Scrollable body */}
          <div className="overflow-auto">
            {rows.length === 0 ? (
              <div className="px-3.5 py-8 text-center text-[12px] text-[#9AA6B2]">Loading processes…</div>
            ) : (
              rows.map((r) => (
                <div key={r.pid} className={`${ROW_GRID} px-2.5 py-2 border-b border-[#20262D] text-[#D7DEE6] text-[12px]`}>
                  <div className="truncate font-mono text-[11px]">{r.name}</div>
                  <div className={r.status !== "running" ? "text-[#FFB74D]" : "text-[#25D366]"}>{r.status}</div>
                  <Cell>{r.cpu}%</Cell>
                  <Cell>{r.mem}%</Cell>
                  <Cell>{r.rss}</Cell>
                  <Cell green>{r.pid}</Cell>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="px-3.5 py-2 text-[#9AA6B2] text-[11px] border-t border-[#2B3137] shrink-0">
          {metrics ? `${rows.length} processes • ${metrics.hostname}` : "HIC/HITL actions are cryptographically logged (audit hash chain)."}
        </div>
      </div>
    </div>
  );
}

function Cell({ children, green = false }: { children: React.ReactNode; green?: boolean }) {
  return (
    <div className={`rounded-md px-2 py-1.5 text-[11px] ${green ? "bg-[#10361C] text-[#EAF2FA]" : "bg-[#0B2A3C] text-[#EAF2FA]"}`}>
      {children}
    </div>
  );
}
