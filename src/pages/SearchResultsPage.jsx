// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartError, setCartError] = useState(null); // Para manejar errores del carrito
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const { addToCart } = useCart(); 

    const handleCartError = (message) => {
        setCartError(message);
        setTimeout(() => setCartError(null), 5000);
    };

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error('Error al buscar productos.');
                }
                const data = await response.json();
                setSearchResults(data || []);
            } catch (err) {
                setError('No se pudieron cargar los resultados de la búsqueda.');
                console.error('Error fetching search results:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Buscando...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

    return (
        <div className="page-container">
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
                Resultados de Búsqueda para: "{query}"
            </h1>

            {/* Mensaje de error del carrito */}
            {cartError && (
                <div className="cart-error-message" style={{ maxWidth: '800px', margin: '2rem auto' }}>
                    {cartError}
                </div>
            )}
            
            {/* Usamos el grid-container para consistencia visual */}
            <div className="grid-container">
                {searchResults.length > 0 ? (
                    searchResults.map(product => (
                        // Reutilizamos el componente ProductCard que ya es responsivo y muestra bien los precios
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            onAddToCartError={handleCartError} 
                        />
                    ))
                ) : (
                    <p>No se encontraron resultados para "{query}". Intenta con otro término.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;