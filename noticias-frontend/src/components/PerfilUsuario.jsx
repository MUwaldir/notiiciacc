import axios from "../api/axios";
import React, { useEffect, useState } from "react";

const PerfilUsuario = ({ noticias = [] }) => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUsuario(userObj);
        setNombre(userObj.nombre);
        setImagenPreview(userObj.imagen || "");
        setImagenPreview(null); // aseguramos que no haya preview inicial
      } catch (e) {
        console.error("Error al parsear los datos del usuario:", e);
      }
    }
  }, []);

  if (!usuario) return null;

  const avatarUrl = imagenPreview
    ? imagenPreview
    : usuario?.imagen ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        usuario?.nombre || "Usuario"
      )}&background=0D8ABC&color=fff&size=128`;

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualizarPerfil = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    if (imagenArchivo) {
      formData.append("imagen", imagenArchivo);
    }
    console.log("Enviando:", {
      nombre,
      imagenArchivo,
    });
    

    try {
      const res = await axios.put(`/usuarios/${usuario.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data; // ✅ correctamente
      setUsuario(data);
      localStorage.setItem("user", JSON.stringify(data));
      setEditando(false);
    } catch (error) {
      console.error("Error actualizando el perfil:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setImagenPreview(null); // limpiamos el preview
    // cualquier otro estado que tengas para edición
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 max-w-3xl mx-auto">
      <div className="flex items-center space-x-6">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-red-500 shadow-md"
        />
        <div className="flex-1">
          {editando ? (
            <>
              <input
                className="block w-full border rounded p-2 mb-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen de perfil
                </label>

                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">
                    Seleccionar imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArchivoChange}
                      className="hidden"
                    />
                  </label>

                  {imagenArchivo && (
                    <span className="text-sm text-gray-600">
                      {imagenArchivo.name}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleActualizarPerfil}
                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Guardar
              </button>
              <button
                onClick={cancelarEdicion}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                {usuario.nombre}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{usuario.email}</p>
              <p className="text-red-600 font-medium">
                Noticias publicadas:{" "}
                <span className="font-bold">{noticias.length}</span>
              </p>
              <button
                onClick={() => setEditando(true)}
                className="mt-2 text-red-600 hover:underline text-sm"
              >
                Editar perfil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
