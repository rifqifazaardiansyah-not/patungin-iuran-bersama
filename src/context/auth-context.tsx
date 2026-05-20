import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Role } from "@/lib/mock";

export interface AuthContextType {
  isAuthenticated: boolean;
  role: Role | null;
  name: string | null;
  login: (role: Role, name: string) => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: "patungin_role",
  NAME: "patungin_name",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      const storedName = localStorage.getItem(STORAGE_KEYS.NAME);

      if (storedRole && storedName) {
        // Validate role
        if (storedRole === "bendahara" || storedRole === "anggota") {
          setRole(storedRole as Role);
          setName(storedName);
          setIsAuthenticated(true);
        } else {
          // Invalid role, clear storage
          localStorage.removeItem(STORAGE_KEYS.ROLE);
          localStorage.removeItem(STORAGE_KEYS.NAME);
          setError("Session tidak valid");
        }
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengakses storage lokal";
      setError(message);
      console.error("Auth initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newRole: Role, newName: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
      localStorage.setItem(STORAGE_KEYS.NAME, newName);
      setRole(newRole);
      setName(newName);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan session";
      setError(message);
      console.error("Login error:", err);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.NAME);
      setRole(null);
      setName(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menghapus session";
      setError(message);
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        name,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
