import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const ProtectedRoute = () => {
  // Verificar si el token es válido
  const isAuthenticated = isTokenValid();

  // Redirigir a login si no está autenticado, mostrar contenido si sí
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;