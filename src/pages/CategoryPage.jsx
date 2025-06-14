// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <--- 1. IMPORTA useCart

const CategoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { categoryName } = useParams();
    const { addToCart } = useCart(); // <--- 2. OBTÉN la función addToCart del contexto

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            setError('');
            try {
    
                const response = await fetch(`http://localhost:5000/api/products/category/${categoryName}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Error ${response.status}: No se pudo comunicar con el servidor.`);
                }
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('No se pudieron cargar los productos de esta categoría.');
                console.error('Error fetching products by category:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [categoryName]);

    // --- Renderizado Condicional 
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Cargando productos...</div>;
    }
    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
    }

    // --- Renderizado Principal de la Página 
    return (
        <div className="page-container" style={{ padding: '20px' }}>
            <h1 style={{ textTransform: 'capitalize', textAlign: 'center', marginBottom: '30px' }}>
                Categoría: {categoryName}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {products.length > 0 ? (
                    products.map(product => (
                        <div 
                            key={product._id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                padding: '15px', 
                                borderRadius: '8px', 
                                width: '220px', 
                                textAlign: 'center', 
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Link to={`/product/${product._id}`}> 
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} 
                                />
                                <h3 style={{ marginTop: '10px', fontSize: '1.1em', minHeight: '44px', color: 'inherit', textDecoration: 'none' }}>
                                    {product.name}
                                </h3>
                            </Link>
                            <div>
                                <p style={{ color: '#007bff', fontSize: '1.2em', fontWeight: 'bold', margin: '10px 0' }}>
                                    ${product.price ? product.price.toFixed(2) : '0.00'}
                                </p>
                                <button 
                                    style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    // --- 3. CAMBIA el onClick para usar la función del contexto ---
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', width: '100%' }}>No se encontraron productos en esta categoría.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;