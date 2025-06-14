// src/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();

    // Estilos 
    const cardStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: 'white'
    };

    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    };

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '1000px', margin: '20px auto' }}>
            <h1>Panel de Control</h1>
            {user && <p style={{ fontSize: '1.2em' }}>Bienvenido, {user.name} ({user.role})</p>}
            
            <hr style={{ margin: '20px 0' }} />

            {/* --- SECCIÓN DE GESTIÓN (Para Admin y Operativo) --- */}
            <h2>Gestión General</h2>
            <div style={cardContainerStyle}>
                <Link to="/products/add" style={cardStyle} className="dashboard-card">
                    <h3>Agregar Nuevo Producto</h3>
                    <p>Crea y añade nuevos productos al catálogo.</p>
                </Link>
                <Link to="/manage-products" style={cardStyle} className="dashboard-card">
                    <h3>Gestionar Productos</h3>
                    <p>Edita o elimina productos existentes en la tienda.</p>
                </Link>
                {/* --- TARJETA AÑADIDA --- */}
                <Link to="/manage-categories" style={cardStyle} className="dashboard-card">
                    <h3>Gestionar Categorías</h3>
                    <p>Añade nuevas categorías de productos.</p>
                </Link>
            </div>
            
            {/* --- SECCIÓN DE GESTIÓN DE USUARIOS (Solo para Admin) --- */}
            {user && user.role === 'admin' && (
                <div style={{ marginTop: '40px' }}>
                    <hr style={{ margin: '20px 0' }} />
                    <h2>Gestión de Administrador</h2>
                    <div style={cardContainerStyle}>
                        <Link to="/admin/create-operative" style={cardStyle} className="dashboard-card">
                            <h3>Crear Usuario Operativo</h3>
                            <p>Añade nuevos usuarios con rol de operativo.</p>
                        </Link>
                        <Link to="/admin/manage-users" style={cardStyle} className="dashboard-card">
                            <h3>Gestionar Usuarios Operativos</h3>
                            <p>Elimina o edita usuarios operativos existentes.</p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;