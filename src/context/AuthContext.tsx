import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types/auth.type";
import { tokenStorage, type Role } from "../api";

interface AuthContextType {
  token: string | null;
  id: string | null;
  email: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_ROLES: Role[] = ["HR_ADMIN", "SUPERADMIN", "SOFTWARE_ENGINEER", "TECH_LEAD", "INTERN"];

const extractRole = (role: string | undefined): Role | null => {
  if (!role) return null;
  const cleaned = role.replace("ROLE_", "");
  return VALID_ROLES.includes(cleaned as Role) ? (cleaned as Role) : null;
};

const decodeStoredToken = (token: string | null): DecodedToken | null => {
  if (!token) return null;
  try {
    const payload = jwtDecode<DecodedToken>(token);
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialToken = tokenStorage.get();
  const [token, setToken] = useState<string | null>(initialToken);
  const [decoded, setDecoded] = useState<DecodedToken | null>(decodeStoredToken(initialToken));

  const login = (newToken: string) => {
    const payload = decodeStoredToken(newToken);
    if (!payload) {
      logout();
      return;
    }
    tokenStorage.set(newToken);
    setToken(newToken);
    setDecoded(payload);
  };

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setDecoded(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        id: decoded?.id ?? null,
        email: decoded?.email ?? null,
        role: extractRole(decoded?.role),
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
