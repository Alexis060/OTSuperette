// auth.js
export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };
  
  // Añade esta función
  export const clearAuthData = () => {
    localStorage.removeItem('token');
  };
  
  // Si necesitas también guardar el token
  export const saveAuthData = (token) => {
    localStorage.setItem('token', token);
  };