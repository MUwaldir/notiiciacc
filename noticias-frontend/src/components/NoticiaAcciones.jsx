import { useEffect, useState } from "react";
import {
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaLink,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NoticiaAcciones = ({
  mostrarComentarios,
  setMostrarComentarios,
  menuAbierto,
  setMenuAbierto,
  _id,
  confirmaciones = [],
  userId,
}) => {
  const urlNoticia = `${window.location.origin}/noticias/${_id}`;
  const [totalConfirmaciones, setTotalConfirmaciones] = useState(confirmaciones.length);
  const [usuarioConfirmo, setUsuarioConfirmo] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmaciones.includes(userId)) {
      setUsuarioConfirmo(true);
    }
  }, [confirmaciones, userId]);

  const toggleConfirmacion = async () => {
    if (!userId) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para confirmar una noticia.",
        confirmButtonText: "Ir a iniciar sesión",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.patch(`/noticias/${_id}/confirmar`);
      setUsuarioConfirmo(res.data.confirmado);
      setTotalConfirmaciones(res.data.totalConfirmaciones);
    } catch (err) {
      console.error("Error al confirmar/quitar confirmación", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenuCompartir = () => setMenuAbierto(!menuAbierto);

  const copiarEnlace = () => {
    navigator.clipboard.writeText(urlNoticia);
    alert("¡Enlace copiado al portapapeles!");
    setMenuAbierto(false);
  };

  return (
    <div className="flex justify-around text-gray-600 text-sm pt-2 border-t border-gray-200">
      <button
        className={`flex items-center gap-1 ${
          usuarioConfirmo ? "text-green-600 font-semibold" : "hover:text-green-600"
        }`}
        onClick={toggleConfirmacion}
        disabled={loading}
      >
        <FaCheckCircle /> {usuarioConfirmo ? "Confirmado" : "Confirmar"} ({totalConfirmaciones})
      </button>

      <button
        className="hover:text-blue-600"
        onClick={() => setMostrarComentarios(!mostrarComentarios)}
      >
        💬 Comentar
      </button>

      <div className="relative">
        <button
          onClick={toggleMenuCompartir}
          className="flex items-center gap-1 text-green-600 hover:text-green-800"
        >
          <FaShareAlt />
          <span>Compartir</span>
        </button>

        {menuAbierto && (
          <div className="absolute z-10 mt-2 right-0 bg-white border rounded shadow-lg w-44 text-sm">
            <button
              onClick={copiarEnlace}
              className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
            >
              <FaLink className="mr-2" /> Copiar enlace
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(urlNoticia)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 hover:bg-gray-100"
            >
              <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlNoticia)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 hover:bg-gray-100"
            >
              <FaFacebook className="mr-2 text-blue-600" /> Facebook
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticiaAcciones;
