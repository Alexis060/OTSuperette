import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import './ProductDetailPage.css'; 
import { api } from '../services/api';
function ProductDetailPage() {
  const { productId } = useParams(); // Hook para leer el ID del producto desde la URL
  const navigate = useNavigate(); // Hook para la navegación, lo usaremos en el botón de regresar
  const { addToCart } = useCart(); // Obtenemos la función para agregar al carrito desde nuestro contexto

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta función se ejecuta cuando el componente se monta para buscar los datos del producto
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('No se pudo encontrar el producto.');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // El efecto depende del productId, si cambia, se vuelve a ejecutar

  const handleAddToCart = () => {
    toast.success(`${product.name} fue agregado al carrito!`);
    addToCart(product);
  };

  // --- Renderizado Condicional ---
  if (loading) {
    return <div className="loading-container">Cargando producto...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!product) {
    return <div className="error-container">Producto no encontrado.</div>;
  }

  // --- Renderizado Principal ---
  const isOutOfStock = product.stock === 0;
  const hasSale = product.isOnSale && product.salePrice > 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image-container">
          <img src={product.image || 'https://placehold.co/400x400/eee/ccc?text=Sin+Imagen'} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category?.name || 'Sin Categoría'}</span>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="price-container">
            {hasSale ? (
              <>
                <span className="detail-sale-price">${product.salePrice.toFixed(2)}</span>
                <span className="detail-original-price">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="detail-regular-price">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="stock-container">
            <span className={`stock-status ${isOutOfStock ? 'out-of-stock' : 'available'}`}>
              {isOutOfStock ? 'Agotado' : 'Disponible'}
            </span>
          </div>
          
          <button 
            className="btn-green add-to-cart-detail" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
          </button>
          
          <button className="btn-green back-button" onClick={() => navigate(-1)}>
            ‹ Regresar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;