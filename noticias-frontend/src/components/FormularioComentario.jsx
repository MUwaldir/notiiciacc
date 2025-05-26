// src/components/FormularioComentario.jsx
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const FormularioComentario = ({ noticiaId, onComentar }) => {
  const [nuevoComentario, setNuevoComentario] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLogged = !!token;

  const enviarComentario = async () => {
    if (!isLogged) return navigate("/login");

    if (!nuevoComentario.trim()) return;

    try {
      await axios.post(`/comentarios`, {
        contenido: nuevoComentario,
        noticia: noticiaId,
      });
      setNuevoComentario("");
      onComentar();
    } catch (err) {
      console.error("Error al comentar", err);
    }
  };

  return isLogged ? (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-1 text-sm"
        placeholder="Escribe un comentario..."
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
      />
      <button
        onClick={enviarComentario}
        className="text-sm text-blue-600 hover:underline"
      >
        Enviar
      </button>
    </div>
  ) : (
    <p className="text-sm text-gray-500 italic">
      <button
        className="text-blue-600 underline"
        onClick={() => navigate("/login")}
      >
        Inicia sesión
      </button>{" "}
      para comentar.
    </p>
  );
};

export default FormularioComentario;
