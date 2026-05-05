import axios from 'axios';
import Env from '../config/env';

const client = axios.create({
  baseURL: Env.TRANSPORT_NSW_BASE_URL,
  timeout: 15_000,
  headers: {
    apikey: Env.TRANSPORT_NSW_API_KEY,
  },
});

export interface TripParams {
  originId: string;
  destinationId: string;
  depArrMacro?: string;
  itdDate?: string;
  itdTime?: string;
}

export interface DeparturesParams {
  stopId: string;
  limit?: number;
}

export async function planTrip(params: TripParams): Promise<unknown> {
  const result = await client.get('/trip', { params });
  return result.data;
}

export async function getDepartures(params: DeparturesParams): Promise<unknown> {
  const result = await client.get('/departures/stopevents', {
    params: { stopId: params.stopId, limit: params.limit },
  });
  return result.data;
}

export async function getAlerts(): Promise<unknown> {
  const result = await client.get('/gtfs/alerts');
  return result.data;
}
