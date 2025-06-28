// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importa componentes y contextos
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Importa páginas
import Home from './pages/Home';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DetallePokemon from './pages/DetallePokemon';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CheckoutPage from './pages/CheckoutPage';
import RegisterPage from './pages/RegisterPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import HistoryPage from './pages/HistoryPage';
import AboutUsPage from './pages/AboutUsPage';
import ProductDetailPage from './pages/ProductDetailPage'; 

// Importa las páginas de Administración y Gestión
import DashboardPage from './pages/DashboardPage';
import CreateOperativeUserPage from './pages/CreateOperativeUserPage';
import ManageOperativeUsersPage from './pages/ManageOperativeUsersPage';
import EditUserPage from './pages/EditUserPage';
import AddProductPage from './pages/AddProductPage';
import ManageProductsPage from './pages/ManageProductsPage';
import EditProductPage from './pages/EditProductPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import EditCategoryPage from './pages/EditCategoryPage';

// Importa estilos
import 'boxicons/css/boxicons.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />

          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                {/*Rutas Públicas*/}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/ofertas" element={<Offers />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/pokemon/:id" element={<DetallePokemon />} />
                <Route path="/pokemon" element={<DetallePokemon />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} /> {/* <-- 2. AÑADIR ESTA LÍNEA */}

                {/* --- INICIO DE RUTAS DEL FOOTER --- */}
                <Route path="/preguntas-frecuentes" element={<FaqPage />} />
                <Route path="/terminos-y-condiciones" element={<TermsPage />} />
                <Route path="/nuestra-historia" element={<HistoryPage />} />
                <Route path="/quienes-somos" element={<AboutUsPage />} />
                {/* --- FIN DE RUTAS DEL FOOTER --- */}

                {/*Rutas Protegidas para CUALQUIER Usuario Autenticado*/}
                <Route element={<ProtectedRoute />}>
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Route>

                {/*Rutas Protegidas para Operativos y Administradores*/}
                <Route element={<ProtectedRoute allowedRoles={['operative', 'admin']} />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/products/add" element={<AddProductPage />} />
                  <Route path="/manage-products" element={<ManageProductsPage />} />
                  <Route path="/edit-product/:productId" element={<EditProductPage />} />
                  <Route path="/manage-categories" element={<ManageCategoriesPage />} />
                  <Route path="/edit-category/:id" element={<EditCategoryPage />} />
                </Route>

                {/*Rutas Protegidas ADICIONALES solo para 'admin'*/}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/create-operative" element={<CreateOperativeUserPage />} />
                  <Route path="/admin/manage-users" element={<ManageOperativeUsersPage />} />
                  <Route path="/admin/edit-user/:userId" element={<EditUserPage />} />
                </Route>

                {/*Ruta para Páginas No Encontradas (404)*/}
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
