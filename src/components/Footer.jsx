// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'boxicons';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3 className="footer-title">OTSuperette</h3>
                    <p>Tu supermercado en línea de confianza. Productos de calidad para toda la familia.</p>
                </div>

                <div className="footer-section links">
                    <h3 className="footer-title">Información</h3>
                    <ul>
                        <li><Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
                        <li><Link to="/terminos-y-condiciones">Términos y Condiciones</Link></li>
                        <li><Link to="/nuestra-historia">Nuestra Historia</Link></li>
                        <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h3 className="footer-title">Contacto</h3>
                    <span><box-icon name='phone' color='#e0e0e0'></box-icon> 55-1234-5678</span>
                    <br />
                    <span><box-icon name='envelope' color='#e0e0e0'></box-icon> 201910459@tese.edu.mx</span>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} OTSuperette | Todos los derechos reservados
            </div>
        </footer>
    );
};

export default Footer;
