import React, { useEffect, useState } from "react";
import { allocateTokens, getAllTenants } from "../../../api";
import type { Tenant } from "../../../api";

interface Props {
  open: boolean;
  onClose: () => void;
  fromTenantId: string | null;
  fromTenantName: string;
  onSuccess: () => void;
}

export function AllocateModal({ open, onClose, fromTenantId, fromTenantName, onSuccess }: Props) {
  const [children, setChildren] = useState<Tenant[]>([]);
  const [toTenantId, setToTenantId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ from_new_balance: number; to_new_balance: number } | null>(null);

  useEffect(() => {
    if (!open || !fromTenantId) return;
    getAllTenants()
      .then((res) => {
        const kids = res.data.filter((t) => t.parent_id === fromTenantId);
        setChildren(kids);
      })
      .catch(() => {});
  }, [open, fromTenantId]);

  if (!open) return null;

  function reset() {
    setToTenantId("");
    setAmount("");
    setError(null);
    setResult(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!fromTenantId) return;
    if (!toTenantId) { setError("Select a child tenant"); return; }
    const num = Number(amount);
    if (!num || num <= 0) { setError("Enter a positive token amount"); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await allocateTokens({ from_tenant_id: fromTenantId, to_tenant_id: toTenantId, amount: num });
      setResult({ from_new_balance: res.data.from_new_balance, to_new_balance: res.data.to_new_balance });
      onSuccess();
    } catch (e: any) {
      setError(e?.message ?? "Allocation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl w-[440px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9EDEF]">
          <span className="font-black text-[14px] text-[#111B21]">Allocate Tokens</span>
          <button onClick={handleClose} className="text-[11px] text-[#667781] bg-[#F0F2F5] border border-[#E9EDEF] rounded-lg px-3 py-1.5 cursor-pointer font-black hover:bg-[#E9EDEF]">Close</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <div className="text-[12px] text-[#667781] mb-3">
            Transfer tokens from <span className="font-black text-[#111B21]">{fromTenantName}</span> to a child tenant
          </div>

          {result ? (
            <div className="bg-[#EAF7F3] border border-[#25D366] rounded-xl p-4 text-center">
              <div className="text-[14px] font-black text-[#128C7E]">Allocation Successful</div>
              <div className="text-[12px] text-[#667781] mt-1">
                {fromTenantName} balance: <span className="font-black text-[#111B21]">{result.from_new_balance.toLocaleString()}</span>
              </div>
              <div className="text-[12px] text-[#667781] mt-0.5">
                Child balance: <span className="font-black text-[#111B21]">{result.to_new_balance.toLocaleString()}</span>
              </div>
              <button onClick={handleClose} className="mt-3 h-8 px-4 rounded-full text-[11px] font-black bg-[#128C7E] text-white border-none cursor-pointer">Done</button>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="text-[10px] font-black text-[#667781] block mb-1">Child Tenant</label>
                <select
                  value={toTenantId}
                  onChange={(e) => setToTenantId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-3 text-[12px] font-black text-[#111B21] outline-none focus:border-[#128C7E]"
                >
                  <option value="">— select child tenant —</option>
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
                  ))}
                </select>
                {children.length === 0 && (
                  <div className="text-[10px] text-[#F97316] mt-1">No child tenants found under this parent</div>
                )}
              </div>

              <div className="mb-3">
                <label className="text-[10px] font-black text-[#667781] block mb-1">Amount (tokens)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-9 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-3 text-[12px] font-black text-[#111B21] outline-none focus:border-[#128C7E]"
                />
              </div>

              {error && <div className="text-[11px] text-[#EF4444] font-black mb-2">{error}</div>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="h-8 px-4 rounded-full text-[11px] font-black bg-[#128C7E] text-white border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "Transferring…" : "Confirm Allocation"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
