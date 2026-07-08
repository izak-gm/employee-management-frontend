import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { Role, DecodedToken } from "../types/auth.type";

interface AuthContextType {
  token: string | null;
  employeeId: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = jwtDecode<DecodedToken>(token);
        if (payload.exp * 1000 < Date.now()) {
          logout();
        } else {
          setDecoded(payload);
        }
      } catch {
        logout();
      }
    } else {
      setDecoded(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setDecoded(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        employeeId: decoded?.employeeId ?? null,
        role: decoded?.role ?? null,
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
