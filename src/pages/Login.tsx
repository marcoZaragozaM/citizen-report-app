import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Login({ onLogin, goToRegister }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin();
    } catch {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <Layout title="Iniciar sesión">
      <input
        className="input"
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="button" onClick={handleSubmit}>
        Entrar
      </button>

      <p
        style={{ marginTop: 10, cursor: "pointer", color: "#2563eb" }}
        onClick={goToRegister}
      >
        Crear cuenta
      </p>
    </Layout>
  );
}