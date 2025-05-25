import './Categories.css';
import bebidasImg from '../assets/bebidas.png';
import snacksImg from '../assets/snacks.png';
import lacteosImg from '../assets/lacteos.png';
import higieneImg from '../assets/higiene.png';

function Categories() {
  const categories = [
    { id: 1, name: 'Bebidas', image: bebidasImg },
    { id: 2, name: 'Snacks', image: snacksImg },
    { id: 3, name: 'Lácteos', image: lacteosImg },
    { id: 4, name: 'Higiene', image: higieneImg },
  ];

  return (
    <section className="categories">
      <h2 className="categories-title">Categorías</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
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
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;