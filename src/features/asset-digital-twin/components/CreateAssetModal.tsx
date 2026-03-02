/**
 * Create Asset wizard modal.
 */
import React from 'react';
import type { AssetClass, PayoutProvider } from './types';
import { COLORS, btn, btnPrimary, btnBlue } from './types';
import { Pill, SectionTitle } from './MetricCard';

const s = {
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.45)', display: 'grid', placeItems: 'center', zIndex: 80 },
  modal:   { width: 980, maxWidth: '92vw', height: 720, maxHeight: '86vh', background: '#fff', borderRadius: 14, border: `1px solid ${COLORS.border}`, boxShadow: '0 14px 44px rgba(0,0,0,0.24)', overflow: 'hidden', display: 'flex', flexDirection: 'column' as const },
  header:  { height: 56, background: '#F8F9FA', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', gap: 10 },
  body:    { padding: 16, overflowY: 'auto' as const, flex: 1 },
  card:    { background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14 },
  grid:    { display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, marginTop: 12 },
  label:   { fontSize: 12, color: COLORS.muted },
  input:   { height: 30, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: '#F8F9FA', padding: '0 10px', fontSize: 12, minWidth: 240 },
  select:  { height: 30, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: '#F8F9FA', padding: '0 10px', fontWeight: 800, fontSize: 12, color: COLORS.text },
  actions: { display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' as const },
};

interface CreateAssetModalProps {
  open:     boolean;
  tenant:   string;
  onClose:  () => void;
  onCreate: (payload: unknown) => void;
}

export function CreateAssetModal({ open, tenant, onClose, onCreate }: CreateAssetModalProps) {
  if (!open) return null;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontWeight: 1000 }}>Create Asset (Digital Twin) — Wizard</div>
            <Pill bg={COLORS.warning} fg="#fff">HITL required</Pill>
          </div>
          <button style={btn} onClick={onClose}>✕ Close</button>
        </div>

        <div style={{ padding: 10, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['1 Identity', '2 Link', '3 Tokens', '4 VEBA+Pay', '5 Review'].map((step, i) => (
            <Pill key={step} bg={i === 0 ? '#E8F5F3' : '#fff'} fg={i === 0 ? COLORS.tealDark : COLORS.muted}>{step}</Pill>
          ))}
        </div>

        <div style={s.body}>
          {/* Step 1: Identity */}
          <div style={s.card}>
            <SectionTitle title="Identity" subtitle="Asset name + class + tags + ownership (RBAC scoped)" />
            <div style={s.grid}>
              <div style={s.label}>Asset Name</div>
              <input style={s.input} defaultValue="" placeholder="e.g., KLA-TRUCK-014" />
              <div style={s.label}>Class</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['VEH', 'PPL', 'GDS'] as AssetClass[]).map((c) => (
                  <Pill key={c} bg={c === 'VEH' ? '#E8F5F3' : '#fff'} fg={c === 'VEH' ? COLORS.tealDark : COLORS.muted}>{c}</Pill>
                ))}
              </div>
              <div style={s.label}>Tags</div>
              <input style={s.input} defaultValue="construction, tepu, heavy" />
              <div style={s.label}>Owner Account</div>
              <input style={s.input} defaultValue="Dealer → Client → Org (RBAC scoped)" />
            </div>
            <div style={s.actions}>
              <button style={{ ...btn, ...btnBlue }}>Upload KYC/Insurance</button>
              <button style={btn}>Expiry rules</button>
            </div>
          </div>

          {/* Step 2: Link */}
          <div style={{ ...s.card, marginTop: 14 }}>
            <SectionTitle title="Link Device & SIM" subtitle="No cross-tenant linking allowed (hard rule)" />
            <div style={s.grid}>
              <div style={s.label}>IMEI</div>
              <input style={s.input} placeholder="Scan / paste IMEI" />
              <div style={s.label}>ICCID</div>
              <input style={s.input} placeholder="Auto-fetch from Telco API" />
              <div style={s.label}>APN Profile</div>
              <select style={s.select}>
                <option>mtn.private.apn</option>
                <option>airtel.private.apn</option>
              </select>
            </div>
            <div style={s.actions}>
              <button style={{ ...btn, ...btnPrimary }}>Validate Mapping</button>
              <button style={btn}>Save Draft</button>
              <button style={{ ...btn, ...btnBlue }}>Test Data</button>
            </div>
          </div>

          {/* Step 3: Tokens */}
          <div style={{ ...s.card, marginTop: 14 }}>
            <SectionTitle title="Tokens & Metering (US‑03)" subtitle="Token types + plan + safeguards" />
            <div style={s.grid}>
              <div style={s.label}>Token Type</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Pill bg="#E8F5F3" fg={COLORS.tealDark}>Type‑A (Telematics)</Pill>
                <Pill bg="#E6F4FE" fg="#0B4F6C">Type‑B (Rental)</Pill>
              </div>
              <div style={s.label}>Plan</div>
              <input style={s.input} defaultValue="OLIWA‑PLUS • FIFO queue enabled" />
              <div style={s.label}>Safeguards</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Pill bg="#fff" fg={COLORS.muted}>Daily cap</Pill>
                <Pill bg="#fff" fg={COLORS.muted}>80% soft alert</Pill>
                <Pill bg="#fff" fg={COLORS.muted}>Lock on critical</Pill>
              </div>
              <div style={s.label}>Top‑up</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['M-Pesa', 'MTN MoMo', 'Airtel Money', 'Card/Pay'] as PayoutProvider[]).map((p) => (
                  <Pill key={p} bg={p === 'Card/Pay' ? COLORS.blue : COLORS.green} fg={p === 'Card/Pay' ? '#fff' : COLORS.tealDark}>{p}</Pill>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: VEBA + Payments */}
          <div style={{ ...s.card, marginTop: 14 }}>
            <SectionTitle title="VEBA + Payments" subtitle="Marketplace listing + escrow + mobile money payouts" />
            <div style={s.grid}>
              <div style={s.label}>Enable Listing</div>
              <select style={s.select}><option>Listing: ON</option><option>Listing: OFF</option></select>
              <div style={s.label}>Rate</div>
              <input style={s.input} placeholder="UGX / day" />
              <div style={s.label}>Escrow policy</div>
              <Pill bg={COLORS.blue} fg="#fff">Model 1: Hirer → VEBA escrow</Pill>
              <div style={s.label}>Payout wallet</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select style={s.select}><option>MTN MoMo</option><option>Airtel Money</option><option>M-Pesa</option></select>
                <input style={{ ...s.input, minWidth: 260 }} defaultValue="+256 77••• 902" />
              </div>
              <div style={s.label}>Leakage guard</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Pill bg="#fff" fg={COLORS.muted}>Contact gating</Pill>
                <Pill bg="#fff" fg={COLORS.muted}>Waswa monitor</Pill>
              </div>
            </div>
          </div>

          {/* Step 5: Review */}
          <div style={{ ...s.card, marginTop: 14, background: '#FFF5F5', borderColor: '#FFD6D6' }}>
            <SectionTitle title="Review & Create (HIC)" subtitle="Confirm RBAC scope + audit logging" />
            <div style={s.actions}>
              <button style={{ ...btn, ...btnPrimary }} onClick={() => onCreate({ tenant })}>Create Asset</button>
              <button style={{ ...btn, ...btnBlue }} onClick={() => onCreate({ tenant, veba: true })}>Create + Enable VEBA</button>
              <button style={{ ...btn, background: COLORS.warning, borderColor: COLORS.warning, color: '#fff' }}>Require Approval</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
