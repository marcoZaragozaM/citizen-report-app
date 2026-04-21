import { useState } from "react";
import ReportList from "../components/ReportList";
import CreateReportForm from "../components/CreateReportForm";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div style={{ padding: 20 }}>
      <CreateReportForm onCreated={() => setRefresh(refresh + 1)} />
      <ReportList key={refresh} />
    </div>
  );
}