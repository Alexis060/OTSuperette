// src/pages/ManageProductsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ManageProducts.css';
import { api } from '../services/api';
const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const { token, user } = useAuth();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        setFeedbackMessage('');
        const apiUrl = 'http://localhost:5000/api/products';
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                setProducts(Array.isArray(data) ? data : (data.products || []));
            } else {
                setError(data.message || 'Error al cargar productos.');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error de conexión o del servidor al cargar productos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = async (productId, productName) => {
        setFeedbackMessage('');
        setError('');
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
            const deleteApiUrl = `http://localhost:5000/api/products/${productId}`;
            try {
                const response = await fetch(deleteApiUrl, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setFeedbackMessage(data.message || 'Producto eliminado exitosamente.');
                    setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
                } else {
                    setError(data.message || 'Error al eliminar el producto.');
                }
            } catch (err) {
                console.error('Error deleting product:', err);
                setError('Error de conexión o del servidor.');
            }
        }
    };

    if (loading) {
        return <div className="management-container">Cargando productos...</div>;
    }

    return (
        <div className="management-container">
            <h1>Gestionar Productos</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
            {feedbackMessage && <p style={{ color: 'green', textAlign: 'center' }}>{feedbackMessage}</p>}
            
            {products.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th className="col-image">Imagen</th>
                                <th className="col-product-name">Nombre</th>
                                <th className="col-price">Precio</th>
                                <th className="col-stock">Stock</th>
                                <th className="col-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td className="col-image">
                                        <img 
                                            src={product.image || '/placeholder-image.png'}
                                            alt={product.name} 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                                        />
                                    </td>
                                    <td className="col-product-name">{product.name}</td>
                                    <td className="col-price">${product.price.toFixed(2)}</td>
                                    <td className="col-stock">{product.stock}</td>
                                    <td className="col-actions">
                                        {user && (user.role === 'admin' || user.role === 'operative') && (
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                {/* --- BOTÓN DE EDITAR AÑADIDO --- */}
                                                <Link to={`/edit-product/${product._id}`}>
                                                    <button style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                        Editar
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id, product.name)}
                                                    className="delete-button"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                 <p style={{ textAlign: 'center' }}>No hay productos para mostrar o gestionar.</p>
            )}
        </div>
    );
};

export default ManageProductsPage;
