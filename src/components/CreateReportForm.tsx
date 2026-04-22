import { useState, useEffect } from "react";
import api from "../services/api";

export default function CreateReportForm({ onCreated, selectedLocation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("bache");
  const [image, setImage] = useState<File | null>(null);

  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState("");

  // 📍 CLICK EN MAPA
  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      getAddress(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation]);

  // 📍 OBTENER DIRECCIÓN
  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const a = data.address || {};

      const direccion = `${a.road || "Calle desconocida"} ${a.house_number || "S/N"}, 
${a.city || a.town || ""}, ${a.state || ""}`;

      setAddress(direccion);
    } catch (error) {
      console.error(error);
      setAddress("No se pudo obtener dirección");
    }
  };

  // 📍 GPS
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("No soporta ubicación");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        // 🔥 REUTILIZAMOS
        getAddress(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  // 🚀 CREAR REPORTE
  const createReport = async () => {
    try {
      if (!title || !description) {
        alert("Completa los campos");
        return;
      }

      if (!location) {
        alert("Selecciona ubicación");
        return;
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);

      // 🔥 ESTO ES CLAVE
      console.log("LOCATION:", location);
      formData.append("location", JSON.stringify(selectedLocation));

      // 🔥 ENVÍAS DIRECCIÓN
      formData.append("address", address);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/reports", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Reporte creado 🚀");

      setTitle("");
      setDescription("");
      setImage(null);
      setLocation(null);
      setAddress("");

      onCreated();

    } catch (error: any) {
      console.error(error.response?.data);
      alert("Error creando reporte ❌");
    }
  };

  return (
    <div style={card}>
      <h2>📢 Crear reporte</h2>

      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={input}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...input, height: 80 }}
      />

      <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
        <option value="bache">Bache</option>
        <option value="basura">Basura</option>
        <option value="alumbrado">Alumbrado</option>
        <option value="fuga">Fuga de agua</option>
      </select>

      {/* 📸 IMAGEN */}
      <label style={fileButton}>
        📸 Seleccionar imagen
        <input
          type="file"
          hidden
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </label>

      {image && <p>Archivo: {image.name}</p>}

      {/* 📍 GPS */}
      <button onClick={getLocation} style={gpsBtn}>
        📍 Usar mi ubicación
      </button>

      {/* 📍 DIRECCIÓN */}
      <div style={addressBox}>
        {address || "Ubicación no seleccionada"}
      </div>

      {/* 🚀 CREAR */}
      <button onClick={createReport} style={createBtn}>
        🚀 Crear reporte
      </button>
    </div>
  );
}

// 🎨 estilos
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const fileButton = {
  display: "block",
  background: "#9333ea",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
  textAlign: "center" as const,
  cursor: "pointer",
  marginBottom: 10
};

const gpsBtn = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  marginTop: 10,
  cursor: "pointer"
};

const createBtn = {
  width: "100%",
  padding: 14,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  marginTop: 15,
  cursor: "pointer",
  fontWeight: "bold"
};

const addressBox = {
  background: "#f3f4f6",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
  marginTop: 10
};