// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes y contextos
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Importa tus páginas
import Home from './pages/Home';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DetallePokemon from './pages/DetallePokemon';

// Importa las nuevas páginas de Administración y Gestión
import CreateOperativeUserPage from './pages/CreateOperativeUserPage';
import ManageOperativeUsersPage from './pages/ManageOperativeUsersPage';
import AddProductPage from './pages/AddProductPage';
import ManageProductsPage from './pages/ManageProductsPage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage'; // <--- NUEVA IMPORTACIÓN

// Importa tus estilos
import 'boxicons/css/boxicons.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                {/* --- Rutas Públicas --- */}
                {/* Cualquiera puede acceder a estas rutas */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                
                <Route path="/search" element={<SearchResultsPage />} /> {/* <--- RUTA AÑADIDA PARA LA BÚSQUEDA */}
                
                <Route path="/ofertas" element={<Offers />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/pokemon/:id" element={<DetallePokemon />} />
                <Route path="/pokemon" element={<DetallePokemon />} />
                <Route path="/carrito" element={<Cart />} />

                {/* --- Rutas Protegidas para CUALQUIER Usuario Autenticado --- */}
                {/* Solo usuarios logueados (sin importar el rol) pueden acceder */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/perfil" element={<Profile />} />
                </Route>

                {/* --- Rutas Protegidas solo para Administradores ('admin') --- */}
                {/* Solo usuarios con rol 'admin' pueden acceder */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/create-operative" element={<CreateOperativeUserPage />} />
                  <Route path="/admin/manage-users" element={<ManageOperativeUsersPage />} />
                </Route>

                {/* --- Rutas Protegidas para Operativos y Administradores --- */}
                {/* Solo usuarios con rol 'operative' o 'admin' pueden acceder */}
                <Route element={<ProtectedRoute allowedRoles={['operative', 'admin']} />}>
                  <Route path="/products/add" element={<AddProductPage />} />
                  <Route path="/manage-products" element={<ManageProductsPage />} />
                </Route>
                
                {/* --- Ruta para Páginas No Encontradas (404) --- */}
                <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;