import api from "../services/api";

export default function ReportCard({ report, onUpdated }: any) {
  const statusColors: any = {
  pendiente: "#facc15",
  proceso: "#3b82f6",
  resuelto: "#22c55e"
};
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin =
    user?.role === "administrador" ||
    user?.role === "moderador" ||
    user?.role === "autoridad";

  // 🚀 CAMBIAR ESTADO
  const changeStatus = async (status: string) => {
    try {
      await api.put(`/reports/${report._id}/status`, { status });
      onUpdated();
    } catch (error) {
      alert("Error actualizando estado");
    }
  };

  // 🗑️ ELIMINAR
  const deleteReport = async () => {
    if (!confirm("¿Eliminar reporte?")) return;

    try {
      await api.delete(`/reports/${report._id}`);
      onUpdated();
    } catch (error) {
      alert("Error eliminando");
    }
  };

  // 👍 VOTAR
  const vote = async () => {
    try {
      await api.post(`/reports/${report._id}/vote`);
      onUpdated();
    } catch (error) {
      alert("Ya votaste o error");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}
    >
      <h3>{report.title}</h3>

      <p>{report.description}</p>

    <p>
  📍 {report.address || `${report.location?.lat}, ${report.location?.lng}`}
</p>

   
      <p>
  Estado:{" "}
  <span
    style={{
      background: statusColors[report.status],
      color: "#fff",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: "bold"
    }}
  >
    {report.status}
  </span>
</p>

      <p>👍 {report.votes}</p>

      {/* 📸 IMAGEN */}
      {report.image && (
        <img
          src={`http://localhost:3000/uploads/${report.image}`}
          style={{ width: "100%", maxWidth: 300, borderRadius: 10 }}
        />
      )}

      <br />

      {/* 👍 VOTAR */}
      <button onClick={vote}>👍 Votar</button>

      {/* 🔥 ADMIN CONTROLS */}
      {isAdmin && (
        <div style={{ marginTop: 10 }}>
  <p><b>Panel admin</b></p>

  <button
    onClick={() => changeStatus("pendiente")}
    style={{
      background: "#facc15",
      color: "#000",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6,
      marginRight: 5,
      cursor: "pointer"
    }}
  >
    Pendiente
  </button>

  <button
    onClick={() => changeStatus("proceso")}
    style={{
      background: "#3b82f6",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6,
      marginRight: 5,
      cursor: "pointer"
    }}
  >
    En proceso
  </button>

  <button
    onClick={() => changeStatus("resuelto")}
    style={{
      background: "#22c55e",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6,
      cursor: "pointer"
    }}
  >
    Resuelto
  </button>


          {user?.role === "administrador" && (
            <button
              onClick={deleteReport}
              style={{ background: "red", color: "#fff", marginLeft: 10 }}
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}