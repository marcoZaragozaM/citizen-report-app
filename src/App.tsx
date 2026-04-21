import { useState, useEffect } from "react";
import ReportList from "./components/ReportList";
import CreateReportForm from "./components/CreateReportForm";
import MapView from "./components/MapView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [view, setView] = useState<"home" | "perfil" | "editar" | "forgot" | "reset">("home");

  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      console.log("AUTO GPS:", coords);

      setSelectedLocation(coords); // 🔥 ESTO MUEVE TODO
    },
    (err) => {
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}, []);
  console.log("LOCATION:", selectedLocation);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔐 FORGOT
  if (view === "forgot") {
    return (
      <div className="container">
        <div className="card">
          <ForgotPassword />
          <button className="button" onClick={() => setView("reset")}>
            Ya tengo token
          </button>
        </div>
      </div>
    );
  }

  // 🔐 RESET
  if (view === "reset") {
    return (
      <div className="container">
        <div className="card">
          <ResetPassword />
        </div>
      </div>
    );
  }

  // 🔒 NO AUTH
  if (!isAuth) {
    if (isRegister) {
      return (
        <div className="container">
          <div className="card">
            <Register onRegister={() => setIsAuth(true)} />
          </div>
        </div>
      );
    }

    if (showLogin) {
      return (
        <div className="container">
          <div className="card">
            <Login
              onLogin={() => setIsAuth(true)}
              goToRegister={() => {
                setShowLogin(false);
                setIsRegister(true);
              }}
            />

            <p
              style={{ cursor: "pointer", color: "#2563eb", marginTop: 10 }}
              onClick={() => {
                setShowLogin(false);
                setView("forgot");
              }}
            >
              ¿Olvidaste tu contraseña?
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <h1 style={{ marginTop: 10 }}>Panel de reportes</h1>

        <div className="card">
          <p><b>🔒 Necesitas cuenta para reportar</b></p>

          <button className="button" onClick={() => setIsRegister(true)}>
            Crear cuenta
          </button>

          <button
            className="button"
            onClick={() => setShowLogin(true)}
            style={{ marginLeft: 10 }}
          >
            Iniciar sesión
          </button>
        </div>

        <ReportList />
      </div>
    );
  }

  // 👤 PERFIL
  if (view === "perfil") {
    return (
      <div className="container">
        <div className="card">
          <Profile
            goToEdit={() => setView("editar")}
            goHome={() => setView("home")}
          />
        </div>
      </div>
    );
  }

  // ✏️ EDITAR PERFIL
  if (view === "editar") {
    return (
      <div className="container">
        <div className="card">
          <EditProfile
            goBack={() => setView("perfil")}
            goHome={() => setView("home")}
          />
        </div>
      </div>
    );
  }

  // 🏠 HOME
  return (
    <div className="container">

      <div className="navbar pro-navbar">

  <div>
    <div className="user-name">👤 {user?.name}</div>

   <div style={{
  fontSize: 40,
  fontWeight: 600,
  color: "#fff",
  fontFamily:'Poppins'
}}>

  NotiFlash App
</div>

    <div style={{
  fontSize: 14,
  fontWeight: 200,
  color: "#fff",
  fontFamily:'Poppins'
}}>
      Powered by Zaragoza Lab && Mentes del Futuro COBAEJ, Plantel 17 Ayotlán
    </div>
  </div>

  <div className="nav-actions">
    <button className="button" onClick={() => setView("perfil")}>
      Mi perfil
    </button>

    <button
      className="button"
      onClick={() => {
        localStorage.clear();
        setIsAuth(false);
        setView("home");
      }}
      //style={{ marginLeft: 10 }}
    >
      Cerrar sesión
    </button>
  </div>

</div>
      
 <div style={{
  fontSize: 18,
  fontWeight: 600,
  color: "#fff",
  fontFamily:'Poppins'
}}>

      <h1 align="center">Reportes ciudadanos - Ayotlán, Jalisco</h1>
      <br></br>
</div>
  

      <div className="card">
        <CreateReportForm
          selectedLocation={selectedLocation}
          onCreated={() => setRefresh(prev => prev + 1)}
        />
      </div>
          <div className="card">
      <MapView 
  onMapClick={setSelectedLocation} 
  selectedLocation={selectedLocation}
  refresh={refresh} 
/>
      </div>

      <ReportList key={refresh} />
    </div>
  );
}

export default App;