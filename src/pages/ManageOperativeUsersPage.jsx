// src/pages/ManageOperativeUsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; 
import './ManageUsers.css';
import { api } from '../services/api';

const ManageOperativeUsersPage = () => {
    const [operativeUsers, setOperativeUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState(''); 
    const { token } = useAuth();

    const fetchOperativeUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        setFeedbackMessage('');
        try {
            const data = await api.get('/api/admin/users/operatives', token);
            if (data.success) {
                setOperativeUsers(data.users || []);
            } else {
                setError(data.message || 'Error al cargar usuarios operativos.');
            }
        } catch (err) {
            console.error('Error fetching operative users:', err);
            setError('Error de conexión o del servidor al cargar usuarios.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchOperativeUsers();
        }
    }, [fetchOperativeUsers, token]);

    const handleDeleteOperative = async (userIdToDelete, userName) => {
        setFeedbackMessage('');
        setError('');
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario operativo "${userName}"?`)) {
            try {
                const data = await api.delete(`/api/admin/users/operative/${userIdToDelete}`, token);
                if (data.success) {
                    setFeedbackMessage(data.message || 'Usuario operativo eliminado exitosamente.');
                    setOperativeUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete));
                } else {
                    setError(data.message || 'Error al eliminar el usuario operativo.');
                }
            } catch (err) {
                console.error('Error deleting operative user:', err);
                setError('Error de conexión o del servidor al eliminar usuario.');
            }
        }
    };

    if (loading) {
        return <div className="management-container">Cargando usuarios operativos...</div>;
    }

    return (
        <div className="management-container">
            <h1>Gestionar Usuarios Operativos</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
            {feedbackMessage && <p style={{ color: 'green', textAlign: 'center' }}>{feedbackMessage}</p>}
            
            {operativeUsers.length > 0 ? (
                <table className="management-table">
                    <thead>
                        <tr>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-email">Email</th>
                            <th className="col-id">ID</th>
                            <th className="col-acciones">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operativeUsers.map(user => (
                            <tr key={user._id}>
                                <td className="col-nombre">{user.name}</td>
                                <td className="col-email">{user.email}</td>
                                <td className="col-id">{user._id}</td>
                                <td className="col-acciones">
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        {/* --- BOTÓN DE EDITAR AÑADIDO --- */}
                                        <Link to={`/admin/edit-user/${user._id}`}>
                                            <button style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                Editar
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteOperative(user._id, user.name)}
                                            className="delete-button"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center' }}>No hay usuarios operativos para mostrar.</p>
            )}
        </div>
    );
};

export default ManageOperativeUsersPage;