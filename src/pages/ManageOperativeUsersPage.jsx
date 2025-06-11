// src/pages/ManageOperativeUsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

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
        
        const apiUrl = 'http://localhost:5000/api/admin/users/operatives';

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok && data.success) {
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
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario operativo "${userName}"? Esta acción no se puede deshacer.`)) {
            const deleteApiUrl = `http://localhost:5000/api/admin/users/operative/${userIdToDelete}`;
            try {
                const response = await fetch(deleteApiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok && data.success) {
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
                        {/* --- CORRECCIÓN APLICADA AQUÍ --- */}
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
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user._id}</td>
                                <td className="col-acciones"> {/* Aplicamos también la clase aquí para la alineación */}
                                    <button
                                        onClick={() => handleDeleteOperative(user._id, user.name)}
                                        className="delete-button"
                                    >
                                        Eliminar
                                    </button>
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