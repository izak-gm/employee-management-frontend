import { useQuery } from "@tanstack/react-query";

import { getActiveEmployees, getEmployeeById } from "../api/employees";
import type { EmployeeResponse } from "../api";

export function useActiveEmployees() {
  return useQuery<EmployeeResponse[]>({
    queryKey: ["active-employees"],
    queryFn: getActiveEmployees,
  });
}
export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });
}
