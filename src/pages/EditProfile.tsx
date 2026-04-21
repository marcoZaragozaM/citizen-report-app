import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function EditProfile({ goBack, goHome }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const res = await api.get("/users/me");
      setName(res.data.name);
      setEmail(res.data.email);
    };

    loadUser();
  }, []);

  const handleSubmit = async () => {
    try {
      await api.put("/users/me", { name, email });

      alert("Perfil actualizado");

      // 👉 REGRESA A PERFIL
      goBack();

    } catch (error) {
      alert("Error actualizando perfil");
    }
  };

  return (
    <Layout title="Editar perfil">
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
      />

      <input
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <button className="button" onClick={handleSubmit}>
        Guardar
      </button>

      <button
        className="button"
        onClick={goBack}
        style={{ marginTop: 10 }}
      >
        Cancelar
      </button>

      <button
        className="button"
        onClick={goHome}
        style={{ marginTop: 10 }}
      >
        Volver a reportes
      </button>
    </Layout>
  );
}