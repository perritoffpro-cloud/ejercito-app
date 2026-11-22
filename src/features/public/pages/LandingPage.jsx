import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/landing/Header';
import Hero from '../../../components/landing/Hero';
import Footer from '../../../components/landing/Footer';
import { listarEventos } from '../../../services/evento/EventoMethods';
import { listarRutinas } from '../../../services/rutina/RutinaMethods';
import { formatearFecha } from '../../../utils/formatearFecha';
import { Check, Calendar, Dumbbell, Award, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [eventos, setEventos] = useState([]);
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    listarEventos().then((data) => setEventos((data || []).slice(0, 3))).catch(() => {});
    listarRutinas().then((data) => setRutinas((data || []).slice(0, 3))).catch(() => {});
  }, []);

  const requisitos = [
    'Ser peruano(a) de nacimiento con DNI vigente.',
    'Tener entre 18 y 25 años de edad.',
    'Estatura mínima: Varones 1.65 m / Damas 1.55 m.',
    'Aprobar la evaluación médica institucional (Apto).',
    'Carecer de antecedentes penales o policiales.',
    'Vocación de servicio a la patria y compromiso cívico.',
  ];

  const beneficios = [
    { title: 'Beca 18 / Beca FFAA', desc: 'Acceso a estudios superiores gratuitos en universidades e institutos de prestigio.' },
    { title: 'Asignación Económica Mensual', desc: 'Remuneración de sostenimiento mensual conforme a la ley del servicio militar.' },
    { title: 'Alimentación y Alojamiento', desc: 'Dotación completa de rancho diario balanceado y alojamiento en cuarteles modernos.' },
    { title: 'Seguro Médico Integral', desc: 'Cobertura médica y odontológica completa en los Hospitales Militares del Perú.' },
  ];

  return (
    <div className="landing-layout">
      <Header />
      <Hero />

      {/* Sección Requisitos y Beneficios */}
      <section id="requisitos" className="landing-section bg-light">
        <div className="section-container">
          <div className="section-badge">CRITERIOS DE ADMISIÓN</div>
          <h2 className="section-title">Requisitos para el Servicio Militar Voluntario</h2>
          <p className="section-subtitle">
            Conoce los lineamientos oficiales establecidos por el Comando Conjunto para el llamamiento de este periodo.
          </p>

          <div className="grid-requisitos-beneficios">
            {/* Tarjeta Requisitos */}
            <div className="card-militar-feature">
              <div className="feature-card-header">
                <Shield size={24} className="text-crimson" />
                <h3>Requisitos Obligatorios</h3>
              </div>
              <ul className="requisitos-list">
                {requisitos.map((req, i) => (
                  <li key={i}>
                    <div className="check-bullet"><Check size={14} /></div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <Link to="/postulacion" className="btn-feature-cta">
                <span>Llenar Ficha de Inscripción</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Tarjeta Beneficios */}
            <div id="beneficios" className="card-militar-feature gold-border">
              <div className="feature-card-header">
                <Award size={24} className="text-gold" />
                <h3>Beneficios Exclusivos</h3>
              </div>
              <div className="beneficios-grid">
                {beneficios.map((b, i) => (
                  <div key={i} className="beneficio-item">
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Entrenamiento */}
      <section className="landing-section">
        <div className="section-container">
          <div className="section-badge">PREPARACIÓN FÍSICA Y OPERATIVA</div>
          <h2 className="section-title">Programa de Instrucción Militar</h2>
          <p className="section-subtitle">
            Nuestros cadetes y soldados reciben una rigurosa formación en terreno, técnicas de supervivencia y liderazgo.
          </p>

          <div className="grid-rutinas-landing">
            {rutinas.map((rutina) => (
              <div key={rutina.id} className="card-landing-routine">
                {rutina.imagen && (
                  <div className="card-routine-img-box">
                    <img src={rutina.imagen} alt={rutina.titulo} />
                    <span className="routine-type-pill">{rutina.tipo}</span>
                  </div>
                )}
                <div className="card-routine-body">
                  <h4>{rutina.titulo}</h4>
                  <p className="routine-desc">{rutina.descripcion}</p>
                  <div className="routine-meta">
                    <span><Dumbbell size={14} /> {rutina.duracion_min} min</span>
                    <span>{rutina.dia_semana || rutina.frecuencia}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Eventos y Ceremonias */}
      {eventos.length > 0 && (
        <section id="convocatoria" className="landing-section bg-light">
          <div className="section-container">
            <div className="section-badge">AGENDA OFICIAL</div>
            <h2 className="section-title">Próximos Actos Cívico-Militares</h2>
            <div className="grid-eventos-landing">
              {eventos.map((ev) => (
                <div key={ev.id} className="card-landing-event">
                  {ev.imagen && (
                    <div className="event-img-wrap">
                      <img src={ev.imagen} alt={ev.titulo} />
                      <span className="event-badge-tag">{ev.tipo}</span>
                    </div>
                  )}
                  <div className="event-body">
                    <h4>{ev.titulo}</h4>
                    <p className="event-meta-info">
                      <Calendar size={14} /> {formatearFecha(ev.fecha)} · {ev.hora}
                    </p>
                    <p className="event-place">{ev.lugar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Final */}
      <section className="cta-final-banner">
        <div className="cta-limit">
          <h2>¿Listo para servir a tu país con honor?</h2>
          <p>El registro de admisión está disponible de forma 100% gratuita para todos los jóvenes peruanos.</p>
          <div className="cta-action-btns">
            <Link to="/postulacion" className="btn-cta-white">
              Comenzar mi Postulación Online
            </Link>
            <Link to="/admin" className="btn-cta-outline">
              Acceso a la Comandancia (Intranet)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
