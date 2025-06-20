import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

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
          {cart.map((product) => (
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
                <p className="item-price">Precio unitario: ${formatPrice(product.price)}</p>
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
                <p>Subtotal: ${formatPrice(product.price * product.quantity)}</p>
                <button
                  onClick={() => removeFromCart(product._id, handleError)}
                  className="remove-item-button"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
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