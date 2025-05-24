import { useState } from "react";
import Papa from "papaparse";

function extraireNumerosChaud(data) {
  const freq = {};
  data.forEach(row => {
    for (let i = 4; i <= 10; i++) {
      const num = parseInt(row[i]);
      if (!isNaN(num)) freq[num] = (freq[num] || 0) + 1;
    }
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([num]) => parseInt(num));
}

function genererGrille(numerosChaud) {
  const melange = [...numerosChaud].sort(() => 0.5 - Math.random());
  return melange.slice(0, 7).sort((a, b) => a - b);
}

export default function AssistantAmigoChill() {
  const [numerosChaud, setNumerosChaud] = useState([2, 8, 11, 14, 18, 24, 28]);
  const [grille, setGrille] = useState(genererGrille(numerosChaud));
  const [message, setMessage] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const newHot = extraireNumerosChaud(results.data);
        setNumerosChaud(newHot);
        setGrille(genererGrille(newHot));
        setMessage("Mira, Gana – Données rechargées !");
      },
      header: true,
      delimiter: ";"
    });
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ color: "gold", fontSize: "1.5rem" }}>Grille Over Chill Amigo</h2>
      <div style={{ fontSize: "1.8rem", margin: "1rem 0", fontFamily: "monospace" }}>
        {grille.join(" - ")}
      </div>
      <button
        onClick={() => setGrille(genererGrille(numerosChaud))}
        style={{ backgroundColor: "gold", color: "black", padding: "0.5rem 1rem", marginBottom: "1rem" }}
      >
        Nouvelle Grille
      </button>
      <br />
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}