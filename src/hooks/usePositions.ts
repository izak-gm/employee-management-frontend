import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
} from "../api/positions";

import type { PositionRequest, PositionResponse } from "../api/types";

export function usePositions() {
  return useQuery<PositionResponse[]>({
    queryKey: ["positions"],
    queryFn: getAllPositions,
  });
}

export function usePosition(id: string) {
  return useQuery({
    queryKey: ["position", id],
    queryFn: () => getPositionById(id),
    enabled: !!id,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PositionRequest) => createPosition(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PositionRequest }) => updatePosition(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["position", variables.id],
      });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePosition,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });
    },
  });
}
