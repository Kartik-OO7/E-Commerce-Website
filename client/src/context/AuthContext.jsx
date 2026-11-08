import { createContext, useContext, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const save = (u) => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); };
  const login = async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (name, email, password) => save(await api('/auth/register', { method: 'POST', body: { name, email, password } }));
  const logout = () => { localStorage.removeItem('user'); setUser(null); };

  return <AuthContext.Provider value={{ user, token: user?.token, login, register, logout }}>{children}</AuthContext.Provider>;
}
