import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/api";
import { getMe, setToken, clearToken } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = useCallback((token: string) => {
    setToken(token);
    setUser(null);
    setLoading(true);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        setAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
