/**
 * WaswaDrawer — Waswa AI Co-Pilot Chat Drawer
 *
 * Slides in from the right as an overlay when opened.
 * Matches screenshot exactly:
 *   Header: "Waswa AI • Co-Pilot Chat" + ON/OFF toggle
 *   Chat messages: AI (left, white bubble) + User (right, green bubble)
 *   Quick action chips: Open Approvals, Enable Smart Caps, Top-up Tokens, Leakage Report, Run Reconcile
 *   Footer: input + send button
 *
 * Different from WaswaAIPanel (which is a persistent right panel in the layout).
 * This is a floating overlay drawer triggered by the floating W button.
 *
 * All styles: Tailwind utility classes only.
 */
import React, { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id:     string;
  role:   "ai" | "user";
  text:   string;
}

interface WaswaDrawerProps {
  open:     boolean;
  onClose:  () => void;
  waswaOn?: boolean;
  onToggleWaswa?: () => void;
  quickActions?: { id: string; label: string; onClick?: () => void }[];
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  { id: "m1", role: "ai",   text: "Morning Tim. I detected 2.1× VEBA leakage attempts (Boda, Nairobi)." },
  { id: "m2", role: "ai",   text: "Suggested: increase Lead-Unlock fee +1.5 T and enable contact masking until escrow paid." },
  { id: "m3", role: "user", text: "Show top offenders (tenant scoped) and open HITL approval." },
  { id: "m4", role: "ai",   text: "Done. 12 users flagged. 3 require HIC review due to repeat bypass + disputes." },
  { id: "m5", role: "ai",   text: "Also: Token burn spike driver = DASHCAM retrieval + maps. Want smart caps?" },
];

const DEFAULT_QUICK_ACTIONS = [
  { id: "approvals",  label: "Open Approvals"     },
  { id: "smartcaps",  label: "Enable Smart Caps"  },
  { id: "topup",      label: "Top-up Tokens"      },
  { id: "leakage",    label: "Leakage Report"     },
  { id: "reconcile",  label: "Run Reconcile"      },
];

export function WaswaDrawer({
  open,
  onClose,
  waswaOn       = true,
  onToggleWaswa,
  quickActions  = DEFAULT_QUICK_ACTIONS,
}: WaswaDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [input,    setInput]    = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newId = `m${Date.now()}`;
    setMessages((prev) => [...prev, { id: newId, role: "user", text }]);
    setInput("");
    // Simulate AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `${newId}-reply`, role: "ai", text: "Understood. Processing your request now…" },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[299] bg-black/20"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-[300]
          w-full max-w-[400px]
          bg-white border-l border-[#E9EDEF]
          flex flex-col
          shadow-[−8px_0_40px_rgba(0,0,0,0.15)]
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#075E54] text-white shrink-0">
          <div className="font-black text-[14px]">Waswa AI • Co-Pilot Chat</div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleWaswa}
              aria-pressed={waswaOn}
              className={`
                h-7 min-w-[44px] px-3 rounded-full border-none text-[11px] font-black
                cursor-pointer transition-all
                ${waswaOn ? "bg-[#25D366] text-white" : "bg-white/20 text-white/60"}
              `}
            >
              {waswaOn ? "ON" : "OFF"}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors grid place-items-center text-white border-none cursor-pointer text-[14px]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 px-4 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed
                  ${msg.role === "user"
                    ? "bg-[#25D366] text-white rounded-br-sm"
                    : "bg-[#F0F2F5] text-[#111B21] rounded-bl-sm"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick action chips */}
        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0 border-t border-[#E9EDEF] pt-3">
          <div className="text-[10px] font-extrabold text-[#667781] uppercase tracking-wide w-full mb-1">
            Quick actions
          </div>
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={a.onClick}
              className="h-8 px-3 rounded-full text-[11px] font-extrabold border border-[#E9EDEF] bg-white text-[#111B21] cursor-pointer hover:bg-[#F0F2F5] transition-colors whitespace-nowrap"
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Chat input */}
        <div className="flex gap-2 px-4 py-3 border-t border-[#E9EDEF] shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI… e.g., 'Show MoMo failures by provider'"
            className="
              flex-1 min-w-0 h-10 rounded-xl border border-[#E9EDEF]
              bg-[#F8F9FA] px-3 text-[12px] outline-none
              focus:border-[#128C7E] transition-colors
            "
          />
          <button
            onClick={handleSend}
            className="
              w-10 h-10 rounded-xl border-none shrink-0
              bg-[#25D366] text-[#075E54] font-black text-[14px]
              cursor-pointer hover:brightness-105 active:opacity-85 transition-all
              grid place-items-center
            "
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
