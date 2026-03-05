/**
 * TrashRestoreModal — Tenant Trash & Restore overlay.
 *
 * Shows soft-deleted tenants with age + restore action.
 * Restore of high-impact tenants is HITL-gated.
 * 30-day retention, then permanent purge.
 */
import React, { useEffect, useState } from "react";
import { getTrashedTenants, restoreTenant, ApiError } from "../../../api";
import type { TrashedTenant } from "../../../api";

interface TrashRestoreModalProps {
  open:    boolean;
  onClose: () => void;
}

const FALLBACK: TrashedTenant[] = [
  { id: "t1", name: "Mombasa_Reefer_Coldchain",    tier: "ORG",    trashed_at: "2026-02-28T08:00:00Z", age: "5d",  hitl_required: false },
  { id: "t2", name: "Old_Demo_Tenant",              tier: "CLIENT", trashed_at: "2026-02-20T12:00:00Z", age: "13d", hitl_required: false },
  { id: "t3", name: "Gulu_Schools_Patrol",          tier: "ORG",    trashed_at: "2026-02-10T09:00:00Z", age: "23d", hitl_required: true  },
];

export function TrashRestoreModal({ open, onClose }: TrashRestoreModalProps) {
  const [items, setItems]       = useState<TrashedTenant[]>(FALLBACK);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    getTrashedTenants()
      .then((res) => setItems(res.data))
      .catch((err) => {
        if (err instanceof ApiError) setError(err.apiMessage ?? err.message);
      })
      .finally(() => setLoading(false));
  }, [open]);

  async function handleRestore(id: string) {
    setRestoring(id);
    try {
      await restoreTenant(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      if (err instanceof ApiError) setError(err.apiMessage ?? err.message);
    } finally {
      setRestoring(null);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl w-[600px] max-h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9EDEF] shrink-0">
          <div>
            <div className="font-black text-[14px] text-[#111B21]">Trash &amp; Restore</div>
            <div className="text-[11px] text-[#667781] mt-0.5">Soft-deleted tenants retained 30 days. Restore requires HITL if high-impact.</div>
          </div>
          <button onClick={onClose} className="text-[11px] text-[#667781] bg-[#F0F2F5] border border-[#E9EDEF] rounded-lg px-3 py-1.5 cursor-pointer font-black hover:bg-[#E9EDEF]">Close</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {error && (
            <div className="mx-5 mt-3 px-3 py-2 rounded-lg bg-[#FEF2F2] text-[12px] text-[#EF4444] font-black">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 text-[12px] text-[#667781]">Loading trashed tenants...</div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-[12px] text-[#667781]">No trashed tenants.</div>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#E9EDEF] bg-[#F8FAFC]">
                  {["Tenant", "Tier", "Age", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-[11px] font-extrabold text-[#667781]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id} className="border-b border-[#E9EDEF] last:border-0 hover:bg-[#F8FAFC]">
                    <td className="px-5 py-3 font-extrabold text-[#111B21]">{t.name}</td>
                    <td className="px-5 py-3 text-[#667781]">{t.tier}</td>
                    <td className="px-5 py-3 text-[#667781]">{t.age}</td>
                    <td className="px-5 py-3">
                      <button
                        disabled={restoring === t.id}
                        onClick={() => handleRestore(t.id)}
                        className={`h-7 px-3 rounded-full text-[10px] font-black border-none cursor-pointer transition-all whitespace-nowrap ${
                          t.hitl_required
                            ? "bg-[#F97316] text-white hover:brightness-105"
                            : "bg-[#F0F2F5] text-[#111B21] hover:bg-[#E9EDEF]"
                        } disabled:opacity-50`}
                      >
                        {restoring === t.id ? "Restoring..." : t.hitl_required ? "Restore (HITL)" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E9EDEF] shrink-0 text-[11px] text-[#667781]">
          Permanent purge after 30 days. All restores are audit-logged.
        </div>
      </div>
    </div>
  );
}
