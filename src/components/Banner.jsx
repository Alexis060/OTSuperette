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
        const data = await api.get('/api/products/latest/new');
        setLatestProducts(data);
      } catch (error) {
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