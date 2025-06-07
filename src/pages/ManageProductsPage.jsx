// src/pages/ManageProducts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es diferente

const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState(''); // Para mensajes de éxito/error de la operación
    const { token, user } = useAuth(); // Necesitamos 'user' para verificar el rol para el botón

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        setFeedbackMessage('');
    
        const apiUrl = 'http://localhost:5000/api/products';

        try {
            const response = await fetch(apiUrl); // GET /api/products no necesita token si es pública
            const data = await response.json();
            if (response.ok) {
                // Asumimos que la data es directamente el array de productos o un objeto con una propiedad products
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
    }, []); // No necesita token como dependencia si la ruta GET /api/products es pública

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = async (productId, productName) => {
        setFeedbackMessage('');
        setError('');
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"? Esta acción no se puede deshacer.`)) {
            const deleteApiUrl = `http://localhost:5000/api/products/${productId}`;
            try {
                const response = await fetch(deleteApiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Token necesario para eliminar
                    },
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setFeedbackMessage(data.message || 'Producto eliminado exitosamente.');
                    // Actualizar la lista de productos en el frontend, filtrando el eliminado
                    setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
                } else {
                    setError(data.message || 'Error al eliminar el producto.');
                }
            } catch (err) {
                console.error('Error deleting product:', err);
                setError('Error de conexión o del servidor al eliminar el producto.');
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando productos...</div>;
    }

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '900px', margin: '20px auto' }}>
            <h1>Gestionar Productos</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
            {feedbackMessage && <p style={{ color: 'green', textAlign: 'center' }}>{feedbackMessage}</p>}
            
            {products.length === 0 && !loading && !error && (
                <p style={{ textAlign: 'center' }}>No hay productos para mostrar o gestionar.</p>
            )}

            {products.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Imagen</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Precio</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '8px' }}>
                                        <img 
                                            src={product.image || '/placeholder-image.png'} // Muestra una imagen placeholder si no hay
                                            alt={product.name} 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                                        />
                                    </td>
                                    <td style={{ padding: '12px' }}>{product.name}</td>
                                    <td style={{ padding: '12px' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ padding: '12px' }}>{product.stock}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        {/* Botón de Eliminar condicional */}
                                        {user && (user.role === 'admin' || user.role === 'operative') && (
                                            <button
                                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                                style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageProductsPage;