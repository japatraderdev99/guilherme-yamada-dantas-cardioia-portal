import { createContext, useContext, useState, useEffect } from "react";
import { createSession, loadSession, clearSession } from "../services/auth";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  function logout() {
    clearSession();
    setSession(null);
  }
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(logout, Math.max(0, session.expires - Date.now()));
    return () => clearTimeout(timer);
  }, [session]);
  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        login: (email, password) => setSession(createSession(email, password)),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
