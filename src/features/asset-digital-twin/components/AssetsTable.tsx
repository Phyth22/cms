/**
 * Searchable / filterable assets registry table.
 */
import React, { useMemo, useState } from 'react';
import type { Asset, AssetClass, AssetStatus } from './types';
import { COLORS, btn, btnPrimary, btnBlue } from './types';
import { Dot, Pill } from './MetricCard';

const s = {
  wrap:    { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, marginTop: 16 },
  top:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const },
  title:   { fontWeight: 1000, fontSize: 14 },
  sub:     { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  filters: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const },
  input:   { height: 30, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: '#F8F9FA', padding: '0 10px', fontSize: 12, minWidth: 240 },
  select:  { height: 30, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: '#F8F9FA', padding: '0 10px', fontWeight: 800, fontSize: 12, color: COLORS.text },
  table:   { width: '100%', borderCollapse: 'separate' as const, borderSpacing: 0, marginTop: 12 },
  th:      { textAlign: 'left' as const, fontSize: 12, color: COLORS.tealDark, background: '#F0FBF9', padding: '10px', borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` },
  td:      { padding: '10px', fontSize: 12, borderBottom: `1px solid ${COLORS.border}` },
};

const statusColor = (s: AssetStatus) =>
  ({ Online: COLORS.green, Warn: COLORS.warning, Alarm: '#F97316', Crit: COLORS.danger } as Record<string, string>)[s] ?? COLORS.muted;

interface AssetsTableProps {
  assets:        Asset[];
  onSelectAsset: (id: string) => void;
  onCreateAsset: () => void;
}

export function AssetsTable({ assets, onSelectAsset, onCreateAsset }: AssetsTableProps) {
  const [search,       setSearch]       = useState('');
  const [classFilter,  setClassFilter]  = useState<'All' | AssetClass>('All');
  const [statusFilter, setStatusFilter] = useState<'Any' | AssetStatus>('Any');
  const [vebaFilter,   setVebaFilter]   = useState<'Any' | 'Listed' | 'Off' | 'N/A'>('Any');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) =>
      (!q || a.id.toLowerCase().includes(q) || a.linked.toLowerCase().includes(q) || a.sim.toLowerCase().includes(q)) &&
      (classFilter  === 'All' || a.assetClass === classFilter) &&
      (statusFilter === 'Any' || a.status     === statusFilter) &&
      (vebaFilter   === 'Any' || a.veba       === vebaFilter)
    );
  }, [assets, search, classFilter, statusFilter, vebaFilter]);

  return (
    <div style={s.wrap}>
      <div style={s.top}>
        <div>
          <div style={s.title}>Assets Registry</div>
          <div style={s.sub}>Vehicles • People • Goods in Transit — strict tenant isolation</div>
        </div>
        <div style={s.filters}>
          <input style={s.input} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search: VIN / IMEI / Name" />

          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value as 'All' | AssetClass)} style={s.select}>
            <option value="All">Class: All</option>
            <option value="VEH">VEH</option>
            <option value="PPL">PPL</option>
            <option value="GDS">GDS</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'Any' | AssetStatus)} style={s.select}>
            <option value="Any">Status: Any</option>
            <option value="Online">Online</option>
            <option value="Warn">Warn</option>
            <option value="Alarm">Alarm</option>
            <option value="Crit">Crit</option>
            <option value="Offline">Offline</option>
          </select>

          <select value={vebaFilter} onChange={(e) => setVebaFilter(e.target.value as typeof vebaFilter)} style={s.select}>
            <option value="Any">VEBA: Any</option>
            <option value="Listed">Listed</option>
            <option value="Off">Off</option>
            <option value="N/A">N/A</option>
          </select>

          <button style={{ ...btn, ...btnPrimary }} onClick={onCreateAsset}>+ New Asset</button>
          <button style={{ ...btn, ...btnBlue }} onClick={() => console.log('bulk import')}>Bulk Import</button>
        </div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            {['Asset', 'Class', 'Linked', 'SIM', 'Last Seen', 'Status', 'Safety', 'Tokens A/B', 'VEBA', 'Wallet'].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, i) => (
            <tr key={a.id} style={{ cursor: 'pointer', background: i % 2 === 0 ? '#fff' : '#FBFCFD' }} onClick={() => onSelectAsset(a.id)}>
              <td style={{ ...s.td, fontWeight: 900 }}>{a.displayName}</td>
              <td style={s.td}>
                <Pill bg={a.assetClass === 'VEH' ? '#E8F5F3' : a.assetClass === 'GDS' ? '#E6F4FE' : '#FFF3E0'} fg={COLORS.tealDark}>
                  {a.assetClass}
                </Pill>
              </td>
              <td style={s.td}>{a.linked}</td>
              <td style={s.td}>{a.sim}</td>
              <td style={{ ...s.td, color: COLORS.muted }}>{a.lastSeen}</td>
              <td style={s.td}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Dot color={statusColor(a.status)} />
                  <span style={{ fontWeight: 900 }}>{a.status}</span>
                </span>
              </td>
              <td style={{ ...s.td, fontWeight: 900 }}>{a.safety}</td>
              <td style={s.td}>{a.tokensAB}</td>
              <td style={s.td}>
                <Pill bg={a.veba === 'Listed' ? '#E8F5F3' : '#F8F9FA'} fg={a.veba === 'Listed' ? COLORS.tealDark : COLORS.muted}>
                  {a.veba}
                </Pill>
              </td>
              <td style={s.td}>{a.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
