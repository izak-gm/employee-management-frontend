import axiosInstance from "./axiosInstance";
import type { User } from "../types/auth.types";

export const updateUser = (id: string, data: Partial<User>) =>
  axiosInstance.put<User>(`/employees/${id}`, data);

export const deleteUser = (id: string) => axiosInstance.delete(`/employees/${id}`);

export const deleteUser = (id: string) => axiosInstance.delete(`/employees/${id}`);
