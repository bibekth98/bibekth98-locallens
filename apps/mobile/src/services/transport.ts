import client from './api/client';

export interface TripParams {
  originId: string;
  destinationId: string;
  depArrMacro?: string;
  itdDate?: string;
  itdTime?: string;
}

export interface TripResponse {
  trip: unknown;
}

export interface DeparturesResponse {
  departures: unknown;
}

export interface AlertsResponse {
  alerts: unknown;
}

export async function planTrip(params: TripParams): Promise<unknown> {
  const query = new URLSearchParams({ originId: params.originId, destinationId: params.destinationId });
  if (params.depArrMacro) query.set('depArrMacro', params.depArrMacro);
  if (params.itdDate) query.set('itdDate', params.itdDate);
  if (params.itdTime) query.set('itdTime', params.itdTime);
  const data = await client.get<TripResponse>(`/v1/transport/trip?${query.toString()}`);
  return data.trip;
}

export async function fetchDepartures(stopId: string, limit = 10): Promise<unknown> {
  const data = await client.get<DeparturesResponse>(`/v1/transport/departures?stopId=${encodeURIComponent(stopId)}&limit=${limit}`);
  return data.departures;
}

export async function fetchAlerts(): Promise<unknown> {
  const data = await client.get<AlertsResponse>('/v1/transport/alerts');
  return data.alerts;
}
