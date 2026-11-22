import React from 'react';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="footer-limit">
        <div className="footer-col">
          <div className="footer-brand">
            <Shield size={24} className="text-gold" />
            <span className="footer-title">EJÉRCITO DEL PERÚ</span>
          </div>
          <p className="footer-desc">
            Comando General del Ejército. Institución tutelar de la nación, garante de la soberanía, 
            integridad territorial y desarrollo del Perú.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Contacto Institucional</h4>
          <ul className="footer-contact-list">
            <li><MapPin size={16} /> Cuartel General del Ejército - El Pentagonito, San Borja, Lima</li>
            <li><Phone size={16} /> Central Telefónica: (01) 317-1700</li>
            <li><Mail size={16} /> admision@ejercito.mil.pe</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><a href="#convocatoria">Bases del Concurso 2026</a></li>
            <li><a href="#requisitos">Requisitos de Talla y Salud</a></li>
            <li><a href="/postulacion">Ficha Única de Inscripción</a></li>
            <li><a href="/admin">Intranet de Oficiales</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-limit">
          <span>© 2026 Ejército del Perú · Todos los derechos reservados.</span>
          <span>Sistema de Mando & Control de Instrucción Militar.</span>
        </div>
      </div>
    </footer>
  );
}
