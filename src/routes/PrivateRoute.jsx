import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SidebarComponent from '../components/SidebarComponent';
import TopNavbar from '../components/TopNavbar';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-master-layout">
      <SidebarComponent
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-body-wrapper">
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
