/**
 * Shared types and colour tokens for the Assets Digital Twin feature.
 */

export type AssetClass     = 'VEH' | 'PPL' | 'GDS';
export type AssetStatus    = 'Online' | 'Warn' | 'Alarm' | 'Crit' | 'Offline';
export type PayoutProvider = 'MTN MoMo' | 'Airtel Money' | 'M-Pesa' | 'Card/Pay';

export interface Asset {
  id:          string;
  displayName: string;
  assetClass:  AssetClass;
  linked:      string;
  sim:         string;
  lastSeen:    string;
  status:      AssetStatus;
  safety:      string;
  tokensAB:    string;
  veba:        'Listed' | 'Off' | 'N/A';
  wallet:      string;
  country:     string;
  risk:        'Low' | 'Med' | 'High';
  ownerOrg:    string;
}

export const COLORS = {
  tealDark: '#075E54',
  teal:     '#128C7E',
  green:    '#25D366',
  blue:     '#34B7F1',
  bg:       '#F0F2F5',
  card:     '#FFFFFF',
  text:     '#111B21',
  muted:    '#667781',
  border:   '#E9EDEF',
  warning:  '#FB8C00',
  danger:   '#E53935',
} as const;

export const btn: React.CSSProperties = {
  borderRadius: 999, padding: '8px 12px',
  border: `1px solid ${COLORS.border}`, background: '#F8F9FA',
  cursor: 'pointer', fontWeight: 900, fontSize: 12,
};
export const btnPrimary: React.CSSProperties = { background: COLORS.green, borderColor: COLORS.green, color: COLORS.tealDark };
export const btnBlue:    React.CSSProperties = { background: COLORS.blue,  borderColor: COLORS.blue,  color: '#fff' };
