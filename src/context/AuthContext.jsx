import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 1,
  nombre: 'Comandante Gral. E.P.',
  rango: 'General de División',
  rol: 'admin',
  unidad: 'Comando Central Lima',
  email: 'mando@ejercito.mil.pe',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('usuario_ejercito');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('usuario_ejercito', JSON.stringify(user));
      localStorage.setItem('token_ejercito', 'token_militar_seguro_2026');
    } else {
      localStorage.removeItem('usuario_ejercito');
      localStorage.removeItem('token_ejercito');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData || DEFAULT_USER);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
