import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "../api/employees";
import type { UpdateEmployee } from "../api";
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


export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployee }) =>
      updateEmployee(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["active-employees"] });
    },
  });
}