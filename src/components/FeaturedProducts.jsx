import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const { addToCart, loading: cartLoading } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const validProducts = data.filter(p => 
          p._id && p.name && p.price
        ).map(product => ({
          ...product,
          image: product.image || '/productos/default.jfif'
        }));
        
        setProducts(validProducts);
        
      } catch (error) {
        setError('Error cargando productos');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (cartLoading) {
      console.log('Operación de carrito en progreso...');
      return;
    }
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="featured-products">
      <h2>Productos Destacados</h2>
      <div className="product-grid">
        {products.length === 0 ? (
          <div className="empty">No hay productos disponibles</div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/productos/default.jfif';
                  e.target.onerror = null;
                }}
              />
              <h3>{product.name}</h3>
              <p>${product.price?.toFixed(2) || '0.00'}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart-btn"
                disabled={cartLoading}
              >
                {cartLoading ? 'Añadiendo...' : 'Añadir al carrito'}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;