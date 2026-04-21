import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import api from "../services/api";

// 🎯 ICONOS POR ESTADO
const iconColors: any = {
  pendiente: "red",
  proceso: "blue",
  resuelto: "green"
};

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32]
  });

// 📍 CLICK EN MAPA
function LocationMarker({ onMapClick }: any) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default function MapView({
  onMapClick,
  selectedLocation,
  refresh
}: any) {
  const [reports, setReports] = useState<any[]>([]);

  const defaultCenter: [number, number] = [20.705, -103.35]; // Guadalajara

  // 📡 OBTENER REPORTES
  const fetchReports = async () => {
    try {
      const res = await api.get("/reports");
      setReports(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [refresh]);

  return (
    <MapContainer
      key={`${selectedLocation?.lat}-${selectedLocation?.lng}`} // 🔥 SOLUCIÓN FINAL
      center={
        selectedLocation
          ? [selectedLocation.lat, selectedLocation.lng]
          : defaultCenter
      }
      zoom={15}
      style={{
        height: "400px",
        borderRadius: 12,
        marginTop: 20
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 📍 CLICK */}
      <LocationMarker onMapClick={onMapClick} />

      {/* 📍 TU UBICACIÓN REAL */}
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>📍 Tu ubicación</Popup>
        </Marker>
      )}

      {/* 🚨 REPORTES */}
      {reports.map((r) => (
        <Marker
          key={r._id}
          position={[r.location.lat, r.location.lng]}
          icon={createIcon(iconColors[r.status] || "red")}
        >
          <Popup>
            <b>{r.title}</b>
            <br />
            {r.description}
            <br /><br />
            Estado: <b>{r.status}</b>
            <br />
            👍 {r.votes}

            {r.image && (
              <img
                src={`http://localhost:3000/uploads/${r.image}`}
                style={{
                  width: "100%",
                  marginTop: 10,
                  borderRadius: 8
                }}
              />
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}