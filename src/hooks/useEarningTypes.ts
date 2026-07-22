/**
 * hooks/useEarningTypes.ts
 * Earning type catalogue — admin CRUD + active list for dropdowns.
 */

import { useCallback, useEffect, useState } from "react";
import {
  getAllEarningTypes,
  getActiveEarningTypes,
  createEarningType,
  updateEarningType,
  deactivateEarningType,
  activateEarningType,
  ApiError,
} from "../api";
import type { EarningTypeRequest, EarningTypeResponse } from "../api/types/payroll";

// ── useEarningTypes — list, toggle activeOnly for dropdown vs admin view ──────

export function useEarningTypes(activeOnly: boolean = false) {
  const [data, setData] = useState<EarningTypeResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = activeOnly ? await getActiveEarningTypes() : await getAllEarningTypes();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load earning types");
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── useEarningTypeActions — create, update, activate, deactivate ──────────────

export function useEarningTypeActions() {
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: EarningTypeRequest): Promise<EarningTypeResponse | null> => {
      setSaving(true);
      setError(null);
      try {
        return await createEarningType(payload);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to create earning type");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: string, payload: EarningTypeRequest): Promise<EarningTypeResponse | null> => {
      setSaving(true);
      setError(null);
      try {
        return await updateEarningType(id, payload);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to update earning type");
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
      await deactivateEarningType(id);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to deactivate earning type");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const activate = useCallback(async (id: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await activateEarningType(id);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to activate earning type");
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
