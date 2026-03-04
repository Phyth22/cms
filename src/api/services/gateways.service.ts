import { get, post } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { RequestOptions } from "../types";
import type {
  GatewaysResponse,
  GatewayHistoryResponse,
  UpdateGatewayRequest,
  UpdateGatewayResponse,
} from "../types";

export function getMobileMoneyGateways(
  opts?: RequestOptions,
): Promise<GatewaysResponse> {
  return get<GatewaysResponse>(ENDPOINTS.GATEWAYS.MOBILE_MONEY, opts).then(res => res.data);
}

export function getGatewayHistory(
  telecomName: string,
  opts?: RequestOptions,
): Promise<GatewayHistoryResponse> {
  const encoded = encodeURIComponent(telecomName);
  return get<GatewayHistoryResponse>(
    `${ENDPOINTS.GATEWAYS.MOBILE_MONEY_BY}/${encoded}`,
    opts,
  ).then(res => res.data);
}

export function updateGatewayStatus(
  payload: UpdateGatewayRequest,
  opts?: RequestOptions,
): Promise<UpdateGatewayResponse> {
  return post<UpdateGatewayResponse>(
    ENDPOINTS.GATEWAYS.UPDATE,
    payload,
    opts,
  ).then(res => res.data);
}
