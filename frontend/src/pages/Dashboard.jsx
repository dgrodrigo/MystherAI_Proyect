import React from "react";
import { useNavigate } from "react-router-dom";
import { Database, FileText, Wand2, LogOut } from "lucide-react";
import { useApiKey } from "../context/ApiKeyContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { clearApiKey } = useApiKey();

  const LINKS = {
    censo: "https://docs.google.com/spreadsheets/d/1X1e8pteZKJyrznqMKfd4JShFyNMxWN_Z/edit?usp=sharing&ouid=106268244786399130671&rtpof=true&sd=true",
    registro: "https://docs.google.com/spreadsheets/d/1Ga5zMekIlVjHKhxkfGBIhAiCh0H3zGYf0TOoMkoctj4/edit?usp=sharing",
  };

  const handleLogout = () => {
    clearApiKey();
    navigate("/");
  };

  const cards = [
    {
      title: "Censo",
      icon: <Database size={36} />,
      desc: "Base de datos de personal (Google Sheets)",
      color: "#3b82f6",
      action: () => window.open(LINKS.censo, "_blank"),
    },
    {
      title: "Registro Mateo",
      icon: <FileText size={36} />,
      desc: "Registro operativo (Google Sheets)",
      color: "#10b981",
      action: () => window.open(LINKS.registro, "_blank"),
    },
    {
      title: "Herramienta",
      icon: <Wand2 size={36} />,
      desc: "Texturizado y edición IA (WaveSpeed)",
      color: "#f59e0b",
      action: () => navigate("/herramienta"),
    },
  ];

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top, #0f172a, #020617 55%)",
        minHeight: "100vh",
        color: "white",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <nav
        style={{
          padding: "18px 40px",
          backgroundColor: "rgba(15,23,42,0.9)",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background:
                "conic-gradient(from 90deg, #3b82f6, #22c55e, #eab308, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(59,130,246,0.6)",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: "800" }}>H</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              Hechicer<span style={{ color: "#3b82f6" }}>.ia</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Panel interno · Solo personal autorizado
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "transparent",
            border: "1px solid #ef4444",
            color: "#ef4444",
            padding: "8px 16px",
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </nav>

      <main
        style={{
          padding: "40px 40px 60px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
            Centro de Operaciones
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 15,
              maxWidth: 520,
            }}
          >
            Accede rápidamente a Censo, Registro y a la herramienta de
            texturizado IA integrada en Hechicer.ia.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={card.action}
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7))",
                padding: "30px 26px",
                borderRadius: 20,
                border: "1px solid #1e293b",
                cursor: "pointer",
                transition: "all 0.2s ease-out",
                boxShadow: "0 18px 30px rgba(15,23,42,0.7)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = card.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#1e293b";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: "#020617",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                  marginBottom: 20,
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>{card.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
