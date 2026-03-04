export interface Gateway {
  id: number;
  name: string;
  status: "OK" | "DEGRADED" | "DOWN" | "MAINTENANCE";
  meta: string;
  sev: "green" | "alarm" | "critical";
  updated_at: string;
}

export interface GatewaysResponse {
  gateways: Gateway[];
  total_count: number;
  timestamp: string;
}

export interface GatewayHistoryEntry {
  id: number;
  telecom: string;
  api_status: "OK" | "DEGRADED" | "DOWN" | "MAINTENANCE";
  message: string;
  is_current_message: boolean;
  created_at: string;
  updated_at: string;
}

export interface GatewayHistoryResponse {
  gateway_name: string;
  current_status: GatewayHistoryEntry;
  history: GatewayHistoryEntry[];
  timestamp: string;
}

export interface UpdateGatewayRequest {
  telecom: string;
  api_status: "OK" | "DEGRADED" | "DOWN" | "MAINTENANCE";
  message?: string;
}

export interface UpdateGatewayResponse {
  id: number;
  telecom: string;
  api_status: string;
  message: string;
  created_at: string;
}
