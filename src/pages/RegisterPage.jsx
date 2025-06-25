// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css'; // Crearemos este archivo para los estilos

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el usuario.');
            }

            if (data.success && data.token && data.user) {
                // Si el registro es exitoso, hacemos login automáticamente
                login(data.token, data.user);
                navigate('/'); // Y redirigimos al inicio
            } else {
                setError(data.message || 'Ocurrió un error inesperado.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Crear una Cuenta</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Confirmar Contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" className="register-button" disabled={loading}>
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>

                <div className="register-links">
                    <Link to="/login">¿Ya tienes una cuenta? Inicia Sesión</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;