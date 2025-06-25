import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

// FUNCIÓN DE UTILIDAD: ALGORITMO DE LUHN (sin cambios)
const luhnCheck = (val) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = val.length - 1; i >= 0; i--) {
    let digit = parseInt(val.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0;
};


const CheckoutPage = () => {
  const { cart, clearCartFrontend, getTotal } = useCart(); 
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  // Función handleCheckout
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const cardNumber = formData.cardNumber.replace(/\s+/g, '');
    if (!luhnCheck(cardNumber)) {
      setError('El número de tarjeta no es válido.');
      setIsLoading(false);
      return;
    }

    const dateParts = formData.expiryDate.split('/');
    if (dateParts.length !== 2 || dateParts[0].length !== 2 || dateParts[1].length !== 2) {
      setError('El formato de la fecha de expiración debe ser MM/AA.');
      setIsLoading(false);
      return;
    }
    const [month, year] = dateParts;
    const expiryYear = parseInt(year, 10) + 2000;
    const expiryMonth = parseInt(month, 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      setError('La tarjeta ha expirado.');
      setIsLoading(false);
      return;
    }
    
    if (!/^\d{3}$/.test(formData.cvv)) {
      setError('El código CVV debe tener 3 dígitos.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/api/cart/checkout', {}, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      clearCartFrontend(); 
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error de comunicación con el servidor.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  
  if (success) {
    return (
      <div className="checkout-container success-message">
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu pedido ha sido procesado exitosamente.</p>
        <p>Serás redirigido a la página principal en unos segundos...</p>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
      return (
          <div className="checkout-container">
              <h2>Checkout</h2>
              <p>Tu carrito está vacío. <a href="/">Sigue comprando</a>.</p>
          </div>
      )
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <div className="checkout-layout">
        
        <div className="order-summary">
          <h3>Resumen de tu Pedido</h3>
          {cart.map(item => {
            const effectivePrice = item.isOnSale && item.salePrice > 0 ? item.salePrice : item.price;
            
            return (
              <div key={item._id} className="summary-item">
                <img src={item.image && item.image.startsWith('http') ? item.image : `/productos/${item.image}`} alt={item.name} className="summary-item-image" />
                <div className="summary-item-details">
                  <span className="summary-item-name">{item.name}</span>
                  <span>Cantidad: {item.quantity}</span>
                </div>
                {/* Usamos el precio efectivo para el subtotal */}
                <span className="summary-item-price">${(effectivePrice * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="summary-total">
            <strong>Total:</strong>
            <strong>${getTotal()}</strong>
          </div>
        </div>

        <div className="payment-form">
   
          <h3>Información de Pago (Simulado)</h3>
          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label htmlFor="name">Nombre en la tarjeta</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Dirección de Envío</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="cardNumber">Número de Tarjeta</label>
              <input type="text" id="cardNumber" name="cardNumber" placeholder="xxxx xxxx xxxx xxxx" value={formData.cardNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="expiryDate">Fecha de Expiración</label>
                    <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/AA" value={formData.expiryDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} required />
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <button type="submit" className="checkout-button" disabled={isLoading}>
              {isLoading ? 'Validando Pago...' : 'Confirmar Compra'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;