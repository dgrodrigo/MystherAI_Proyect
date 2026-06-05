import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useApiKey } from "../context/ApiKeyContext";
import api from "../utils/api";

const Herramienta = () => {
  const navigate = useNavigate();
  const { apiKey, setApiKey } = useApiKey();
  const [tempKey, setTempKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setError("");

    const key = tempKey.trim();
    if (!key || key.length < 10) {
      setError("API Key no válida.");
      return;
    }

    setChecking(true);
    try {
      const res = await api.post("/tool/validate-key/", { api_key: key });
      if (res.data && res.data.valid) {
        setApiKey(key);
        setError("");
      } else {
        setError("La API Key no es válida para WaveSpeed.");
      }
    } catch (err) {
      setError("Error al validar la API Key con WaveSpeed.");
    } finally {
      setChecking(false);
    }
  };

  const showModal = !apiKey;

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
          display: "flex",
          alignItems: "center",
          gap: 20,
          borderBottom: "1px solid #1e293b",
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
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Herramienta de Texturizado</h1>
      </div>

      <div
        style={{
          width: "100%",
          height: "calc(100vh - 80px)",
          position: "relative",
        }}
      >
        {apiKey && (
          <iframe
            src="http://localhost:7860"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="WaveSpeed Tool"
          />
        )}

        {showModal && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15,23,42,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            <div
              style={{
                backgroundColor: "#0f172a",
                padding: 30,
                borderRadius: 20,
                border: "1px solid #1e293b",
                width: "100%",
                maxWidth: 430,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <KeyRound size={26} color="#22c55e" />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    WaveSpeed API Key
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}
                  >
                    Introduce tu clave privada. Se validará con WaveSpeed antes de
                    entrar a la herramienta.
                  </div>
                </div>
              </div>
              <form onSubmit={handleSaveKey}>
                <input
                  type="password"
                  placeholder="Introduce tu API Key de WaveSpeed"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid #334155",
                    backgroundColor: "#020617",
                    color: "white",
                    marginBottom: 10,
                    fontSize: 14,
                  }}
                  autoFocus
                />
                {error && (
                  <p
                    style={{
                      color: "#f97316",
                      marginBottom: 10,
                      fontSize: 13,
                    }}
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={checking}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: "#22c55e",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                    opacity: checking ? 0.7 : 1,
                  }}
                >
                  {checking ? "Validando..." : "Validar y continuar"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Herramienta;
