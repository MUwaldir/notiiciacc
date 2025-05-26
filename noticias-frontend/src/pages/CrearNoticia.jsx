import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CrearNoticia = () => {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    imagenes: [],
    tipo: "", // nuevo
    ubicacion: "", // nuevo
  });

  const [previewImgs, setPreviewImgs] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = form.imagenes.length + files.length;

    if (totalImages > 5) {
      alert("Máximo 5 imágenes permitidas");
      return;
    }

    const updatedImages = [...form.imagenes, ...files];
    const updatedPreviews = [
      ...previewImgs,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    setForm({ ...form, imagenes: updatedImages });
    setPreviewImgs(updatedPreviews);
  };

  const removeImage = (index) => {
    const updatedImages = form.imagenes.filter((_, i) => i !== index);
    const updatedPreviews = previewImgs.filter((_, i) => i !== index);

    setForm({ ...form, imagenes: updatedImages });
    setPreviewImgs(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("contenido", form.contenido);
    formData.append("tipo", form.tipo);
    formData.append("ubicacion", form.ubicacion);

    form.imagenes.forEach((img) => {
      formData.append("imagenes", img);
    });

    try {
      await axios.post("/noticias", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("✅ Noticia publicada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/"), 3000); // Espera a que se vea el toast
    } catch (err) {
      toast.error("❌ Error al publicar la noticia", {
        position: "top-right",
        autoClose: 4000,
      });
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-20 bg-white p-6 rounded shadow mb-10">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Crear Noticia</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="titulo"
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <textarea
            name="contenido"
            placeholder="Contenido de la noticia"
            rows="6"
            value={form.contenido}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Tipo de noticia</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Seleccione tipo de noticia</option>
                <option value="accidente">🚧 Accidente</option>
                <option value="bloqueo">⛔ Bloqueo</option>
                <option value="clima">🌧️ Clima</option>
                <option value="obras">🛠️ Obras</option>
                <option value="otro">📌 Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Ubicación</label>
              <input
                name="ubicacion"
                type="text"
                placeholder="Ej: Ticlio , puente infernillo"
                value={form.ubicacion}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              {/* Alternativa: lista de ubicaciones */}
              {/* 
    <select
      name="ubicacion"
      value={form.ubicacion}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border rounded"
    >
      <option value="">Seleccione una ubicación</option>
      <option value="lima">Lima</option>
      <option value="cusco">Cusco</option>
      <option value="arequipa">Arequipa</option>
      <option value="trujillo">Trujillo</option>
    </select>
    */}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Imágenes (máx. 5):
            </label>
            <label
              htmlFor="imagenes"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-gray-50 transition"
            >
              <span className="text-sm text-gray-600">
                📁 Selecciona imágenes
              </span>
            </label>
            <input
              id="imagenes"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {form.imagenes.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {form.imagenes.length} imagen(es) seleccionada(s)
              </p>
            )}
          </div>

          {previewImgs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
              {previewImgs.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="rounded shadow w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 text-xs hidden group-hover:block"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
          >
            Publicar Noticia
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default CrearNoticia;
