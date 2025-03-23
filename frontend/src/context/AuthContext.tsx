import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/api';

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in (on first load)
  useEffect(() => {
    api.get('/user')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = async (email: string, password: string) => {
    await api.get('/sanctum/csrf-cookie'); // Important for Sanctum
    const response = await api.post('/login', { email, password });
    const userResponse = await api.get('/user');
    setUser(userResponse.data);
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};