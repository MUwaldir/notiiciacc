import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

export const EditarNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [noticia, setNoticia] = useState({
    titulo: "",
    contenido: "",
    tipo: "",
    ubicacion: "",
    imagenes: [],
  });

  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [previewNuevas, setPreviewNuevas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerNoticia = async () => {
      try {
        const res = await axios.get(`/noticias/${id}`);
        setNoticia(res.data);
      } catch (error) {
        console.error("Error al obtener la noticia", error);
      }
    };

    obtenerNoticia();
  }, [id]);

  const handleChange = (e) => {
    setNoticia({ ...noticia, [e.target.name]: e.target.value });
  };

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);
    const total =
      noticia.imagenes.length + imagenesNuevas.length + files.length;

    if (total > 5) {
      setError("Máximo 5 imágenes por noticia.");
      return;
    }

    setImagenesNuevas((prev) => [...prev, ...files]);
    const nuevasPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewNuevas((prev) => [...prev, ...nuevasPreviews]);
    setError("");
  };

  const handleEliminarImagen = (url) => {
    const confirmar = window.confirm("¿Eliminar esta imagen?");
    if (!confirmar) return;

    const nuevas = noticia.imagenes.filter((img) => img !== url);
    setNoticia((prev) => ({ ...prev, imagenes: nuevas }));

    if (nuevas.length + imagenesNuevas.length <= 5) {
      setError("");
    }
  };

  const handleEliminarPreview = (index) => {
    const nuevasPrev = [...previewNuevas];
    const nuevasImgs = [...imagenesNuevas];

    nuevasPrev.splice(index, 1);
    nuevasImgs.splice(index, 1);

    setPreviewNuevas(nuevasPrev);
    setImagenesNuevas(nuevasImgs);

    if (noticia.imagenes.length + nuevasImgs.length <= 5) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (noticia.imagenes.length + imagenesNuevas.length > 5) {
      setError("Máximo 5 imágenes por noticia.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", noticia.titulo);
    formData.append("contenido", noticia.contenido);
    formData.append("tipo", noticia.tipo);
    formData.append("ubicacion", noticia.ubicacion);


    formData.append("imagenesExistentes", JSON.stringify([...noticia.imagenes]));

    
    imagenesNuevas.forEach((imagen) => {
      formData.append("imagenes", imagen);
    });

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      await axios.put(`/noticias/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Noticia actualizada correctamente");
      navigate("/");
    } catch (error) {
      toast.error("Error al actualizar la noticia");
      console.error("Error en el submit:", error);
    }
  };

  const totalImagenes = noticia.imagenes.length + imagenesNuevas.length;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow pt-5 mt-20">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Editar Noticia</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={noticia.titulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              name="contenido"
              value={noticia.contenido}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="5"
              required
            ></textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipo" className="block font-semibold mb-1">
                  Tipo de noticia
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={noticia.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                >
                  <option value="">Seleccione tipo de noticia</option>
                  <option value="accidente">🚑 Accidente</option>
                  <option value="bloqueo">🚧 Bloqueo</option>
                  <option value="clima">🌤️ Clima</option>
                  <option value="obras">🏗️ Obras</option>
                  <option value="otro">❓ Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="ubicacion" className="block font-semibold mb-1">
                  Ubicación
                </label>
                <input
                  id="ubicacion"
                  name="ubicacion"
                  type="text"
                  placeholder="Ej. Ticlio, puente infernillo"
                  value={noticia.ubicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Imágenes</label>

            <div className="text-sm text-gray-700 mb-2">
              Tienes {noticia.imagenes.length} imagen(es) actuales y has
              seleccionado {imagenesNuevas.length} nueva(s).
              <br />
              <span
                className={
                  totalImagenes > 5
                    ? "text-red-600 font-semibold"
                    : "text-gray-700"
                }
              >
                Total: {totalImagenes} / 5 permitidas.
              </span>
            </div>

            <label className="inline-block bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 cursor-pointer hover:bg-red-200">
              Seleccionar imágenes
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagenChange}
                className="hidden"
              />
            </label>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Imágenes actuales */}
          {noticia.imagenes.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-700">
                Imágenes actuales
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-2">
                {noticia.imagenes.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`imagen-${index}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow"
                    />
                    <button
                      type="button"
                      onClick={() => handleEliminarImagen(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Nuevas imágenes */}
          {previewNuevas.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-700">
                Nuevas imágenes seleccionadas
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-2">
                {previewNuevas.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`nueva-imagen-${index}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow"
                    />
                    <button
                      type="button"
                      onClick={() => handleEliminarPreview(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-10"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </>
  );
};
