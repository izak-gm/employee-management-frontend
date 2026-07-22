/**
 * hooks/useDeductionTypes.ts
 * Deduction type catalogue — admin CRUD + active list for dropdowns.
 */

import { useCallback, useEffect, useState } from "react";
import {
  getAllDeductionTypes,
  getActiveDeductionTypes,
  createDeductionType,
  updateDeductionType,
  deactivateDeductionType,
  activateDeductionType,
  ApiError,
} from "../api";
import type { DeductionTypeRequest, DeductionTypeResponse } from "../api/types/payroll";

// ── useDeductionTypes — list, toggle activeOnly for dropdown vs admin view ────

export function useDeductionTypes(activeOnly: boolean = false) {
  const [data, setData] = useState<DeductionTypeResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = activeOnly ? await getActiveDeductionTypes() : await getAllDeductionTypes();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load deduction types");
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── useDeductionTypeActions — create, update, activate, deactivate ────────────

export function useDeductionTypeActions() {
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: DeductionTypeRequest): Promise<DeductionTypeResponse | null> => {
      setSaving(true);
      setError(null);
      try {
        return await createDeductionType(payload);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to create deduction type");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: string, payload: DeductionTypeRequest): Promise<DeductionTypeResponse | null> => {
      setSaving(true);
      setError(null);
      try {
        return await updateDeductionType(id, payload);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to update deduction type");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const deactivate = useCallback(async (id: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await deactivateDeductionType(id);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to deactivate deduction type");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const activate = useCallback(async (id: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await activateDeductionType(id);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to activate deduction type");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    create,
    update,
    deactivate,
    activate,
    isSaving,
    error,
    clearError: () => setError(null),
  };
}
