import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_USER = {
  id: 1,
  nombre: 'Comandante Gral. E.P.',
  rango: 'General de División',
  rol: 'admin',
  unidad: 'Comando General del Ejército',
  email: 'admin@ejercito.mil.pe',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('usuario_ejercito');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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

  const login = async (usuario, password) => {
    const userClean = (usuario || '').trim().toLowerCase();
    const passClean = (password || '').trim();

    // Verificación de credenciales de Oficial / Administrador
    const esAdminValido =
      (userClean === 'admin' ||
        userClean === 'admin@ejercito.mil.pe' ||
        userClean === 'oficial' ||
        userClean === '72145830') &&
      (passClean === 'admin1234' || passClean === 'admin');

    if (esAdminValido) {
      setUser(ADMIN_USER);
      return { success: true, user: ADMIN_USER };
    }

    // Permitir acceso con cualquier credencial válida con formato militar o mínimo 4 caracteres
    if (userClean && passClean.length >= 4) {
      const nuevoOficial = {
        id: 2,
        nombre: userClean.includes('@') ? userClean.split('@')[0].toUpperCase() : userClean.toUpperCase(),
        rango: 'Oficial de Comando',
        rol: 'admin',
        unidad: 'Centro de Operaciones Tácticas',
        email: userClean.includes('@') ? userClean : `${userClean}@ejercito.mil.pe`,
      };
      setUser(nuevoOficial);
      return { success: true, user: nuevoOficial };
    }

    return {
      success: false,
      message: 'Credenciales inválidas. Acceso restringido únicamente a oficiales del Centro de Mando.',
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuario_ejercito');
    localStorage.removeItem('token_ejercito');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
