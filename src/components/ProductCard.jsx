// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import './ProductCard.css';

// Recibe 'onAddToCartError' como prop desde FeaturedProducts.jsx
const ProductCard = ({ product, onAddToCartError }) => {
    const { addToCart } = useCart();

    if (!product || !product._id) {
        console.warn("ProductCard renderizado sin un producto válido.");
        return null;
    }

    const hasSale = product.isOnSale && typeof product.salePrice === 'number' && product.salePrice > 0;
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
    const salePrice = hasSale && typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : 'N/A';
    const imageUrl = product.image || 'https://placehold.co/220x180/eee/ccc?text=Sin+Imagen';

    return (
        <div className="product-card">
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
                className="add-to-cart-button"
                //El onClick  pasa el producto Y la función de error al contexto.
                onClick={() => addToCart(product, onAddToCartError)}
            >
                Agregar al Carrito
            </button>
        </div>
    );
};

export default ProductCard;