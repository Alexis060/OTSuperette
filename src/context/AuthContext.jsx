import { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { isTokenValid } from '../utils/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  console.log('[AuthReducer] Action received:', action.type, 'Payload:', action.payload); // Log para todas las acciones
  switch (action.type) {
    case 'LOGIN':
      const newStateLogin = {
        ...state,
        isAuth: true,
        user: action.payload.user,
        token: action.payload.token
      };
      console.log('[AuthReducer] New state after LOGIN:', newStateLogin);
      return newStateLogin;
    case 'LOGOUT':
      const newStateLogout = {
        ...state,
        isAuth: false,
        user: null,
        token: null
      };
      console.log('[AuthReducer] New state after LOGOUT:', newStateLogout);
      return newStateLogout;
    case 'UPDATE_AUTH': // Este case no...
      const isValidUpdate = action.payload.isValid;
      const newStateUpdate = {
        ...state,
        isAuth: isValidUpdate,
        user: isValidUpdate ? state.user : null, 
        token: isValidUpdate ? localStorage.getItem('token') : null
      };
      console.log('[AuthReducer] New state after UPDATE_AUTH:', newStateUpdate);
      return newStateUpdate;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuth: false,
    user: null,
    token: null
  });

  console.log('[AuthProvider] Render/Re-render. Current state:', state); // Log para ver cuándo se re-renderiza AuthProvider

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthProvider useEffect checkAuth] Running initial auth check.');
      try {
        const isValid = isTokenValid(); 
        console.log('[AuthProvider useEffect checkAuth] isTokenValid result:', isValid);
        if (isValid) {
          const token = localStorage.getItem('token');
        
          let userPayload = { name: 'Usuario (placeholder)' }; // Placeholder
          if (storedUser) {
            try { userPayload = JSON.parse(storedUser); } catch (e) { console.error("Error parsing stored user", e); }
          }

          dispatch({
            type: 'LOGIN',
            payload: {
              user: userPayload, // Usar datos recuperados o placeholder
              token
            }
          });
        } else {
       
           if (state.isAuth) { // Solo despachar si el estado actual cree que está autenticado
             console.log('[AuthProvider useEffect checkAuth] Token not valid, dispatching LOGOUT.');
             dispatch({ type: 'LOGOUT' });
           }
        }
      } catch (error) {
        console.error('[AuthProvider useEffect checkAuth] Error verifying authentication:', error);
      }
    };

    checkAuth();
  }, []); 

  const login = useCallback((token, userData) => {
    console.log('[AuthContext login func] Attempting login. Token:', token, 'UserData:', userData);
    try {
      if (!token || !userData) {
        console.error('[AuthContext login func] Token or userData is missing.');
        return false;
      }
      localStorage.setItem('token', token);

      const payload = {
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email
          // ... otros campos del usuario
        },
        token
      };
      console.log('[AuthContext login func] Dispatching LOGIN with payload:', payload);
      dispatch({ type: 'LOGIN', payload });
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

  return (
    <AuthContext.Provider value={{
      isAuth: state.isAuth,
      user: state.user,
      token: state.token,
      login,
      logout
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