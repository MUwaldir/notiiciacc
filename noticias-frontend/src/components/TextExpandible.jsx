import { useState } from "react";

const TextoExpandible = ({
  texto,
  maxPalabras = 40,
  className = "",
  expandible = true,
}) => {
  console.log(expandible);
  const [expandido, setExpandido] = useState(false);

  const palabras = texto?.split(" ") || [];

  // Si no se debe limitar, mostrar el texto completo
  if (!expandible || palabras.length <= maxPalabras) {
    return <p className={`${className} whitespace-pre-line`}>{texto}</p>;
  }

  const textoVisible = palabras.slice(0, maxPalabras).join(" ") + "...";

  return (
    <p className={`${className} whitespace-pre-line`}>
      {expandido ? texto : textoVisible}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita que el clic se propague al div padre
          setExpandido(!expandido);
        }}
        className="text-blue-600 ml-2 hover:underline"
      >
        {expandido ? "Ver menos" : "Ver más"}
      </button>
    </p>
  );
};

export default TextoExpandible;
