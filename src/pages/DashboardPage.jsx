// src/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'boxicons';
import { api } from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="page-container dashboard-page">
            {/* Contenedor para el título y el botón de regreso */}
            <div className="dashboard-header">
                <h1>Panel de Control</h1>
                <Link to="/" className="dashboard-back-link">
                    <box-icon name='home-alt' color='#ffffff'></box-icon>
                    Ir al Inicio
                </Link>
            </div>
            
            {user && <p className="dashboard-welcome-message">Bienvenido, {user.name} ({user.role})</p>}
            
            <section>
                <h2>Gestión General</h2>
                <div className="dashboard-card-container">
                    <Link to="/products/add" className="dashboard-card">
                        <div className="dashboard-card-icon"><box-icon name='plus-circle' type='solid'></box-icon></div>
                        <div className="dashboard-card-text">
                            <h3>Agregar Nuevo Producto</h3>
                            <p>Crea y añade nuevos productos al catálogo.</p>
                        </div>
                    </Link>
                    <Link to="/manage-products" className="dashboard-card">
                        <div className="dashboard-card-icon"><box-icon name='edit' type='solid'></box-icon></div>
                        <div className="dashboard-card-text">
                            <h3>Gestionar Productos</h3>
                            <p>Edita o elimina productos existentes en la tienda.</p>
                        </div>
                    </Link>
                    <Link to="/manage-categories" className="dashboard-card">
                        <div className="dashboard-card-icon"><box-icon name='category' type='solid'></box-icon></div>
                        <div className="dashboard-card-text">
                            <h3>Gestionar Categorías</h3>
                            <p>Añade nuevas categorías de productos.</p>
                        </div>
                    </Link>
                </div>
            </section>
            
            {user && user.role === 'admin' && (
                <section>
                    <h2>Gestión de Administrador</h2>
                    <div className="dashboard-card-container">
                        <Link to="/admin/create-operative" className="dashboard-card">
                            <div className="dashboard-card-icon"><box-icon name='user-plus' type='solid'></box-icon></div>
                            <div className="dashboard-card-text">
                                <h3>Crear Usuario Operativo</h3>
                                <p>Añade nuevos usuarios con rol de operativo.</p>
                            </div>
                        </Link>
                        <Link to="/admin/manage-users" className="dashboard-card">
                           <div className="dashboard-card-icon"><box-icon name='user-detail' type='solid'></box-icon></div>
                           <div className="dashboard-card-text">
                                <h3>Gestionar Usuarios Operativos</h3>
                                <p>Elimina o edita usuarios operativos existentes.</p>
                           </div>
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default DashboardPage;
