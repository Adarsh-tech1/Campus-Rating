import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProfile, login as loginRequest } from "../api/authApi.js";
import {
  clearSession,
  getStoredUser,
  getToken,
  saveSession,
  saveUser,
} from "../utils/storage.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener("campus-rating:session-expired", onExpired);
    return () =>
      window.removeEventListener("campus-rating:session-expired", onExpired);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    getProfile()
      .then(({ data }) => {
        if (!active) return;
        const nextUser = { ...getStoredUser(), ...data.user };
        setUser(nextUser);
        saveUser(nextUser);
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, logout]);

  const signIn = useCallback(async (credentials) => {
    const { data } = await loginRequest(credentials);
    const nextUser = data.data.user;
    saveSession(data.data.token, nextUser);
    setToken(data.data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, signIn, logout }),
    [user, token, loading, signIn, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
