import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarComponent from '../components/SidebarComponent';
import TopNavbar from '../components/TopNavbar';

export default function PrivateRoute() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
