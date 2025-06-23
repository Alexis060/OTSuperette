// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import './ProductCard.css';

const ProductCard = ({ product, onAddToCartError }) => {
    const { addToCart } = useCart();

    if (!product || !product._id) {
        return null;
    }

    const hasSale = product.isOnSale && typeof product.salePrice === 'number' && product.salePrice > 0;
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
    const salePrice = hasSale ? product.salePrice.toFixed(2) : 'N/A';
    const imageUrl = product.image || 'https://placehold.co/220x180/eee/ccc?text=Sin+Imagen';

    //VARIABLE PARA VERIFICAR EL STOCK
    const isOutOfStock = product.stock === 0;

    return (
        <div className="product-card">
            {hasSale && <div className="sale-badge">OFERTA</div>}
            
            <Link to={`/product/${product._id}`} className="product-link">
                <img src={imageUrl} alt={product.name || 'Producto sin nombre'} className="product-image" />
                <h3 className="product-name">{product.name || 'Producto sin nombre'}</h3>
            </Link>

            <div className="product-price-container">
                {/* ... tu lógica de precios ... */}
            </div>

            <button
                // 1. Añadimos una clase 'disabled' si no hay stock
                className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
                onClick={() => addToCart(product, onAddToCartError)}
                // 2. Deshabilitamos el botón si no hay stock
                disabled={isOutOfStock}
            >
                {/* 3. Cambiamos el texto del botón si no hay stock */}
                {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
        </div>
    );
};

export default ProductCard;