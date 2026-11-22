import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="public-hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <ShieldCheck size={16} />
          <span>PROCESO DE ADMISIÓN NACIONAL 2026 - I</span>
        </div>

        <h1 className="hero-title">
          Sirve a la Patria con <span className="text-gold">Honor</span>, <span className="text-white">Disciplina</span> y <span className="text-crimson">Lealtad</span>
        </h1>

        <p className="hero-description">
          Formamos a los futuros defensores del territorio nacional con instrucción militar de vanguardia, 
          capacitación técnica y valores inquebrantables. El Perú te necesita en sus filas.
        </p>

        <div className="hero-buttons">
          <Link to="/postulacion" className="btn-hero-primary">
            <span>Inscribirme como Postulante</span>
            <ChevronRight size={18} />
          </Link>
          <Link to="/admin" className="btn-hero-secondary">
            <span>Ingreso para Oficiales de Mando</span>
          </Link>
        </div>

        <div className="hero-stats-strip">
          <div className="stat-card-hero">
            <Users size={22} className="stat-icon" />
            <div className="stat-num">+1,200</div>
            <div className="stat-label">Vacantes Disponibles</div>
          </div>
          <div className="stat-card-hero">
            <Award size={22} className="stat-icon" />
            <div className="stat-num">100%</div>
            <div className="stat-label">Beca Beca 18 / FFAA</div>
          </div>
          <div className="stat-card-hero">
            <ShieldCheck size={22} className="stat-icon" />
            <div className="stat-num">5 Regiones</div>
            <div className="stat-label">Centros de Instrucción</div>
          </div>
        </div>
      </div>
    </section>
  );
}
