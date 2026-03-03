/**
 * simcards.types.ts — Types and interfaces for the SIM cards API.
 */

// ── Create SIM ───────────────────────────────────────────────────────────────

export interface CreateSimCardRequest {
  telecom:              string;
  simcard_number:       string;
  simcard_owner:        string;
  simcard_owner_parent: string;
}

export interface CreateSimCardResponse {
  simcard_uid: string;
}

// ── SIM card record (from GET /devices/simcards/all) ─────────────────────────

export interface SimCard {
  date_created:   string;
  simcard_number: string;
  simcard_status: string;
  simcard_uid:    string;
  telecom:        string;
}
