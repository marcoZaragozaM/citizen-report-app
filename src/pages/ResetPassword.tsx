import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function ResetPassword({ goHome }: any) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await api.post("/auth/reset-password", { token, password });
      alert("Contraseña actualizada");
    } catch {
      alert("Error");
    }
  };

  return (
    <Layout title="Nueva contraseña">
      <input className="input" placeholder="Token" onChange={(e) => setToken(e.target.value)} />
      <input className="input" type="password" placeholder="Nueva contraseña" onChange={(e) => setPassword(e.target.value)} />

      <button className="button" onClick={handleSubmit}>
        Cambiar contraseña
      </button>

       <button
  className="button"
  onClick={goHome}
  style={{ marginLeft: 10 }}
>
  Volver al inicio
</button>

 
    </Layout>
  );
}