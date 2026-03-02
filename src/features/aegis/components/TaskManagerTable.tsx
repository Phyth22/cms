/**
 * TaskManagerTable — System Health Task Manager View (live)
 *
 * Displays a live table of all running services with:
 *   Service name | CPU % | RAM | Restarts(24h) | Lag/Queue | Status badge
 *
 * Status colours match screenshot:
 *   OK    → plain text
 *   WARN  → orange text
 *   ALARM → red text
 *
 * All styles: Tailwind utility classes only.
 */
import React from "react";

export type TaskStatus = "OK" | "WARN" | "ALARM";

export interface TaskRow {
  service:   string;
  cpu:       string;
  ram:       string;
  restarts:  number;
  lagQueue:  string;
  status:    TaskStatus;
}

interface TaskManagerTableProps {
  rows?: TaskRow[];
  title?: string;
  subtitle?: string;
}

const statusCls: Record<TaskStatus, string> = {
  OK:    "text-[#111B21]",
  WARN:  "text-[#F97316] font-extrabold",
  ALARM: "text-[#EF4444] font-extrabold",
};

const DEFAULT_ROWS: TaskRow[] = [
  { service: "python-socket-ingest", cpu: "62%", ram: "1.8GB",  restarts: 0, lagQueue: "Ingest p95 18s",    status: "OK"    },
  { service: "kafka-broker-01",      cpu: "71%", ram: "3.2GB",  restarts: 1, lagQueue: "Consumer lag 12s",  status: "WARN"  },
  { service: "node-sse-consumer",    cpu: "35%", ram: "620MB",  restarts: 0, lagQueue: "SSE clients 4,812", status: "OK"    },
  { service: "cassandra-write",      cpu: "58%", ram: "5.1GB",  restarts: 0, lagQueue: "Write p95 9ms",     status: "OK"    },
  { service: "postgres-registry",    cpu: "43%", ram: "1.1GB",  restarts: 0, lagQueue: "Slow q 4/min",      status: "OK"    },
  { service: "redis-cache",          cpu: "22%", ram: "740MB",  restarts: 0, lagQueue: "Hit 97%",           status: "OK"    },
  { service: "momo-webhooks",        cpu: "18%", ram: "310MB",  restarts: 2, lagQueue: "Retry Q 41",        status: "WARN"  },
  { service: "waswa-slm-infer",      cpu: "79%", ram: "6.4GB",  restarts: 0, lagQueue: "Infer Q 128",       status: "ALARM" },
];

export function TaskManagerTable({
  rows    = DEFAULT_ROWS,
  title   = "System Health — Task Manager View (live)",
  subtitle = "CPU/RAM by process. Critical thresholds auto-escalate (P1/P0).",
}: TaskManagerTableProps) {
  return (
    <div className="bg-white border border-[#E9EDEF] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E9EDEF]">
        <div className="font-black text-[13px] text-[#111B21]">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-[#667781] mt-0.5">{subtitle}</div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#E9EDEF] bg-[#F8F9FA]">
              {["Service", "CPU", "RAM", "Restarts(24h)", "Lag/Queue", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-[11px] font-extrabold text-[#667781] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.service}
                className={`border-b border-[#E9EDEF] last:border-0 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-[#111B21] whitespace-nowrap">
                  {row.service}
                </td>
                <td className="px-4 py-2.5 text-[#111B21]">{row.cpu}</td>
                <td className="px-4 py-2.5 text-[#111B21]">{row.ram}</td>
                <td className={`px-4 py-2.5 ${row.restarts > 0 ? "text-[#F97316] font-extrabold" : "text-[#111B21]"}`}>
                  {row.restarts}
                </td>
                <td className="px-4 py-2.5 text-[#667781] whitespace-nowrap">{row.lagQueue}</td>
                <td className={`px-4 py-2.5 whitespace-nowrap ${statusCls[row.status]}`}>
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
