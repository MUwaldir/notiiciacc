import { useEffect, useState } from "react";
import TextoExpandible from "./TextExpandible";

const NoticiaContenido = ({
  titulo,
  contenido,
  tipo = "otro",
  ubicacion = "Desconocida",
  imagenes = [],
  expandible = true,
}) => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [indiceActual, setIndiceActual] = useState(0);
  // const cerrarModal = () => setImagenSeleccionada(null);
  const iconoPorTipo = {
    accidente: "🚧",
    bloqueo: "⛔",
    clima: "🌧️",
    obras: "🛠️",
    otro: "📌",
  };

  const cerrarModal = () => {
    setImagenSeleccionada(null);
    setIndiceActual(0);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imagenSeleccionada) return;
      if (e.key === "ArrowRight") {
        setIndiceActual((prev) => (prev + 1) % imagenes.length);
      } else if (e.key === "ArrowLeft") {
        setIndiceActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
      } else if (e.key === "Escape") {
        cerrarModal();
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [imagenSeleccionada, imagenes.length]);
  const tipoNormalizado = tipo?.toLowerCase?.();
  const iconoTipo = iconoPorTipo[tipoNormalizado] || "📌";

  return (
    <>
      <div className="mb-6 mt-6">
        {/* Título */}
        <h4 className="text-lg font-bold mb-2">
          <TextoExpandible
            texto={titulo}
            maxPalabras={15}
            className="inline"
            expandible={expandible}
          />
        </h4>

        {/* Contenido */}
        <TextoExpandible
          texto={contenido}
          maxPalabras={50}
          className="text-sm text-gray-700 mb-4"
          expandible={expandible}
        />

        {/* Tipo */}
        <div className="text-sm mt-1 text-gray-500">
          <span className="font-semibold">Tipo:</span> {iconoTipo} {tipo}
        </div>

        {/* Ubicación */}
        <div className="text-sm text-gray-500">
          <span className="font-semibold">Ubicación:</span> {ubicacion}
        </div>
        {/* Galería en pantallas grandes */}
        {/* Galería en pantallas grandes */}
        {imagenes?.length > 0 && (
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {imagenes.map((img, index) => (
              <div
                key={index}
                className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-xl cursor-pointer shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenSeleccionada(img);
                }}
              >
                <img
                  src={img}
                  alt={`imagen-${index}`}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        )}

        {/* Slider horizontal en móvil */}
        {imagenes.length > 0 && (
          <div className="block sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory mt-4">
            {imagenes.map((img, idx) => (
              <div
                key={idx}
                className="min-w-[75%] max-w-[75%] flex-shrink-0 snap-center"
              >
                <img
                  src={img}
                  alt={`Imagen ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagenSeleccionada(img);
                  }}
                  className="w-full h-48 object-cover rounded-xl shadow cursor-pointer transition hover:opacity-80"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para imagen en pantalla completa */}
      {/* Modal para imagen en pantalla completa */}
      {imagenSeleccionada && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    onClick={cerrarModal}
  >
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Imagen */}
      <img
        src={imagenes[indiceActual]}
        alt={`Imagen ${indiceActual + 1}`}
        className="max-w-full max-h-[80vh] object-contain mx-auto rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Botón cerrar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          cerrarModal();
        }}
        className="absolute top-4 right-4 text-white text-3xl font-bold"
      >
        ×
      </button>

      {/* Flechas de navegación */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndiceActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black/50 rounded-full px-3 py-1"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndiceActual((prev) => (prev + 1) % imagenes.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black/50 rounded-full px-3 py-1"
          >
            ›
          </button>
        </>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default NoticiaContenido;
