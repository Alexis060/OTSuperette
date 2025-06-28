// src/pages/EditCategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
const EditCategoryPage = () => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const { id } = useParams(); // Obtiene el ID de la categoría de la URL
    const navigate = useNavigate(); // Para redirigir al usuario después de actualizar
    const { token } = useAuth();

    // 1. Obtiene los datos actuales de la categoría para llenar el formulario
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/categories/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setName(data.name);
                    setImageUrl(data.imageUrl);
                } else {
                    throw new Error(data.message || 'No se pudo cargar la categoría.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    // 2. Lógica para enviar los datos actualizados al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFeedbackMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, imageUrl }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setFeedbackMessage('¡Categoría actualizada! Redirigiendo...');
                setTimeout(() => navigate('/manage-categories'), 2000); // Redirige después de 2 segundos
            } else {
                setError(data.message || 'Error al actualizar la categoría.');
            }
        } catch (err) {
            setError('Error de conexión o del servidor.');
        }
    };

    if (loading) return <div style={{padding: '20px'}}>Cargando...</div>;

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '700px', margin: '20px auto' }}>
            <h1>Editar Categoría</h1>
            <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {feedbackMessage && <p style={{ color: 'green' }}>{feedbackMessage}</p>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name">Nombre de la Categoría:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="imageUrl">URL de la Imagen:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px' }}>Actualizar Categoría</button>
            </form>
        </div>
    );
};

export default EditCategoryPage;