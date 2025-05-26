import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoticiaHeader from "./NoticiaHeader";
import NoticiaContenido from "./NoticiaContenido";
import NoticiaAcciones from "./NoticiaAcciones";

import Comentarios from "./Comentarios";

const NoticiaCard = ({
  _id,
  titulo,
  contenido,
  tipo,
  ubicacion,
  imagenes,
  autor,
  fecha,
  confirmaciones = [],
  forceShowComments = false, 
  expandible = true
}) => {
  console.log(_id);

  const navigate = useNavigate();
  const [mostrarComentarios, setMostrarComentarios] = useState(forceShowComments);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Verifica si el usuario está logueado (si existe el token)
  const isLogged = !!localStorage.getItem("token");

  // Si el usuario está logueado, obtiene el userId desde el localStorage (suponiendo que esté guardado allí)
  const userId = isLogged
    ? localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).id
      : null
    : null;

  const irADetalle = () => {
    navigate(`/noticias/${_id}`);
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 max-w-2xl mx-auto transition hover:shadow-lg">
      <div onClick={irADetalle} className="cursor-pointer">
        <NoticiaHeader autor={autor} fecha={fecha} />
        <NoticiaContenido
          titulo={titulo}
          contenido={contenido}
          tipo={tipo}
          ubicacion={ubicacion}
          imagenes={imagenes}
          expandible= {expandible}
        />
      </div>
      <NoticiaAcciones
        mostrarComentarios={mostrarComentarios}
        setMostrarComentarios={setMostrarComentarios}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        _id={_id}
        confirmaciones={confirmaciones}
        userId={userId}
      />
      {mostrarComentarios && <Comentarios noticiaId={_id} />}
    </div>
  );
};

export default NoticiaCard;
