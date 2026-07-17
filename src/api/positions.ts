/**
 * api/positions.ts
 * Endpoints:
 *   GET    /api/v1/positions       — list all positions
 *   GET    /api/v1/positions/{id}  — get position by ID
 *   POST   /api/v1/positions       — create a position
 *   PUT    /api/v1/positions/{id}  — update a position
 *   DELETE /api/v1/positions/{id}  — delete a position (returns 200 with no body)
 */

import apiClient from "./client";
import type { PositionRequest, PositionResponse } from "./types";

/** Fetch all positions. */
export async function getAllPositions(): Promise<PositionResponse[]> {
  const { data } = await apiClient.get<PositionResponse[]>("/api/v1/positions");
  return data;
}

/** Fetch a single position by UUID. */
export async function getPositionById(id: string): Promise<PositionResponse> {
  const { data } = await apiClient.get<PositionResponse>(`/api/v1/positions/${id}`);
  return data;
}

/** Create a new position. */
export async function createPosition(payload: PositionRequest): Promise<PositionResponse> {
  const { data } = await apiClient.post<PositionResponse>("/api/v1/positions", payload);
  return data;
}

/** Update an existing position by UUID. */
export async function updatePosition(
  id: string,
  payload: PositionRequest
): Promise<PositionResponse> {
  const { data } = await apiClient.put<PositionResponse>(`/api/v1/positions/${id}`, payload);
  return data;
}

/** Delete a position by UUID. */
export async function deletePosition(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/positions/${id}`);
}
