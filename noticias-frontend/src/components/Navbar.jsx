import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from '../assets/logo_app_central.png';
import accidente from '../assets/accidente.jpeg';


const Navbar = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const isLogged = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo y nombre */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="logo app" className="h-15 w-auto object-contain" />
          {/* <img src={accidente} alt="logo app" className="h-10 w-auto object-contain" /> */}

          <span className="text-red-600 text-lg sm:text-xl font-bold whitespace-nowrap">
            Noticias Carretera Central
          </span>
        </Link>

        {/* Botón menú móvil */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-red-600 text-2xl focus:outline-none">
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menú principal desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {isLogged ? (
            <>
              <Link to="/crear" className="text-gray-700 hover:text-red-600 transition">
                Crear Noticia
              </Link>
              <Link to="/misnoticias" className="text-gray-700 hover:text-red-600 transition">
                Mis Noticias
              </Link>
              {userRole === "admin" && (
                <Link to="/admin/noticias" className="text-gray-700 hover:text-red-600 transition">
                  Admin Noticias
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-600 font-medium hover:underline transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-red-600 transition">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          {isLogged ? (
            <>
              <Link
                to="/crear"
                className="block text-gray-700 hover:text-red-600 transition"
                onClick={toggleMenu}
              >
                Crear Noticia
              </Link>
              <Link
                to="/misnoticias"
                className="block text-gray-700 hover:text-red-600 transition"
                onClick={toggleMenu}
              >
                Mis Noticias
              </Link>
              {userRole === "admin" && (
                <Link
                  to="/admin/noticias"
                  className="block text-gray-700 hover:text-red-600 transition"
                  onClick={toggleMenu}
                >
                  Admin Noticias
                </Link>
              )}
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="block text-red-600 font-medium hover:underline transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-gray-700 hover:text-red-600 transition"
                onClick={toggleMenu}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={toggleMenu}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
