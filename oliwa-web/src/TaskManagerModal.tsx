/**
 * TaskManagerModal
 *
 * Full-screen dark overlay modal showing a live (simulated) list of
 * OS-level tasks running within the NAVAS core, with per-process CPU,
 * memory, disk, network, and token-burn metrics.
 */
import React, { useMemo } from "react";

interface TaskManagerModalProps {
  onClose: () => void;
}

export function TaskManagerModal({ onClose }: TaskManagerModalProps) {
  const rows = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        name:
          i % 5 === 0
            ? `airtel_webhook_worker_${String(i).padStart(2, "0")}`
            : `python_socket_ingestor_${String(i).padStart(2, "0")}`,
        status: i % 5 === 0 ? "Degraded" : "Running",
        cpu:  (Math.random() * 10).toFixed(1),
        mem:  (Math.random() * 4).toFixed(1),
        disk: (Math.random() * 1).toFixed(1),
        net:  (Math.random() * 1).toFixed(1),
        tok:  (Math.random() * 0.2).toFixed(2),
      })),
    []
  );

  const summary = [
    ["CPU",     "63%"],
    ["Memory",  "82%"],
    ["Disk",    "76%"],
    ["Network", "1.2%"],
    ["GPU",     "41%"],
  ];

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        {/* Header */}
        <div className="modalHead">
          <div className="modalTitle">Task Manager — NAVAS Core (Live)</div>
          <div className="modalActions">
            <span className="pill green">Live</span>
            <button className="btn red">End task</button>
            <button className="x" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="tmStats">
          {summary.map(([k, v]) => (
            <div key={k} className="tmStat">
              <div className="tmVal">{v}</div>
              <div className="tmKey">{k}</div>
            </div>
          ))}
        </div>

        {/* Process table */}
        <div className="tmTable">
          <div className="tmHeadRow">
            <div>Name</div>
            <div>Status</div>
            <div>CPU</div>
            <div>Mem</div>
            <div>Disk</div>
            <div>Net</div>
            <div>Tok/s</div>
          </div>

          <div className="tmBody">
            {rows.map((r) => (
              <div key={r.name} className="tmRow">
                <div className="tmName">{r.name}</div>
                <div className={`tmStatus ${r.status !== "Running" ? "bad" : ""}`}>
                  {r.status}
                </div>
                <div className="heat">{r.cpu}%</div>
                <div className="heat">{r.mem}%</div>
                <div className="heat">{r.disk}MB/s</div>
                <div className="heat">{r.net}Mbps</div>
                <div className="heat greenHeat">{r.tok}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modalFoot">
          HIC/HITL actions are cryptographically logged (audit hash chain).
        </div>
      </div>
    </div>
  );
}
