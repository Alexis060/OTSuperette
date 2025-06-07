// src/pages/ManageOperativeUsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es diferente

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
        if (token) { // Solo hacer fetch si hay token (admin está logueado)
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
                    // Actualizar la lista de usuarios en el frontend, filtrando el eliminado
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
        return <div style={{ padding: '20px' }}>Cargando usuarios operativos...</div>;
    }

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
            <h1>Gestionar Usuarios Operativos</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {feedbackMessage && <p style={{ color: 'green' }}>{feedbackMessage}</p>}
            
            {operativeUsers.length === 0 && !loading && !error && (
                <p>No hay usuarios operativos para mostrar.</p>
            )}

            {operativeUsers.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operativeUsers.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{user.name}</td>
                                <td style={{ padding: '12px' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>{user._id}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleDeleteOperative(user._id, user.name)}
                                        style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageOperativeUsersPage;