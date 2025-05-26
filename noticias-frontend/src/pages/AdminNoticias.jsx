// src/pages/AdminNoticias.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminNoticias = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await api.get('/noticias/admin');
        console.log(response.data)
        setNoticias(response.data);
      } catch (error) {
        console.error('Error al obtener las noticias:', error);
      }
    };

    fetchNoticias();
  }, []);

  const eliminarNoticia = async (id) => {
    const confirmar = confirm('¿Estás seguro de eliminar esta noticia?');
    if (!confirmar) return;

    try {
      await api.delete(`/noticias/${id}`);
      setNoticias((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Noticias</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Título</th>
              <th className="py-3 px-4 text-left">Contenido</th>
              <th className="py-3 px-4 text-left">Autor</th>

              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((noticia) => (
              <tr key={noticia._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{noticia.titulo}</td>
                <td className="py-3 px-4 truncate max-w-xs">{noticia.contenido}</td>
                <td className="py-3 px-4 capitalize">{noticia.autor?.nombre}</td>
                <td className="py-3 px-4 capitalize">{noticia.estado}</td>

                <td className="py-3 px-4 space-x-2">
                  <Link
                    to={`/editar-noticia/${noticia._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarNoticia(noticia._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {noticias.length === 0 && (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  No hay noticias disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminNoticias;
