/**
 * hooks/usePayrollProfile.ts
 * Employee payroll profile — salary, bank details, KRA PIN, NSSF/SHIF numbers.
 */

import { useCallback, useEffect, useState } from "react";
import {
  createPayrollProfile,
  updatePayrollProfile,
  deactivatePayrollProfile,
  getPayrollProfileByEmployee,
  ApiError,
} from "../api";
import type { PayrollProfileRequest, PayrollProfileResponse } from "../api/types/payroll";

// ── usePayrollProfile — fetch active profile for an employee ──────────────────

export function usePayrollProfile(employeeId: string | null) {
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
      // 404 is expected if no profile exists yet — not a hard error
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
