// src/pages/EditProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProductPage = () => {
    // Estados para el formulario
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('');
    
    // --- 1. NUEVOS ESTADOS PARA MANEJAR LAS OFERTAS ---
    const [isOnSale, setIsOnSale] = useState(false);
    const [salePrice, setSalePrice] = useState('');

    // Estados para la carga y los mensajes
    const [loading, setLoading] = useState(true);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    // Función para obtener los datos del producto y las categorías
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productResponse, categoriesResponse] = await Promise.all([
                fetch(`http://localhost:5000/api/products/${productId}`),
                fetch('http://localhost:5000/api/categories')
            ]);

            if (!productResponse.ok || !categoriesResponse.ok) {
                 throw new Error('No se pudieron cargar los datos necesarios para la edición.');
            }
            
            const productData = await productResponse.json();
            const categoriesData = await categoriesResponse.json();

            // Rellenamos el formulario con los datos del producto
            setName(productData.name || '');
            setPrice(productData.price || '');
            setImageUrl(productData.image || '');
            setStock(productData.stock || 0);
            
            // --- 2. ESTABLECEMOS LOS ESTADOS DE LA OFERTA ---
            setIsOnSale(productData.isOnSale || false);
            setSalePrice(productData.salePrice || '');
            
            setAvailableCategories(categoriesData || []);
            
            if (productData.category && productData.category._id) {
                setCategory(productData.category._id);
            } else if (categoriesData && categoriesData.length > 0) {
                setCategory(categoriesData[0]._id);
            }

        } catch (err) {
            console.error('Error fetching data for edit page:', err);
            setError('Error de conexión o del servidor.');
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedbackMessage('');
        setError('');
        
        // --- 3. AÑADIMOS LOS CAMPOS DE OFERTA AL PAYLOAD ---
        const updatedProduct = {
            name,
            price: parseFloat(price),
            imageUrl,
            stock: parseInt(stock, 10),
            category,
            isOnSale,
            salePrice: isOnSale ? parseFloat(salePrice) : null // Solo envía el precio de oferta si está activo
        };

        if (isOnSale && (!salePrice || parseFloat(salePrice) >= parseFloat(price))) {
            setError('Si el producto está en oferta, el precio de oferta es requerido y debe ser menor que el precio original.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProduct),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setFeedbackMessage('¡Producto actualizado exitosamente! Redirigiendo...');
                setTimeout(() => navigate('/manage-products'), 2000);
            } else {
                setError(data.message || 'No se pudo actualizar el producto.');
            }
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Error de conexión o del servidor.');
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando datos del producto...</div>;

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '700px', margin: '20px auto' }}>
            <h1>Editar Producto</h1>
            <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {feedbackMessage && <p style={{ color: 'green', textAlign: 'center' }}>{feedbackMessage}</p>}
                
                {/* --- CAMPOS EXISTENTES --- */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name">Nombre del Producto:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px' }}/>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="price">Precio Original:</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" style={{ width: '100%', padding: '10px' }}/>
                </div>
                
                <hr style={{margin: '20px 0'}}/>

                {/* --- 4. NUEVOS CAMPOS PARA OFERTAS --- */}
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <label htmlFor="isOnSale" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold' }}>
                        <input
                            type="checkbox"
                            id="isOnSale"
                            checked={isOnSale}
                            onChange={(e) => setIsOnSale(e.target.checked)}
                            style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                        />
                        ¿Poner este producto en oferta?
                    </label>
                </div>
                
                {/* El campo para el precio de oferta solo aparece si el producto está en oferta */}
                {isOnSale && (
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="salePrice">Precio de Oferta:</label>
                        <input 
                            type="number"
                            id="salePrice"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            required={isOnSale} // Es requerido si la oferta está activa
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '10px', borderColor: '#dc3545' }}
                        />
                    </div>
                )}
                
                <hr style={{margin: '20px 0'}}/>

                {/* --- CAMPOS FINALES --- */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="imageUrl">URL de la Imagen:</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={{ width: '100%', padding: '10px' }}/>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="stock">Stock (Cantidad):</label>
                    <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" step="1" style={{ width: '100%', padding: '10px' }}/>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="category">Categoría:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    >
                        {availableCategories.length > 0 ? (
                            availableCategories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Cargando categorías...</option>
                        )}
                    </select>
                </div>
                <button type="submit" style={{ padding: '12px 20px' }}>Actualizar Producto</button>
            </form>
        </div>
    );
};

export default EditProductPage;
