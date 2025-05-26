import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import NoticiaCard from "./NoticiasCard";
import Navbar from "./Navbar";

const NoticiaDetalle = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const res = await axios.get(`/noticias/${id}`);
        setNoticia(res.data);
      } catch (error) {
        console.error("Error al cargar la noticia", error);
      }
    };

    fetchNoticia();
  }, [id]);

  if (!noticia) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <NoticiaCard
          key={noticia._id}
          titulo={noticia.titulo}
          contenido={noticia.contenido}
          imagenes={noticia.imagenes}
          autor={noticia.autor}
          fecha={noticia.createdAt}
          _id={noticia._id}
          likes={noticia.likes}
          forceShowComments={true} // 👈 mostrar comentarios directamente
          expandible={false}
        />
      </div>
    </>
  );
};

export default NoticiaDetalle;
