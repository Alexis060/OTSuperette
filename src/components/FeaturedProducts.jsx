// src/components/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; 
import { api } from '../services/api';

// Recibe 'onAddToCartError' como prop desde Home.jsx
const FeaturedProducts = ({ onAddToCartError }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
            
                const data = await api.get('/api/products');

                setProducts(Array.isArray(data) ? data.slice(0, 4) : []);

            } catch (error) {
                console.error("Error cargando productos destacados:", error);
                setError('Error al cargar productos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); 

    if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Cargando productos destacados...</div>;
    if (error) return <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error} <p>No se pudo obtener</p></div>;

    return (
        <section className="featured-products" style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Productos Destacados</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                
                {products.length > 0 ? (
                    products.map(product => (
                        // Se sigue pasando la prop 'onAddToCartError' a cada ProductCard
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            onAddToCartError={onAddToCartError}
                        />
                    ))
                ) : (
                    <p>No hay productos destacados para mostrar.</p>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;