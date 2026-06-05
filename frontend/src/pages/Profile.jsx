import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          padding: "20px 40px",
          backgroundColor: "#0f172a",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Perfil (en construcción)</h1>
      </div>
      <div style={{ padding: 40 }}>
        <p style={{ color: "#94a3b8" }}>
          Esta sección será utilizada para configuración avanzada de la cuenta.
        </p>
      </div>
    </div>
  );
};

export default Profile;
