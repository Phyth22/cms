/**
 * masterCardRegistry — Canonical card definitions for the Assets Digital Twin screen.
 */

export type CardAccent = 'teal' | 'green' | 'blue' | 'warning' | 'danger' | 'neutral';

export interface CardDef {
  title:       string;
  sampleValue: string;
  subtitle:    string;
  accent:      CardAccent;
}

export const MASTER_CARD_REGISTRY: Record<string, CardDef> = {
  // ── Asset overview ─────────────────────────────────────────────────────────
  assets_total:          { title: 'Total Assets',         sampleValue: '2,847',       subtitle: 'VEH: 1,240 • PPL: 902 • GDS: 705',     accent: 'teal'    },
  assets_online_offline: { title: 'Online / Offline',     sampleValue: '2,104 / 743', subtitle: '74% live right now',                    accent: 'green'   },
  maintenance_due:       { title: 'Maintenance Due',      sampleValue: '12',          subtitle: '5 overdue > 7 days',                    accent: 'warning' },
  docs_expiring:         { title: 'Docs Expiring',        sampleValue: '23',          subtitle: 'Next 30 days • 7 already expired',      accent: 'warning' },

  // ── Utilisation & VEBA ─────────────────────────────────────────────────────
  utilization:           { title: 'Fleet Utilisation',    sampleValue: '68%',         subtitle: 'Fleet avg • VEBA vehicles: 84%',        accent: 'teal'    },
  veba_bookings_today:   { title: 'VEBA Bookings Today',  sampleValue: '141',         subtitle: 'UGX 8.2M escrow active',                accent: 'green'   },
  escrow_pending:        { title: 'Escrow Pending',       sampleValue: 'UGX 1.24M',  subtitle: '3 items > 72 h overdue',                accent: 'warning' },
  token_burn:            { title: 'Token Burn Rate',      sampleValue: '1.7 T/s',    subtitle: 'Type-A: 1.3 • Type-B: 0.4',            accent: 'blue'    },

  // ── Payments ───────────────────────────────────────────────────────────────
  payments_tx_success:   { title: 'Payment Success Rate', sampleValue: '99.1%',       subtitle: 'Last 24 h • 4,210 transactions',        accent: 'green'   },
  webhook_failures:      { title: 'Webhook Failures',     sampleValue: '14',          subtitle: 'M-Pesa 9 • MTN 5 • Airtel 0',          accent: 'warning' },
  settlement_delay:      { title: 'Settlement Delay',     sampleValue: '1.8 h avg',  subtitle: 'Target < 2 h • SLA met',                accent: 'teal'    },
  chargebacks:           { title: 'Chargebacks',          sampleValue: '2',           subtitle: 'VEBA disputes • 0.05% rate',            accent: 'warning' },

  // ── Reports ────────────────────────────────────────────────────────────────
  export_queue:          { title: 'Export Queue',         sampleValue: '7',           subtitle: '3 scheduled • 4 on-demand',             accent: 'warning' },
  retention_policy:      { title: 'Retention Policy',     sampleValue: '90 days',     subtitle: 'Audit logs: 365 d • Telemetry: 90 d',   accent: 'neutral' },
};
