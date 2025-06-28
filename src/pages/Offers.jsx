// src/pages/Offers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { api } from '../services/api';
const Offers = () => {
    const [offerProducts, setOfferProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/products/offers');
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las ofertas');
                }
                const data = await response.json();
                setOfferProducts(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching offers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []); // Se ejecuta solo una vez al cargar la página

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando ofertas...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

    return (
        <div className="page-container" style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Ofertas Especiales</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {offerProducts.length > 0 ? (
                    offerProducts.map(product => (
                        <div 
                            key={product._id} 
                            style={{ 
                                border: '1px solid #ddd',
                                borderColor: '#ffc107', // Borde amarillo para destacar la oferta
                                padding: '15px', 
                                borderRadius: '8px', 
                                width: '220px', 
                                textAlign: 'center', 
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
                                />
                                <h3 style={{ marginTop: '10px', minHeight: '44px' }}>{product.name}</h3>
                            </Link>

                            <div>
                                {/* Mostramos el precio original tachado y el precio de oferta */}
                                <p style={{ margin: '10px 0' }}>
                                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '10px' }}>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span style={{ color: '#dc3545', fontSize: '1.4em', fontWeight: 'bold' }}>
                                        ${product.salePrice.toFixed(2)}
                                    </span>
                                </p>
                                <button
                                    className="add-to-cart-button" 
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', width: '100%', fontSize: '1.2em' }}>
                        ¡Vuelve pronto! Actualmente no tenemos ofertas especiales.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Offers;
