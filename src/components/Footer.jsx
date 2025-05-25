import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Sobre Nosotros</h3>
          <ul className="footer-links">
            <li><a href="/quienes-somos">Quiénes Somos</a></li>
            <li><a href="/historia">Nuestra Historia</a></li>
            <li><a href="/equipo">Equipo</a></li>
          </ul>
        </div>


        <div className="footer-column">
          <h3>Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/faq">Preguntas Frecuentes</a></li>
            <li><a href="/terminos">Términos y Condiciones</a></li>
          </ul>
        </div>

        {/* Columna 3 - Redes Sociales con Boxicons */}
        <div className="footer-column">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
              <box-icon type='logo' name='linkedin' color='white'></box-icon>
            </a>
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
              <box-icon name='facebook' type='logo' color='white'></box-icon>
            </a>
            <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
              <box-icon name='twitter' type='logo' color='white'></box-icon>
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
              <box-icon name='instagram' type='logo' color='white'></box-icon>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;