import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/forgot-password", { email });

      alert("Token: " + res.data.token);
      window.location.reload();
    } catch {
      alert("Error");
    }
  };

  return (
    <Layout title="Recuperar contraseña">
      <input
        className="input"
        placeholder="Ingresa tu correo"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="button" onClick={handleSubmit}>
        Enviar
      </button>

      <button className="button" onClick={() => setView("home")}>
              Volver al inicio
      </button>
    </Layout>
  );
}