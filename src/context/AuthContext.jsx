// src/context/AuthContext.jsx
import React, { createContext, useReducer, useContext, useEffect, useCallback, useState } from 'react';
import { isTokenValid } from '../utils/auth'; 

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  console.log('[AuthReducer] Action received:', action.type); // Log para todas las acciones
  switch (action.type) {
    case 'INIT_AUTH':
      console.log('[AuthReducer] Payload for INIT_AUTH:', action.payload);
      return {
        ...state,
        isAuth: action.payload.isAuth,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN':
      console.log('[AuthReducer] Payload for LOGIN:', action.payload);
      return {
        ...state,
        isAuth: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuth: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuth: false,
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true); // Para el estado de carga inicial

  // Efecto para cargar el estado de autenticación inicial desde localStorage
  useEffect(() => {
    console.log('[AuthProvider useEffect] Running initial auth check.');
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      let userObject = null;

      if (storedUser) {
        try {
          userObject = JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing stored user from localStorage", e);
          localStorage.removeItem('user'); // Limpiar usuario 
        }
      }

      if (storedToken && userObject && isTokenValid(storedToken)) { // Verifica token y si existe usuario
        console.log('[AuthProvider useEffect] Token and user valid, dispatching INIT_AUTH.');
        dispatch({
          type: 'INIT_AUTH',
          payload: {
            isAuth: true,
            user: userObject,
            token: storedToken,
          },
        });
      } else {
        console.log('[AuthProvider useEffect] No valid token or user found, ensuring logout state.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({
          type: 'INIT_AUTH',
          payload: {
            isAuth: false,
            user: null,
            token: null,
          },
        });
      }
    } catch (error) {
      console.error('[AuthProvider useEffect] Error verifying initial authentication:', error);
      // Asegurar un estado de no autenticado en caso de error
      dispatch({
        type: 'INIT_AUTH',
        payload: {
          isAuth: false,
          user: null,
          token: null,
        },
      });
    } finally {
      setLoading(false); // Termina la carga
    }
  }, []);

  const login = useCallback((apiToken, apiUserData) => {
    console.log('[AuthContext login func] Attempting login. UserData from API:', apiUserData);
    try {
      if (!apiToken || !apiUserData || !apiUserData.role) { // Asegúrate que userData y su rol existan
        console.error('[AuthContext login func] Token, userData, or user role is missing.');
        return false;
      }
      localStorage.setItem('token', apiToken);
      localStorage.setItem('user', JSON.stringify(apiUserData)); // Guarda el objeto user completo

      dispatch({
        type: 'LOGIN',
        payload: {
          user: apiUserData, 
          token: apiToken,
        },
      });
      console.log('[AuthContext login func] Dispatched LOGIN successfully.');
      return true;
    } catch (error) {
      console.error('[AuthContext login func] Error during login dispatch or localStorage set:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('[AuthContext logout func] Attempting logout.');
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      console.log('[AuthContext logout func] Dispatched LOGOUT successfully.');

      return true;
    } catch (error) {
      console.error('[AuthContext logout func] Error during logout:', error);
      return false;
    }
  }, []);

  // Proporciona 'loading' para que los componentes puedan esperar a que se determine el estado de auth
  return (
    <AuthContext.Provider value={{
      isAuth: state.isAuth,
      user: state.user,
      token: state.token,
      loading, 
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};