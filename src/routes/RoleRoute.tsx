// src/routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth.type";

const RoleRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
export default RoleRoute;
