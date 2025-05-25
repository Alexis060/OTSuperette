import './Banner.css';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import imagen1 from '../assets/banner1.png';
import imagen2 from '../assets/banner2.png';
import imagen3 from '../assets/banner3.png';

const Banner = () => {
  return (
    <div className="banner-container">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          // Desktop: configuración por defecto
          1024: {
            navigation: true,
          },
          // Móvil: desactiva navegación con flechas
          0: {
            navigation: false,
          }
        }}
      >
        <SwiperSlide>
          <img src={imagen1} alt="Banner 1" className="banner-img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagen2} alt="Banner 2" className="banner-img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagen3} alt="Banner 3" className="banner-img" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;