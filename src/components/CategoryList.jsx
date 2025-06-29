// src/components/CategoryList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../pages/Categories.css'; 
import { api } from '../services/api'; // Se añade la importación del servicio

const CategoryList = ({ title }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // La llamada fetch se reemplaza por esta única línea
                const data = await api.get('/api/categories');
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando categorías...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <section className="categories">
            {/* El título se pasa como prop para que sea personalizable */}
            <h2 className="categories-title">{title}</h2>
            <div className="categories-grid">
                {categories.map((category) => (
                    <Link to={`/category/${category.name.toLowerCase()}`} key={category._id} className="category-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img 
                            src={category.imageUrl} 
                            alt={category.name} 
                            className="category-image"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'https://via.placeholder.com/150x150?text=Imagen';
                            }}
                        />
                        <h3>{category.name}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryList;