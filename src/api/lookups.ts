/**
 * Replace these with real API calls (e.g. /api/v1/departments, /api/v1/positions,
 * /api/v1/employees?role=supervisor) once those endpoints are available.
 * Each hook returns { data, isLoading } so it's a drop-in swap for react-query/swr later.
 */
import { useEffect, useState } from "react";

export interface Option {
  id: string;
  label: string;
}

const MOCK_DEPARTMENTS: Option[] = [
  { id: "d1b1f7d0-1111-4a1a-9c1a-000000000001", label: "Engineering" },
  { id: "d1b1f7d0-1111-4a1a-9c1a-000000000002", label: "Human Resources" },
  { id: "d1b1f7d0-1111-4a1a-9c1a-000000000003", label: "Finance" },
  { id: "d1b1f7d0-1111-4a1a-9c1a-000000000004", label: "Payroll" },
];

const MOCK_POSITIONS: Option[] = [
  { id: "p2c2f7d0-2222-4a1a-9c1a-000000000001", label: "Software Engineer I" },
  { id: "p2c2f7d0-2222-4a1a-9c1a-000000000002", label: "Software Engineer II" },
  { id: "p2c2f7d0-2222-4a1a-9c1a-000000000003", label: "Tech Lead" },
  { id: "p2c2f7d0-2222-4a1a-9c1a-000000000004", label: "HR Officer" },
  { id: "p2c2f7d0-2222-4a1a-9c1a-000000000005", label: "Payroll Manager" },
];

const MOCK_SUPERVISORS: Option[] = [
  { id: "s3d3f7d0-3333-4a1a-9c1a-000000000001", label: "Jane Mwangi — Tech Lead" },
  { id: "s3d3f7d0-3333-4a1a-9c1a-000000000002", label: "Peter Otieno — HR Admin" },
  { id: "s3d3f7d0-3333-4a1a-9c1a-000000000003", label: "Amina Yusuf — Finance Manager" },
];

function useMockLookup(data: Option[]) {
  const [state, setState] = useState<{ data: Option[]; isLoading: boolean }>({
    data: [],
    isLoading: true,
  });

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) setState({ data, isLoading: false });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [data]);

  return state;
}

export const useDepartments = () => useMockLookup(MOCK_DEPARTMENTS);
export const usePositions = () => useMockLookup(MOCK_POSITIONS);
export const useSupervisors = () => useMockLookup(MOCK_SUPERVISORS);
