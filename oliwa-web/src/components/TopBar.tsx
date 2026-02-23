/**
 * TopBar — Primary Navigation Bar
 *
 * Renders the application header containing the brand identity, global
 * search input, and the current user's RBAC role badges and avatar.
 */
import React from "react";

interface TopBarProps {
  /** Brand / product name shown in the header. */
  brandName?: string;
  /** Page-level title appended after the brand name. */
  pageTitle?: string;
  /** Placeholder text for the global search field. */
  searchPlaceholder?: string;
  /** RBAC role chips to display (e.g. ["SYSADMIN", "can-spend"]). */
  roles?: { label: string; variant: "teal" | "azure" | "green" }[];
  /** Single initial shown inside the avatar circle. */
  avatarInitial?: string;
  /** Short identity string shown next to the avatar. */
  whoLabel?: string;
}

export function TopBar({
  brandName = "NAVAS v26",
  pageTitle = "NOC Bridge — System Health CMS",
  searchPlaceholder = "Search tenants, units, tokens, incidents…",
  roles = [
    { label: "SYSADMIN", variant: "teal" },
    { label: "can-spend", variant: "azure" },
  ],
  avatarInitial = "T",
  whoLabel = "Tim • Kampala",
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandName">{brandName}</span>
        <span className="dot">•</span>
        <span className="pageTitle">{pageTitle}</span>
      </div>

      <div className="search">
        <input placeholder={searchPlaceholder} />
      </div>

      <div className="rbac">
        {roles.map((r) => (
          <span key={r.label} className={`pill ${r.variant}`}>
            {r.label}
          </span>
        ))}
        <div className="avatar">{avatarInitial}</div>
        <div className="who">{whoLabel}</div>
      </div>
    </header>
  );
}
