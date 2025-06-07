// src/pages/Categories.jsx
import './Categories.css';
import bebidasImg from '../assets/bebidas.png';
import snacksImg from '../assets/snacks.png';
import lacteosImg from '../assets/lacteos.png';
import higieneImg from '../assets/higiene.png';

// 1. Asegúrate de que esta importación exista
import { Link } from 'react-router-dom';

function Categories() {
  const categories = [
    { id: 1, name: 'Bebidas', image: bebidasImg, path: 'bebidas' },
    { id: 2, name: 'Snacks', image: snacksImg, path: 'snacks' },
    { id: 3, name: 'Lácteos', image: lacteosImg, path: 'lacteos' },
    { id: 4, name: 'Higiene', image: higieneImg, path: 'higiene' },
  ];

  return (
    <section className="categories">
      <h2 className="categories-title">Categorías</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          // 2. Asegúrate de que cada tarjeta esté envuelta en <Link>
          <Link to={`/category/${category.path}`} key={category.id} className="category-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img 
              src={category.image} 
              alt={category.name} 
              className="category-image"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/150x150?text=Imagen+no+disponible';
              }}
            />
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;