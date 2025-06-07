// src/components/Header.jsx
import 'boxicons/css/boxicons.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { cartCount } = useCart(); 
  const { isAuth, user, logout } = useAuth();

  // --- INICIO DE LA FUNCIÓN handleSearch 
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();

    if (!query) return; // No hacer nada si la búsqueda está vacía

    // Huevo de Pascua: si la búsqueda empieza con "pokemon:", busca un Pokémon.
    if (query.toLowerCase().startsWith('pokemon:')) {
      // Extrae el número después de "pokemon:"
      const pokemonId = query.substring(8).trim();
      const isNumber = /^\d+$/.test(pokemonId);
      
      if (isNumber) {
        navigate(`/pokemon/${pokemonId}`);
      } else {
        alert("Para buscar un Pokémon, usa el formato 'pokemon: [número]'. Ej: pokemon: 25");
      }
    } else {
      // Búsqueda Normal: Navega a la nueva página de resultados de búsqueda de productos.
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }

    setSearchTerm(''); // Limpia la barra de búsqueda después de la acción
    if(menuOpen) setMenuOpen(false); // Cierra el menú móvil si estaba abierto
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

  // Cierra el menú y navega (esta función no se usaba explícitamente en tu código original para los Link,
  // pero la mantengo por si la necesitas o si la usas en otro lado. Los Link con onClick={() => setMenuOpen(false)} ya hacen esto.)
  // const handleNavClick = (path) => { 
  //   setMenuOpen(false);
  //   navigate(path);
  // };


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
          placeholder="Buscar productos..." // <-- CAMBIO EN EL PLACEHOLDER
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <box-icon name="search" color="#ffffff" size="md"></box-icon>
        </button>
      </form>

      <div className="header-icons">
        <button className="icon-button" onClick={() => alert('Funcionalidad de mapa no implementada')}>
          <box-icon name="map" color="#ffffff" size="md"></box-icon>
        </button>

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

        {isAuth && (
          <button className="logout-button" onClick={handleLogout}>
            <box-icon name="log-out" color="#ffffff" size="md"></box-icon>
          </button>
        )}
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
          
          {/* Enlaces condicionales para Administradores */}
          {isAuth && user && user.role === 'admin' && (
            <> {/* Usamos Fragment para agrupar múltiples LIs si hay más de uno para admin */}
              <li><Link to="/admin/create-operative" onClick={() => setMenuOpen(false)}>Crear Operativo</Link></li>
              <li><Link to="/admin/manage-users" onClick={() => setMenuOpen(false)}>Gestionar Operativos</Link></li>
            </>
          )}
          
          {/* Enlace condicional para Operativos y Administradores */}
          {isAuth && user && (user.role === 'operative' || user.role === 'admin') && (
            <> {/* Usamos Fragment para agrupar si hay más de un enlace para estos roles */}
              <li><Link to="/products/add" onClick={() => setMenuOpen(false)}>Agregar Producto</Link></li>
              <li><Link to="/manage-products" onClick={() => setMenuOpen(false)}>Gestionar Productos</Link></li>
            </>
          )}

          <li><Link to="/categorias" onClick={() => setMenuOpen(false)}>Categorías</Link></li>
          <li><Link to="/ofertas" onClick={() => setMenuOpen(false)}>Ofertas</Link></li>
          <li><Link to="/pokemon/1" onClick={() => setMenuOpen(false)}>Pokémon</Link></li> {/* Ejemplo de enlace Pokémon */}

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