import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Cart.css';
import { api } from '../services/api';
function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/carrito' } });
    } else {
      navigate('/checkout');
    }
  };

  const formatPrice = (price) => {
    const numberPrice = typeof price === 'string'
      ? parseFloat(price.replace('$', '').replace(',', ''))
      : Number(price);
    return isNaN(numberPrice) ? '0.00' : numberPrice.toFixed(2);
  };

  const handleImageError = (e) => {
    e.target.src = '/productos/default.jfif';
    e.target.onerror = null;
  };

  return (
    <div className="cart-container">
      <button className="back-button" onClick={() => navigate('/categorias')}>
        ⬅ Seguir comprando
      </button>
      <h2>Carrito de Compras</h2>

      {errorMessage && (
        <div className="cart-error-message">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-cart">Cargando carrito...</div>
      ) : cart.length === 0 ? (
        <p className="empty-cart-message">Tu carrito está vacío.</p>
      ) : (
        <div className="cart-items">
          {cart.map((product) => {
            // 1. Determinar el precio a usar (oferta o normal)
            const effectivePrice = product.isOnSale && product.salePrice > 0 
              ? product.salePrice 
              : product.price;

            return (
              <div key={product._id} className="cart-item">
                <img
                  src={product.image && product.image.startsWith('http') ? product.image : `/productos/${product.image}`}
                  alt={product.name || 'Producto no disponible'}
                  className="cart-item-image"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="item-details">
                  <h3 className="item-name">{product.name || 'Producto no disponible'}</h3>
                  
                  <div className="item-price-container">
                    {product.isOnSale && product.salePrice > 0 ? (
                      <>
                        <p className="item-price sale">Precio: ${formatPrice(effectivePrice)}</p>
                        <p className="item-price original">Antes: ${formatPrice(product.price)}</p>
                      </>
                    ) : (
                      <p className="item-price">Precio: ${formatPrice(effectivePrice)}</p>
                    )}
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(product._id, product.quantity - 1, handleError)}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, product.quantity + 1, handleError)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  {/* 3. Calcular subtotal con el precio correcto */}
                  <p>Subtotal: ${formatPrice(effectivePrice * product.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(product._id, handleError)}
                    className="remove-item-button"
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${formatPrice(getTotal())}</span>
            </div>
            <button
              onClick={() => clearCart(handleError)}
              className="clear-cart-button"
              disabled={loading}
            >
              Vaciar carrito
            </button>
            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
            >
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;