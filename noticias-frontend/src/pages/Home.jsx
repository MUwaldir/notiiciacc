// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";

import Navbar from "../components/Navbar";
import NoticiaCard from "../components/NoticiasCard";

const Home = () => {
  const [noticias, setNoticias] = useState([]);
  const [page, setPage] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const tiposDeNoticias = [
    "todos",
    "Accidente",
    "Clima",
    "Bloqueo",
    "Obras",
    "Otro",
  ];

  console.log(noticias);
  useEffect(() => {
    cargarNoticias();
  }, [page, filtroTipo]); // 👈 ahora escucha también a los cambios en filtroTipo

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cargarNoticias = async () => {
    try {
      // const res = await axios.get(`/noticias?_page=${page}`);
      const res = await axios.get(
        `/noticias?_page=${page}${
          filtroTipo !== "todos" ? `&tipo=${filtroTipo}` : ""
        }`
      );

      const nuevasNoticias = res.data.data;

      setNoticias((prev) => {
        const noticiasUnicas = [...prev, ...nuevasNoticias].reduce(
          (acc, noticia) => {
            if (!acc.find((n) => n._id === noticia._id)) {
              acc.push(noticia);
            }
            return acc;
          },
          []
        );
        return noticiasUnicas;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };
  const iconosFiltro = {
    todos: "📰",
    Accidente: "🚗",
    Clima: "🌧️",
    Bloqueo: "🚧",
    Obras: "🏗️",
    Otro: "❓",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 mt-16 flex flex-col md:flex-row gap-6">
        {/* Sidebar en desktop, scroll horizontal en móvil */}
        <aside className="md:w-1/4 lg:w-1/5">
          <div className="sticky top-24 bg-white border border-red-200 rounded-2xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Filtrar por tipo
            </h2>
            <div className="hidden md:flex md:flex-col gap-3">
              {tiposDeNoticias.map((tipo) => {
                const isActive = filtroTipo === tipo;
                return (
                  <button
                    key={tipo}
                    onClick={() => {
                      setNoticias([]);
                      setPage(1);
                      setFiltroTipo(tipo);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-medium text-sm
                ${
                  isActive
                    ? "bg-red-600 text-white shadow border-red-600"
                    : "bg-white text-red-600 border-red-300 hover:bg-red-50"
                }`}
                  >
                    <span>{iconosFiltro[tipo]}</span> {tipo}
                  </button>
                );
              })}
            </div>

            {/* Filtros scrollables en móvil */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
              {tiposDeNoticias.map((tipo) => {
                const isActive = filtroTipo === tipo;
                return (
                  <button
                    key={tipo}
                    onClick={() => {
                      setNoticias([]);
                      setPage(1);
                      setFiltroTipo(tipo);
                    }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border whitespace-nowrap transition-all duration-300 text-sm
                ${
                  isActive
                    ? "bg-red-600 text-white shadow border-red-600"
                    : "bg-white text-red-600 border-red-300 hover:bg-red-50"
                }`}
                  >
                    <span>{iconosFiltro[tipo]}</span> {tipo}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Contenedor de noticias */}
        <section className="flex-1 space-y-6">
          {noticias.map((n) => (
            <NoticiaCard
              key={n._id}
              titulo={n.titulo}
              contenido={n.contenido}
              tipo={n.tipo}
              ubicacion={n.ubicacion}
              imagenes={n.imagenes}
              autor={n.autor}
              fecha={n.createdAt}
              _id={n._id}
              confirmaciones={n.confirmaciones}
              expandible={true}
            />
          ))}
        </section>
      </main>
    </>
  );
};

export default Home;
