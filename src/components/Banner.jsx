import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Banner.css';
import { api } from '../services/api';

const Banner = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        // --- INICIO DE LA CORRECCIÓN ---
        // 1. Leemos la URL del backend desde las variables de entorno.
        //    Para Vite, se usa `import.meta.env`.
        //    Añadimos un valor por defecto para que siga funcionando en tu local.
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        // 2. Construimos la URL completa para la petición fetch.
        const response = await fetch(`${API_URL}/api/products/latest/new`);
        // --- FIN DE LA CORRECCIÓN ---

        if (!response.ok) {
          // Si la respuesta no es exitosa (ej. 404 o 500), lanzamos un error.
          const errorData = await response.text(); // Leemos como texto para ver si es HTML
          throw new Error(`Error del servidor: ${response.status}. Respuesta: ${errorData}`);
        }
        
        const data = await response.json();
        setLatestProducts(data);

      } catch (error) {
        // Este console.error ahora nos dará un error mucho más detallado si algo falla.
        console.error("No se pudieron cargar los productos del carrusel:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestProducts();
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [latestProducts]);

  if (loading) {
    return <div className="banner-loading">Cargando novedades...</div>;
  }
  
  // Si después de cargar no hay productos, mostramos un mensaje amigable.
  if (latestProducts.length === 0) {
    return <div className="banner-error">No se pudieron cargar los productos destacados.</div>;
  }

  return (
    <div className="banner-container">
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]} 
      >
        {latestProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to={`/product/${product._id}`}>
              <img 
                src={product.image || 'https://placehold.co/1200x400/eee/ccc?text=Producto'} 
                alt={product.name} 
                className="banner-img" 
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;