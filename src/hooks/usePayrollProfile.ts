/**
 * hooks/usePayrollProfile.ts
 * Employee payroll profile — salary, bank details, KRA PIN, NSSF/SHIF numbers.
 */

import { useCallback, useEffect, useState } from "react";
import {
  createPayrollProfile,
  updatePayrollProfile,
  deactivatePayrollProfile,
  getPayrollProfileById,
  getPayrollProfileByEmployee,
  getAllPayrollProfiles,
  ApiError,
} from "../api";
import type { PayrollProfileRequest, PayrollProfileResponse } from "../api/types/payroll";

// ── usePayrollProfile — fetch a single profile by profile ID ───────────────────

export function usePayrollProfile(profileId: string | null) {
  const [data, setData] = useState<PayrollProfileResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getPayrollProfileById(profileId);
      setData(result);
    } catch (err) {
      // 404 is expected if the profile doesn't exist — not a hard error
      if (err instanceof ApiError && err.isNotFound) {
        setData(null);
      } else {
        setError(err instanceof ApiError ? err.message : "Failed to load payroll profile");
      }
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload, hasProfile: data !== null };
}

// ── usePayrollProfileByEmployee — fetch active profile for an employee ─────────
// Kept for cases where only an employeeId is available (e.g. employee self-view).

export function usePayrollProfileByEmployee(employeeId: string | null) {
  const [data, setData] = useState<PayrollProfileResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getPayrollProfileByEmployee(employeeId);
      setData(result);
    } catch (err) {
      if (err instanceof ApiError && err.isNotFound) {
        setData(null);
      } else {
        setError(err instanceof ApiError ? err.message : "Failed to load payroll profile");
      }
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload, hasProfile: data !== null };
}

// ── usePayrollProfileList — fetch all payroll profiles (data grid) ─────────────

export function usePayrollProfileList() {
  const [data, setData] = useState<PayrollProfileResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllPayrollProfiles();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load payroll profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── usePayrollProfileActions — create, update, deactivate ─────────────────────

export function usePayrollProfileActions() {
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: PayrollProfileRequest): Promise<PayrollProfileResponse | null> => {
      setSaving(true);
      setError(null);
      try {
        return await createPayrollProfile(payload);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to create payroll profile");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      profileId: string,
      payload: PayrollProfileRequest,
    ): Promise<PayrollProfileResponse | null> => {
      setSaving(true);
      setError(null);
      try {
        return await updatePayrollProfile(profileId, payload);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to update payroll profile");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const deactivate = useCallback(async (profileId: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await deactivatePayrollProfile(profileId);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to deactivate payroll profile");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { create, update, deactivate, isSaving, error, clearError: () => setError(null) };
}
