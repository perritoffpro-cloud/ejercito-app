import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Páginas Públicas
import LandingPage from '../features/public/pages/LandingPage';
import PostulacionPage from '../features/public/pages/PostulacionPage';

// Páginas Administrativas (Centro de Mando)
import LoginPage from '../features/admin/pages/LoginPage';
import DashboardPage from '../features/admin/pages/DashboardPage';
import CadetePage from '../features/admin/pages/CadetePage';
import RutinaPage from '../features/admin/pages/RutinaPage';
import EventoPage from '../features/admin/pages/EventoPage';
import InscripcionPage from '../features/admin/pages/InscripcionPage';

export default function MyRoutes() {
  return (
    <Routes>
      {/* 🟢 RUTAS PÚBLICAS */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/postulacion" element={<PostulacionPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 🔴 RUTAS PRIVADAS (Centro de Mando con Guardián de Autenticación) */}
      <Route path="/admin" element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="cadetes" element={<CadetePage />} />
        <Route path="rutinas" element={<RutinaPage />} />
        <Route path="eventos" element={<EventoPage />} />
        <Route path="inscripciones" element={<InscripcionPage />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
