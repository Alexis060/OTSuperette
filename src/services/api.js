// src/services/api.js

// 1. Leemos la URL base de la API desde las variables de entorno.
//    Esto asegura que funcione tanto en local como en producción en Azure.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Una función genérica para manejar todas las peticiones fetch.
 * @param {string} endpoint - La ruta de la API a la que se llamará (ej. '/api/products').
 * @param {string} method - El método HTTP (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - El cuerpo de la petición para POST o PUT.
 * @param {string} [token=null] - El token JWT de autenticación.
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
const request = async (endpoint, method, body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Si nos proporcionan un token, lo añadimos al encabezado de autorización.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: method.toUpperCase(),
    headers: headers,
  };

  // Si hay un cuerpo en la petición (para POST o PUT), lo añadimos.
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Si la respuesta no es OK (ej. 404, 500), leemos el error y lo lanzamos.
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error en la petición a ${endpoint}`);
    }

    // Si la respuesta es exitosa, la devolvemos como JSON.
    return await response.json();

  } catch (error) {
    console.error(`Error en la API (${method} ${endpoint}):`, error);
    // Re-lanzamos el error para que el componente que llamó pueda manejarlo.
    throw error;
  }
};

// Creamos un objeto 'api' con métodos fáciles de usar para cada tipo de petición.
export const api = {
  get: (endpoint, token = null) => request(endpoint, 'GET', null, token),
  post: (endpoint, body, token = null) => request(endpoint, 'POST', body, token),
  put: (endpoint, body, token = null) => request(endpoint, 'PUT', body, token),
  delete: (endpoint, token = null) => request(endpoint, 'DELETE', null, token),
};