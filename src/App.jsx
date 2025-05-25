import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Cart from './pages/Cart'; 
import Login from './pages/Login';
import DetallePokemon from './pages/DetallePokemon';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import 'boxicons/css/boxicons.min.css'; 
import './App.css';

function App() {
  return (

    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/ofertas" element={<Offers />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/pokemon/:id" element={<DetallePokemon />} />
            <Route path="/pokemon" element={<DetallePokemon />} /> 
            <Route path="/carrito" element={<Cart />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Profile />} />
            </Route>
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;