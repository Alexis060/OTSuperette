import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true); // Para el efecto inicial
  const navigate = useNavigate();
  const { login: authLogin, isAuth: currentlyAuth } = useAuth(); // Obtén login de AuthContext y también isAuth



  useEffect(() => {

    if (currentlyAuth) {
      console.log('[Login Page] User already authenticated by context, redirecting.');
      navigate('/');
    }
    setCheckingAuth(false);
  }, [currentlyAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json(); 

      if (!res.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      if (data.success && data.token && data.user) { // Verifica que tenga token y datos del usuario

        // Esto guardará el token en localStorage Y actualizará el estado global.
        const loginSuccessful = authLogin(data.token, data.user);

        if (loginSuccessful) {
          console.log('[Login Page] Login successful via AuthContext, navigating.');
  
          navigate('/'); // Navega a la página principal o dashboard
        } else {
          // Si authLogin por alguna razón fallara (aunque en tu AuthContext actual no lo hace internamente)
          setError('Hubo un problema al procesar el inicio de sesión localmente.');
        }
      } else {
        // Si data.success es false, o falta token/user
        setError(data.message || 'Respuesta no exitosa o datos incompletos del servidor.');
      }
    } catch (err) {
      console.error('[Login Page] Error during handleSubmit:', err);
      setError(err.message || 'Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <div className="loading-container">Verificando sesión...</div>;
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>

        <div className="login-links">
          <Link to="/registro">¿No tienes cuenta? Regístrate</Link>

        </div>
      </form>
    </div>
  );
}

export default Login;