// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      localStorage.setItem("rol", res.data.user.rol);

      navigate("/");
    } catch (err) {
      alert("Credenciales incorrectas");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Correo"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
