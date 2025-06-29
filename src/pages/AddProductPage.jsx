// src/pages/AddProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { api } from '../services/api';

const AddProductPage = () => {
    // Estados para el formulario del nuevo producto
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState(''); // Ahora guardará el ID de la categoría seleccionada

    // --- 1. ESTADOS PARA MANEJAR LAS CATEGORÍAS DINÁMICAS ---
    const [availableCategories, setAvailableCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Estados para mensajes de feedback
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();

    // --- 2. useEffect PARA OBTENER LAS CATEGORÍAS DESDE EL BACKEND ---
    // Este efecto se ejecuta una sola vez cuando el componente se monta
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const data = await api.get('/api/categories');
                setAvailableCategories(data || []);
                // Si hay categorías, establece la primera como la seleccionada por defecto
                if (data && data.length > 0) {
                    setCategory(data[0]._id);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError('Error de conexión al cargar categorías.');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []); // El array de dependencias vacío [] asegura que se ejecute solo una vez

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!name || !price || !imageUrl || !category) {
            setError('Todos los campos, incluida la categoría, son requeridos.');
            return;
        }
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            setError('El precio debe ser un número válido y no negativo.');
            return;
        }
        const numericStock = parseInt(stock, 10);
        if (isNaN(numericStock) || numericStock < 0) {
            setError('El stock debe ser un número entero no negativo.');
            return;
        }

        const newProductData = {
            name,
            price: numericPrice,
            imageUrl,
            stock: numericStock,
            category: category // Se envía el ID de la categoría seleccionada
        };

        try {
            const data = await api.post('/api/products', newProductData, token);
            
            setMessage(data.message || 'Producto agregado exitosamente.');
            // Limpiar el formulario
            setName('');
            setPrice('');
            setImageUrl('');
            setStock(0);
            // Resetea la categoría al primer elemento de la lista
            if (availableCategories.length > 0) {
                setCategory(availableCategories[0]._id);
            }

        } catch (err) {
            console.error('Error en la petición de agregar producto:', err);
            setError(err.message || 'Error de conexión o del servidor. Inténtalo más tarde.');
        }
    };

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
            <h1>Agregar Nuevo Producto</h1>
            <form onSubmit={handleSubmit}>
                {/* Campos de Nombre, Precio, Imagen y Stock */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nombre del Producto:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Precio:</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '5px' }}>URL de la Imagen:</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required placeholder="https://ejemplo.com/imagen.jpg" style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="stock" style={{ display: 'block', marginBottom: '5px' }}>Stock (Cantidad):</label>
                    <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} min="0" step="1" style={{ width: '100%', padding: '10px' }} />
                </div>

                {/* --- 3. MENÚ DESPLEGABLE DE CATEGORÍAS DINÁMICO --- */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>Categoría:</label>
                    {loadingCategories ? (
                        <p>Cargando categorías...</p>
                    ) : (
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                        >
                            {availableCategories.length > 0 ? (
                                availableCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No hay categorías. Por favor, crea una desde el panel de gestión.</option>
                            )}
                        </select>
                    )}
                </div>

                <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }} >
                    Agregar Producto
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
        </div>
    );
};

export default AddProductPage;