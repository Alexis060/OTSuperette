import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() { 
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart,
    loading
  } = useCart();
  const navigate = useNavigate();

  // LOG AÑADIDO PARA DIAGNÓSTICO
  console.log(
    `[CartPage RENDER] Timestamp: ${new Date().toISOString()}`, // Asumimos que este componente es una página de carrito
    'Loading (from CartContext):', loading,
    'Cart items (from CartContext):', JSON.stringify(cart, null, 2)
  );

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

      {loading ? (
        // Mensaje de carga un poco más específico para saber de dónde viene
        <div className="loading-cart">Cargando carrito (visto desde CartPage)...</div>
      ) : cart.length === 0 ? (
        // Mensaje de carrito vacío un poco más específico
        <p className="empty-cart-message">Tu carrito está vacío (visto desde CartPage).</p>
      ) : (
        <div className="cart-items">
          {cart.map((product) => {
            const imageSrc = product.image && product.image.startsWith('http')
              ? product.image
              : product.image
                ? `/productos/${product.image}`
                : '/productos/default.jfif';

            return (
              <div key={product._id} className="cart-item">
                <img
                  src={imageSrc}
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
                      onClick={() => updateQuantity(product._id, Math.max(1, product.quantity - 1))}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, product.quantity + 1)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <p>Subtotal: ${formatPrice(product.price * product.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(product._id)}
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
              onClick={clearCart}
              className="clear-cart-button"
              disabled={loading}
            >
              Vaciar carrito
            </button>
            <button
              className="checkout-button"
              onClick={() => navigate('/checkout')}
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