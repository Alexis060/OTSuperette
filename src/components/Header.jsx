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

  // Asegúrate de que clearCart esté siendo obtenido de useCart
  const { cart, cartCount, clearCart, loading: cartLoading } = useCart(); 
  const { isAuth, logout } = useAuth(); // 'logout' aquí es la función de AuthContext

  // LOG AÑADIDO PARA DIAGNÓSTICO (lo mantengo por si te es útil en esta rama)
  // console.log(
  //   `[Header RENDER] Timestamp: ${new Date().toISOString()}`,
  //   'isAuth (from AuthContext):', isAuth,
  //   'Cart count (from CartContext):', cartCount,
  //   'Cart loading (from CartContext):', cartLoading,
  //   // 'Cart object (from CartContext):', JSON.stringify(cart, null, 2) // Puede ser muy verboso
  // );


  const handleSearch = (e) => {
    e.preventDefault();
    const isNumber = /^\d+$/.test(searchTerm.trim());
    if (isNumber) {
      navigate(`/pokemon/${searchTerm.trim()}`);
    } else {
      alert("Por favor ingresa un número válido de Pokémon");
    }
    setSearchTerm('');
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
          placeholder="Buscar Pokémon por ID..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <box-icon name="search" color="#ffffff" size="md"></box-icon>
        </button>
      </form>

      <div className="header-icons">
        <button className="icon-button">
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
          {isAuth ? (
            <li><button className="mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Cerrar Sesión</button></li>
          ) : (
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link></li>
          )}
          <li><Link to="/categorias" onClick={() => setMenuOpen(false)}>Categorías</Link></li>
          <li><Link to="/ofertas" onClick={() => setMenuOpen(false)}>Ofertas</Link></li>
          <li><Link to="/pokemon/1" onClick={() => setMenuOpen(false)}>Pokémon</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;