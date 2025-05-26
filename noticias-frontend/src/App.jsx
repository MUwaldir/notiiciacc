// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CrearNoticia from './pages/CrearNoticia';
import AdminNoticias from './pages/AdminNoticias';

import MisNoticias from './pages/MisNoticias';
import NoticiaDetalle from './components/NoticiaDetalle';
import { useEffect } from 'react';
import { isTokenExpired } from './utils/auth';
import { EditarNoticia } from './pages/EditarNoticia';

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      console.log("Token expirado, cerrando sesión...");
      localStorage.removeItem("token");
      // Puedes redirigir al login también si estás usando react-router
      window.location.href = "/login";
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crear" element={<CrearNoticia />} />
        <Route path="/admin/noticias" element={<AdminNoticias />} />
        <Route path="/editar-noticia/:id" element={<EditarNoticia />} />
        <Route path="/misnoticias" element={<MisNoticias />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
      </Routes>
    </Router>
  );
}

export default App;
