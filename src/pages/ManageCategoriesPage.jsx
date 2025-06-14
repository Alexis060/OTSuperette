// src/pages/ManageCategoriesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // <-- 1. IMPORTAMOS Link

const ManageCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const { token } = useAuth();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError('');
        setFeedbackMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/categories'); 
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: No se pudo comunicar con el servidor.`);
            }
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('No se pudieron cargar las categorías existentes.');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setError('');
        setFeedbackMessage('');
        if (!newCategoryName.trim() || !newImageUrl.trim()) {
            return setError('El nombre y la URL de la imagen son requeridos.');
        }
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: newCategoryName.trim(), imageUrl: newImageUrl.trim() }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setFeedbackMessage(data.message || 'Categoría creada exitosamente.');
                fetchCategories(); 
                setNewCategoryName('');
                setNewImageUrl('');
            } else {
                setError(data.message || 'Error al crear la categoría.');
            }
        } catch (err) {
            setError('Error de conexión o del servidor.');
            console.error('Error creating category:', err);
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        setError('');
        setFeedbackMessage('');
        if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setFeedbackMessage(data.message);
                    setCategories(prev => prev.filter(cat => cat._id !== categoryId));
                } else {
                    setError(data.message || 'Error al eliminar la categoría.');
                }
            } catch (err) {
                setError('Error de conexión o del servidor.');
                console.error('Error deleting category:', err);
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
    }

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '700px', margin: '20px auto' }}>
            <h1>Gestionar Categorías</h1>
            <form onSubmit={handleAddCategory} style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Añadir Nueva Categoría</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="newCategoryName" style={{ display: 'block', marginBottom: '5px' }}>Nombre de la Categoría:</label>
                    <input
                        type="text"
                        id="newCategoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ej: Postres"
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="newImageUrl" style={{ display: 'block', marginBottom: '5px' }}>URL de la Imagen:</label>
                    <input
                        type="text"
                        id="newImageUrl"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px' }}>Añadir Categoría</button>
                {feedbackMessage && <p style={{ color: 'green', marginTop: '10px' }}>{feedbackMessage}</p>}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>

            <h2>Categorías Existentes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {categories.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {categories.map(category => (
                        <li 
                            key={category._id} 
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #eee', 
                                marginBottom: '5px', 
                                borderRadius: '4px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={category.imageUrl} alt={category.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}/>
                                <span>{category.name}</span>
                            </div>
                            {/* --- 2. CONTENEDOR PARA LOS BOTONES --- */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/edit-category/${category._id}`}>
                                    <button style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Editar
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDeleteCategory(category._id, category.name)}
                                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay categorías para mostrar.</p>
            )}
        </div>
    );
};

export default ManageCategoriesPage;
