// src/components/Header.jsx
import 'boxicons/css/boxicons.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Header.css';
import { api } from '../services/api';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { cartCount } = useCart(); 
  const { isAuth, user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    if (query.toLowerCase().startsWith('pokemon:')) {
      const pokemonId = query.substring(8).trim();
      const isNumber = /^\d+$/.test(pokemonId);
      if (isNumber) {
        navigate(`/pokemon/${pokemonId}`);
      } else {
        alert("Para buscar un Pokémon, usa el formato 'pokemon: [número]'. Ej: pokemon: 25");
      }
    } else {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
    setSearchTerm('');
    if(menuOpen) setMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de querer cerrar sesión?')) {
      try {
        logout(); 
        navigate('/login');
      } catch (error) {
        console.error('Error en logout:', error);
        alert('Error al cerrar sesión');
      }
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img
          src={logo}
          alt="OTSuper Logo"
          className="logo-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150x60?text=OTSuper+Logo';
          }}
        />
      </Link>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <box-icon name="search" color="#ffffff" size="md"></box-icon>
        </button>
      </form>

      <div className="header-icons">
        <Link to="/carrito" className="cart-icon">
          <i className='bx bx-cart' style={{
            fontSize: '24px',
            color: 'white',
            position: 'relative'
          }}></i>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

      </div>

      <div
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(!menuOpen); }}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/contacto" onClick={() => setMenuOpen(false)}>Ayuda</Link></li>
          
          {isAuth && user && (user.role === 'admin' || user.role === 'operative') && (
            <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Panel de Control</Link></li>
          )}
   

          <li><Link to="/categorias" onClick={() => setMenuOpen(false)}>Categorías</Link></li>
          <li><Link to="/ofertas" onClick={() => setMenuOpen(false)}>Ofertas</Link></li>
 

          {/* Opción de Login/Logout en el menú móvil */}
          {isAuth ? (
            <li><button className="mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Cerrar Sesión</button></li>
          ) : (
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;