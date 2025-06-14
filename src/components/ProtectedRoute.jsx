// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuth, user, loading } = useAuth();

  if (loading) {
    // Muestra un loader mientras se verifica el estado de autenticación
    return <div>Cargando autenticación...</div>; 
  }

  if (!isAuth) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos y el rol del usuario no está incluido
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Redirige a una página de "No Autorizado" o a la página de inicio
    console.warn(`Acceso denegado. Rol actual: ${user?.role}. Roles permitidos: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene el rol permitido (o no se especificaron roles), renderiza el contenido de la ruta
  return <Outlet />; // Outlet renderizará el componente hijo de la ruta
};

export default ProtectedRoute;