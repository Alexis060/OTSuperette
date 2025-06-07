// src/pages/AddProductPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es diferente

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('snacks'); 
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!name || !price || !imageUrl || !category) { // Se añade validación para categoría
            setError('Nombre, precio, URL de imagen y categoría son requeridos.');
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

        const apiUrl = 'http://localhost:5000/api/products'; 

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    name, 
                    price: numericPrice, 
                    imageUrl,
                    stock: numericStock,
                    category: category // <--- 3. AÑADE LA CATEGORÍA AL BODY DE LA PETICIÓN
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage(data.message || 'Producto agregado exitosamente.');
                // Limpiar el formulario completo
                setName('');
                setPrice('');
                setImageUrl('');
                setStock(0);
                setCategory('snacks'); // También resetea la categoría al valor por defecto
            } else {
                setError(data.message || `Error (${response.status}): No se pudo agregar el producto.`);
            }
        } catch (err) {
            console.error('Error en la petición de agregar producto:', err);
            setError('Error de conexión o del servidor. Inténtalo más tarde.');
        }
    };

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
            <h1>Agregar Nuevo Producto</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nombre del Producto:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Precio:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '5px' }}>URL de la Imagen:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        placeholder="https://ejemplo.com/imagen.jpg"
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="stock" style={{ display: 'block', marginBottom: '5px' }}>Stock (Cantidad):</label>
                    <input
                        type="number"
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        min="0"
                        step="1"
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* --- 2.  CAMPO DE SELECCIÓN PARA LA CATEGORÍA --- */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>Categoría:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="snacks">Snacks</option>
                        <option value="higiene">Higiene</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="lacteos">Lácteos</option>
                    </select>
                </div>
                {/* ---------------------------------------------------- */}

                <button
                    type="submit"
                    style={{ padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                >
                    Agregar Producto
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
        </div>
    );
};

export default AddProductPage;