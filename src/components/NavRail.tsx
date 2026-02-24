/**
 * NavRail — Primary Side Navigation Bar
 * Uses react-router-dom NavLink for URL-driven active state.
 */
import React from "react";
import { NavLink } from "react-router-dom";

export interface NavRailItem { key: string; glyph: string; label: string; path?: string; }
interface NavRailProps { items?: NavRailItem[]; }

const DEFAULT_ITEMS: NavRailItem[] = [
  { key: "home",       glyph: "⌂",  label: "Home",            path: "/"           },
  { key: "noc-bridge", glyph: "⛑",  label: "NOC Bridge",      path: "/noc-bridge" },
  { key: "alarms",     glyph: "!",  label: "Alarms",           path: "/alarms"     },
  { key: "tokens",     glyph: "T",  label: "Tokens",           path: "/tokens"     },
  { key: "billing",    glyph: "₿",  label: "Billing",          path: "/billing"    },
  { key: "payments",   glyph: "$",  label: "Payments",         path: "/payments"   },
  { key: "veba",       glyph: "V",  label: "VEBA",             path: "/veba"       },
  { key: "ai",         glyph: "W",  label: "AI",               path: "/ai"         },
  { key: "rbac",       glyph: "R",  label: "RBAC",             path: "/rbac"       },
  { key: "audit",      glyph: "A",  label: "Audit",            path: "/audit"      },
];

export function NavRail({ items = DEFAULT_ITEMS }: NavRailProps) {
  return (
    <>
      {/* Desktop vertical rail */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex flex-col gap-2 w-[60px] bg-white border-r border-[#E9EDEF] px-[10px] py-3 shrink-0 overflow-y-auto"
      >
        {items.map((item) => <RailLink key={item.key} item={item} />)}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Primary navigation"
        className="flex md:hidden flex-row items-center justify-around fixed bottom-0 left-0 right-0 h-14 z-[200] overflow-x-auto bg-white border-t border-[#E9EDEF] px-2 gap-1"
      >
        {items.map((item) => <RailLink key={item.key} item={item} mobile />)}
      </nav>
    </>
  );
}

function RailLink({ item, mobile = false }: { item: NavRailItem; mobile?: boolean }) {
  const to = item.path ?? `/${item.key}`;
  return (
    <NavLink
      to={to}
      end={to === "/"}
      title={item.label}
      aria-label={item.label}
      className={({ isActive }) =>
        [
          mobile ? "w-10 h-10" : "w-9 h-9",
          "rounded-[10px] border font-bold text-[14px] grid place-items-center",
          "cursor-pointer shrink-0 no-underline transition-colors duration-150",
          isActive
            ? "bg-[#128C7E] text-white border-transparent"
            : "bg-[#EEF3F4] text-[#667781] border-[#E9EDEF] hover:bg-[#DCF1EE]",
        ].join(" ")
      }
    >
      {item.glyph}
    </NavLink>
  );
}