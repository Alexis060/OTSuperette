// src/pages/Home.jsx
import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryList from '../components/CategoryList'; 

function Home() {
  return (
    <div>
      <Banner />

      <CategoryList title="Nuestras Categorías" />

      <FeaturedProducts />

    </div>
  );
}

export default Home;