// src/pages/MisNoticias.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import PerfilUsuario from "../components/PerfilUsuario";

const MisNoticias = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const fetchMisNoticias = async () => {
      try {
        const response = await api.get("/noticias/usuario");
        console.log(response.data)
        setNoticias(response.data);
      } catch (error) {
        console.error("Error al obtener tus noticias:", error);
      }
    };

    fetchMisNoticias();
  }, []);

  const eliminarNoticia = async (id) => {
    const confirmar = confirm(
      "¿Estás seguro de que deseas eliminar esta noticia?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/noticias/${id}`);
      setNoticias((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8b mt-20 mb-20">
        <PerfilUsuario noticias={noticias}/>
        <h1 className="text-3xl font-bold mb-6 text-center pt-5">Mis Noticias</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Título</th>
                <th className="py-3 px-4 text-left">Contenido</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticias.length > 0 ? (
                noticias.map((noticia) => (
                  <tr key={noticia._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{noticia.titulo}</td>
                    <td className="py-3 px-4 truncate max-w-xs">
                      {noticia.contenido}
                    </td>
                    <td className="py-3 px-4 capitalize">{noticia.estado}</td>
                    <td className="py-3 px-4 space-x-2">
                      <Link
                        to={`/editar-noticia/${noticia._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    Aún no has creado ninguna noticia.
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

export default MisNoticias;
