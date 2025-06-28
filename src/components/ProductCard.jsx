import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import './ProductCard.css';
import { api } from '../services/api';

const ProductCard = ({ product, onAddToCartError }) => {
    const { addToCart } = useCart();

    if (!product || !product._id) {
        return null; // No renderizar nada si el producto es inválido
    }

    // Lógica para determinar si hay oferta y formatear precios
    const hasSale = product.isOnSale && typeof product.salePrice === 'number' && product.salePrice > 0;
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
    const salePrice = hasSale ? product.salePrice.toFixed(2) : 'N/A';
    const imageUrl = product.image || 'https://placehold.co/220x180/eee/ccc?text=Sin+Imagen';

    // Variable para verificar si el producto está agotado
    const isOutOfStock = product.stock === 0;

    return (
        <div className="product-card">
            {hasSale && <div className="sale-badge">OFERTA</div>}
            
            <Link to={`/product/${product._id}`} className="product-link">
                <img src={imageUrl} alt={product.name || 'Producto sin nombre'} className="product-image" />
                <h3 className="product-name">{product.name || 'Producto sin nombre'}</h3>
            </Link>

       
            {/*lógica para mostrar los precios en este contenedor */}
            <div className="product-price-container">
                {hasSale ? (
                    <>
                        <span className="sale-price">${salePrice}</span>
                        <span className="original-price">${price}</span>
                    </>
                ) : (
                    <span className="price">${price}</span>
                )}
            </div>
         

            <button
                // Se añade una clase 'disabled' si no hay stock
                className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
                onClick={() => addToCart(product, onAddToCartError)}
                // Se deshabilita el botón si no hay stock
                disabled={isOutOfStock}
            >
                {/* Se cambia el texto del botón si no hay stock */}
                {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
        </div>
    );
};

export default ProductCard;