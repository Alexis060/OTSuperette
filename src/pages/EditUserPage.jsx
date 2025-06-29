// src/pages/EditUserPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const EditUserPage = () => {
    // Estados para el formulario, se llenarán con los datos del usuario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('operative'); // Valor inicial por defecto

    // Estados para la carga y los mensajes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const { userId } = useParams(); // Obtiene el ID del usuario de la URL
    const navigate = useNavigate();
    const { token } = useAuth();

    // Obtiene los datos actuales del usuario para llenar el formulario
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const data = await api.get(`/api/admin/users/${userId}`, token);
                if (data.success) {
                    setName(data.user.name);
                    setEmail(data.user.email);
                    setRole(data.user.role);
                } else {
                    throw new Error(data.message || 'No se pudo cargar la información del usuario.');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Error de conexión o del servidor al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchUserData();
        }
    }, [userId, token]);

    // Lógica para enviar los datos actualizados al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFeedbackMessage('');
        
        const updatedUser = { name, email, role };

        try {
            const data = await api.put(`/api/admin/users/${userId}`, updatedUser, token);

            if (data.success) {
                setFeedbackMessage('¡Usuario actualizado exitosamente! Redirigiendo...');
                setTimeout(() => navigate('/admin/manage-users'), 2000);
            } else {
                setError(data.message || 'No se pudo actualizar el usuario.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            setError(err.message || 'Error de conexión o del servidor.');
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando datos del usuario...</div>;

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '700px', margin: '20px auto' }}>
            <h1>Editar Usuario</h1>
            <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {feedbackMessage && <p style={{ color: 'green', textAlign: 'center' }}>{feedbackMessage}</p>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name">Nombre:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px' }}/>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px' }}/>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="role">Rol:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    >
                        {/* --- OPCIÓN "Cliente" ELIMINADA --- */}
                        <option value="operative">Operativo</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button type="submit" style={{ padding: '12px 20px' }}>Actualizar Usuario</button>
            </form>
        </div>
    );
};

export default EditUserPage;