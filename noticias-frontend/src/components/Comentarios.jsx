import { useEffect, useState } from "react";
import axios from "../api/axios";
import imagen_usuario from "../assets/avatar-de-usuario.png";
import FormularioComentario from "./FormularioComentario";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"; // Para mostrar en español

const Comentarios = ({ noticiaId }) => {
  const [comentarios, setComentarios] = useState([]);

  const cargarComentarios = async () => {
    try {
      const res = await axios.get(`/comentarios/${noticiaId}`);
      console.log(res.data)
      setComentarios(res.data);
    } catch (err) {
      console.error("Error al cargar comentarios", err);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [noticiaId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Comentarios</h3>
      <div className="space-y-3 mb-4">
        {comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <div key={comentario._id} className="flex items-start gap-2">
              <img
                src={comentario.autor?.imagen || imagen_usuario}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">
                    {comentario.autor?.nombre || "Usuario"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comentario.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comentario.contenido}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aún no hay comentarios.</p>
        )}
      </div>
      <FormularioComentario noticiaId={noticiaId} onComentar={cargarComentarios} />
    </div>
  );
};

export default Comentarios;
