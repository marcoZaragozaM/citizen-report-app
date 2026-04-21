import { useEffect, useState } from "react";
import api from "../services/api";
import ReportCard from "./ReportCard";

export default function ReportList() {
  const [reports, setReports] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports");

      // 🔥 IMPORTANTE: valida estructura
      const data = res.data.data || [];

      setReports(data);
    } catch (error) {
      console.error(error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p>Cargando reportes...</p>;

  return (
    <div>
      <div className="report-header">
  <h2>Reportes ciudadanos</h2>
  <p>Seguimiento en tiempo real</p>
</div>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">Todos</option>
        <option value="bache">Baches</option>
        <option value="basura">Basura</option>
        <option value="alumbrado">Alumbrado</option>
        <option value="agua">Fuga de agua</option>
      </select>

      <br /><br />

      {reports.length === 0 ? (
        <p>No hay reportes aún</p>
      ) : (
        reports
          .filter(r => r && (!filter || r.type === filter))
          .sort((a, b) => (b.votes || 0) - (a.votes || 0))
          .map((r) => (
            <ReportCard
              key={r._id}
              report={r}
              onUpdated={fetchReports}
            />
          ))
      )}
    </div>
  );
}