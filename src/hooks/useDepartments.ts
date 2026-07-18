import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/departments";

import type { DepartmentRequest, DepartmentResponse } from "../api/types";

export function useDepartments() {
  return useQuery<DepartmentResponse[]>({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentRequest) => createDepartment(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentRequest }) =>
      updateDepartment(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["department", variables.id],
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}
