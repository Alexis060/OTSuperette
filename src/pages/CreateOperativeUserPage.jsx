// src/pages/CreateOperativeUserPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario
// Podrías añadir un archivo CSS para esta página si quieres estilos específicos
// import './CreateOperativeUserPage.css'; 

const CreateOperativeUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name || !email || !password) {
      setError('Todos los campos son requeridos.');
      return;
    }

    const apiUrl = 'http://localhost:5000/api/admin/users/create-operative'; 

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Envía el token del admin
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message || 'Usuario operativo creado exitosamente.');
        // Limpiar el formulario
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || `Error (${response.status}): No se pudo crear el usuario.`);
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      setError('Error de conexión o del servidor. Inténtalo más tarde.');
    }
  };

  return (
    <div className="page-container" style={{ padding: '20px' }}> 
      <h1>Crear Nuevo Usuario Operativo</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px 15px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Crear Usuario
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default CreateOperativeUserPage;