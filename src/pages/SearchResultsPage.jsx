// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <-- 1. IMPORTA el useCart

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const { addToCart } = useCart(); // <--- 2. OBTÉN la función addToCart del contexto

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
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
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
        <div className="page-container" style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
                Resultados de Búsqueda para: "{query}"
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {searchResults.length > 0 ? (
                    searchResults.map(product => (
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
                            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Asumo que tienes una ruta /products/:id */}
                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />
                                <h3 style={{ marginTop: '10px', minHeight: '44px' }}>{product.name}</h3>
                            </Link>
                            <div>
                                <p style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.2em', margin: '10px 0' }}>${product.price.toFixed(2)}</p>
                                <button
                                    style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    // --- 3. CONECTA el onClick a la función addToCart ---
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron resultados para "{query}". Intenta con otro término.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;