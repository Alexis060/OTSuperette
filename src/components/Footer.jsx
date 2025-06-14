// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <ul className="footer-links">
      
            <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
            <li><Link to="/historia">Nuestra Historia</Link></li>
            <li><Link to="/equipo">Equipo</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <ul className="footer-links">
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/faq">Preguntas Frecuentes</Link></li>
            <li><Link to="/terminos">Términos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="footer-column">
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;