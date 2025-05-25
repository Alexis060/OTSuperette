import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../pages/Categories';
import Footer from '../components/Footer';

function Home() {
  return (
    <div>
      <Banner />
      <h1>Ofertas de temporada</h1>
      <Categories />
      <FeaturedProducts />
    </div>
  );
}

export default Home;
