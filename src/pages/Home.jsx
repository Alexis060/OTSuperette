// src/pages/Home.jsx
import React, { useState } from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryList from '../components/CategoryList'; 

function Home() {
  const [cartError, setCartError] = useState(null);

  const handleError = (message) => {
    setCartError(message);
    setTimeout(() => {
      setCartError(null);
    }, 5000);
  };

  return (
    <div>
      <Banner />

      {/*mostrar el error de stock */}
      {cartError && (
        <div 
          className="cart-error-message" 
          style={{ 
              maxWidth: '800px', 
              margin: '2rem auto',
              padding: '1rem',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold'
          }}
        >
          {cartError}
        </div>
      )}

      {/* Aquí le pasamos la función handleError a FeaturedProducts */}
      <FeaturedProducts onAddToCartError={handleError} />

      {/* Tu CategoryList, si lo usas, no se ve afectado */}
      <CategoryList title="Nuestras Categorías" />

    </div>
  );
}

export default Home;