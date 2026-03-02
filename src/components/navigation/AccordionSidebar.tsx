/**
 * AccordionSidebar — Collapsible grouped module navigation
 *
 * Used in the OPS WAR ROOM and similar full CMS pages where the sidebar
 * has multiple expandable section groups with chevron toggles.
 *
 * Different from the flat Sidebar component: this one supports grouped
 * accordion sections with expand/collapse per group.
 */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export interface AccordionNavItem {
  id:     string;
  label:  string;
  path?:  string;
  badge?: string;
}

export interface AccordionNavGroup {
  id:     string;
  title:  string;
  icon?:  string;
  items:  AccordionNavItem[];
}

interface AccordionSidebarProps {
  title?:         string;
  groups:         AccordionNavGroup[];
  defaultOpen?:   string;   // group id open by default
  activeItem?:    string;   // item id to highlight (fallback if no router)
  onSelect?:      (groupId: string, itemId: string) => void;
}

export function AccordionSidebar({
  title = "MENU",
  groups,
  defaultOpen,
  activeItem,
  onSelect,
}: AccordionSidebarProps) {
  const [openGroup, setOpenGroup] = useState<string>(defaultOpen ?? groups[0]?.id ?? "");

  const toggle = (id: string) => setOpenGroup((cur) => (cur === id ? "" : id));

  return (
    <aside
      className="hidden lg:flex flex-col w-[240px] min-h-0 shrink-0 bg-white border-r border-[#E9EDEF] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Module navigation"
    >
      {/* Title */}
      <div className="px-3 pt-3 pb-2 font-black text-[13px] text-[#667781] tracking-wide uppercase">
        {title}
      </div>

      {/* Groups */}
      <nav className="flex flex-col gap-1.5 px-2 pb-3">
        {groups.map((group) => {
          const isOpen = openGroup === group.id;
          return (
            <div
              key={group.id}
              className="border border-[#E9EDEF] rounded-xl bg-white overflow-hidden"
            >
              {/* Group header */}
              <button
                onClick={() => toggle(group.id)}
                aria-expanded={isOpen}
                className="
                  w-full flex items-center justify-between
                  px-3 py-2.5 cursor-pointer
                  bg-[#FBFBFB] hover:bg-[#F5F5F5]
                  transition-colors text-left border-none
                "
              >
                <div className="flex items-center gap-2">
                  {group.icon && <span className="text-[14px]">{group.icon}</span>}
                  <span className="font-extrabold text-[12px] text-[#111B21]">{group.title}</span>
                </div>
                <span
                  className={`text-[#667781] text-[10px] transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* Items */}
              {isOpen && (
                <div className="px-1.5 py-1.5 flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const isActive = activeItem === item.id;
                    const content = (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#25D366] text-white">
                            {item.badge}
                          </span>
                        )}
                      </>
                    );

                    // Use NavLink if path is provided, otherwise plain button
                    if (item.path) {
                      return (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          end={item.path === "/"}
                          onClick={() => onSelect?.(group.id, item.id)}
                          className={({ isActive: routerActive }) =>
                            [
                              "flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px]",
                              "cursor-pointer no-underline transition-colors duration-100",
                              routerActive || isActive
                                ? "bg-[#E9F7F4] text-[#111B21] font-extrabold border border-[#C2E8E1]"
                                : "text-[#111B21] hover:bg-[#F0F7F6]",
                            ].join(" ")
                          }
                        >
                          {content}
                        </NavLink>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect?.(group.id, item.id)}
                        className={[
                          "flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] w-full",
                          "cursor-pointer border-none transition-colors duration-100",
                          isActive
                            ? "bg-[#E9F7F4] text-[#111B21] font-extrabold border border-[#C2E8E1]"
                            : "bg-transparent text-[#111B21] hover:bg-[#F0F7F6]",
                        ].join(" ")}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}