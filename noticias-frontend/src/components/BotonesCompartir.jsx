// src/components/BotonesCompartir.jsx
import { useState } from "react";
import { FaLink, FaWhatsapp, FaFacebook, FaShareAlt } from "react-icons/fa";

const BotonesCompartir = ({ url }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const copiarEnlace = () => {
    navigator.clipboard.writeText(url);
    alert("¡Enlace copiado al portapapeles!");
    setMenuAbierto(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="flex items-center gap-2 text-green-600 hover:text-green-800"
      >
        <FaShareAlt />
        <span>Compartir</span>
      </button>

      {menuAbierto && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg w-44 text-sm">
          <button
            onClick={copiarEnlace}
            className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
          >
            <FaLink className="mr-2" /> Copiar enlace
          </button>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 hover:bg-gray-100"
          >
            <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 hover:bg-gray-100"
          >
            <FaFacebook className="mr-2 text-blue-600" /> Facebook
          </a>
        </div>
      )}
    </div>
  );
};

export default BotonesCompartir;
