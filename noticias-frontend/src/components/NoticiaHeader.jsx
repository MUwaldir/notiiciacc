import imagen_usuario from "../assets/avatar-de-usuario.png";

const NoticiaHeader = ({ autor, fecha }) => {
  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="flex items-center mb-4">
      <img
        src={autor?.imagen || imagen_usuario}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div>
        <h3 className="text-sm font-semibold">
          {autor?.nombre || "Usuario"}
        </h3>
        <p className="text-xs text-gray-500">{formatearFecha(fecha)}</p>
      </div>
    </div>
  );
};

export default NoticiaHeader;
