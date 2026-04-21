import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Register({ onRegister }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        
      });

      console.log("✅ RESPUESTA:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onRegister();
    } catch {
      console.log("❌ ERROR COMPLETO:", error);
      console.log("❌ ERROR RESPONSE:", error?.response);
      alert("Error en registro");
    }
  };

  return (
    <Layout title="Crear cuenta">
      <input className="input" placeholder="Nombre" onChange={(e) => setName(e.target.value)} />
      <input className="input" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />

      <button className="button" onClick={handleSubmit}>
        Registrarse
      </button>
      <button className="button" onClick={() => setView("home")}>
              Volver al inicio
      </button>
    </Layout>
  );
}