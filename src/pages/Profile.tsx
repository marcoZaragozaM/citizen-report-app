import Layout from "../components/Layout";

export default function Profile({ goToEdit, goHome }: any) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Layout title="Mi perfil">
      <p><b>Nombre:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

      <br />

      <button className="button" onClick={goToEdit}>
        Editar perfil
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