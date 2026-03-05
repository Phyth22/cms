import React, { useState } from "react";
import { topUpWallet } from "../../../api";

interface Props {
  open: boolean;
  onClose: () => void;
  tenantId: string | null;
  tenantName: string;
  onSuccess: () => void;
}

export function TopUpModal({ open, onClose, tenantId, tenantName, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ new_balance: number } | null>(null);

  if (!open) return null;

  function reset() {
    setAmount("");
    setReference("");
    setError(null);
    setResult(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!tenantId) return;
    const num = Number(amount);
    if (!num || num <= 0) { setError("Enter a positive token amount"); return; }
    if (!reference.trim()) { setError("Enter a payment reference"); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await topUpWallet({ tenant_id: tenantId, amount: num, reference: reference.trim() });
      setResult({ new_balance: res.data.new_balance });
      onSuccess();
    } catch (e: any) {
      setError(e?.message ?? "Top-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl w-[420px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9EDEF]">
          <span className="font-black text-[14px] text-[#111B21]">Top-Up Tokens</span>
          <button onClick={handleClose} className="text-[11px] text-[#667781] bg-[#F0F2F5] border border-[#E9EDEF] rounded-lg px-3 py-1.5 cursor-pointer font-black hover:bg-[#E9EDEF]">Close</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <div className="text-[12px] text-[#667781] mb-3">
            Add tokens to <span className="font-black text-[#111B21]">{tenantName}</span>
          </div>

          {result ? (
            <div className="bg-[#EAF7F3] border border-[#25D366] rounded-xl p-4 text-center">
              <div className="text-[14px] font-black text-[#128C7E]">Top-Up Successful</div>
              <div className="text-[12px] text-[#667781] mt-1">New balance: <span className="font-black text-[#111B21]">{result.new_balance.toLocaleString()}</span> tokens</div>
              <button onClick={handleClose} className="mt-3 h-8 px-4 rounded-full text-[11px] font-black bg-[#128C7E] text-white border-none cursor-pointer">Done</button>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="text-[10px] font-black text-[#667781] block mb-1">Amount (tokens)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full h-9 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-3 text-[12px] font-black text-[#111B21] outline-none focus:border-[#128C7E]"
                />
              </div>

              <div className="mb-3">
                <label className="text-[10px] font-black text-[#667781] block mb-1">Payment Reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. INV-2026-0042 or MoMo TXN ID"
                  className="w-full h-9 rounded-lg border border-[#E9EDEF] bg-[#F8FAFC] px-3 text-[12px] font-black text-[#111B21] outline-none focus:border-[#128C7E]"
                />
              </div>

              {error && <div className="text-[11px] text-[#EF4444] font-black mb-2">{error}</div>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="h-8 px-4 rounded-full text-[11px] font-black bg-[#128C7E] text-white border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "Processing…" : "Confirm Top-Up"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
