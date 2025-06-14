// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    // Comprobación de seguridad: No renderizar nada si no hay producto o datos esenciales.
    if (!product || !product._id) {
        console.warn("ProductCard renderizado sin un producto válido.");
        return null;
    }

    // Verificaciones para evitar errores si los datos no existen
    const hasSale = product.isOnSale && typeof product.salePrice === 'number' && product.salePrice > 0;
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
    const salePrice = hasSale && typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : 'N/A';
    const imageUrl = product.image || 'https://placehold.co/220x180/eee/ccc?text=Sin+Imagen';

    return (
        <div className="product-card">
            {/* Si el producto está en oferta, muestra una insignia */}
            {hasSale && <div className="sale-badge">OFERTA</div>}
            
            <Link to={`/product/${product._id}`} className="product-link">
                <img 
                    src={imageUrl} 
                    alt={product.name || 'Producto sin nombre'} 
                    className="product-image"
                />
                <h3 className="product-name">{product.name || 'Producto sin nombre'}</h3>
            </Link>

            <div className="product-price-container">
                {/* Lógica condicional para mostrar el precio */}
                {hasSale ? (
                    <>
                        <span className="original-price">${price}</span>
                        <span className="sale-price">${salePrice}</span>
                    </>
                ) : (
                    <span className="normal-price">${price}</span>
                )}
            </div>

            <button
                className="add-to-cart-button" // Usando la clase global de App.css
                onClick={() => addToCart(product)}
            >
                Agregar al Carrito
            </button>
        </div>
    );
};

export default ProductCard;
