/**
 * Placeholder — Generic "under construction" page for unbuilt modules.
 */
import React from "react";

interface PlaceholderProps {
  title: string;
  icon: string;
  description?: string;
}

export function Placeholder({ title, icon, description }: PlaceholderProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#F0F2F5] p-8 min-h-0">
      <span className="text-[56px] opacity-30">{icon}</span>
      <h2 className="text-[22px] font-black text-[#111B21] m-0">{title}</h2>
      <p className="text-[13px] text-[#667781] m-0">
        {description ?? "This module is under construction. Replace this component with the real page."}
      </p>
    </div>
  );
}
