"use client";
import { useState } from "react";

const borrowedBooks = [
  "Le Petit Prince",
  "Les Misérables",
  "1984",
  "L'Étranger"
];

export default function BookRecommendationWidget() {
  const [recommendations] = useState([
    { title: "La Peste", author: "Albert Camus", score: 99 },
    { title: "Notre-Dame de Paris", author: "Victor Hugo", score: 99 },
    { title: "Le Rouge et le Noir", author: "Stendhal", score: 90 },
    { title: "Madame Bovary", author: "Gustave Flaubert", score: 90 }
  ]);
  const [isOpen, setIsOpen] = useState(false); // Par défaut, fermé
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponseHistory, setAiResponseHistory] = useState<string[]>([]);
  const [showAiSection, setShowAiSection] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const generateAiRecommendation = async () => {
    setIsLoading(true);
    setShowAiSection(true);
    setShowButtons(false);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousResponses: aiResponseHistory
        }),
      });

      const data = await response.json();
      setAiResponseHistory(prev => [...prev, data.reponse]);
      setAiResponse(data.reponse);
    } catch (error) {
      setAiResponse(
        "Bonjour, je suis l'assistant de la bibliothèque TED University. Essayez \"La Horde du Contrevent\" de Damasio ou \"Les Thanatonautes\" de Werber : ces romans explorent la condition humaine et la résistance face à la société."
      );
    } finally {
      setIsLoading(false);
      setShowButtons(true);
    }
  };

  // Bouton flottant rose en bas à gauche
  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "32px",
          left: "32px",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#FFCCDE,#FF8EB7,#BADFFF)",
          color: "#E04582",
          fontSize: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 999,
          boxShadow: "0 4px 18px #FFBCCD66",
          border: "2px solid #fff",
          fontWeight: 700,
        }}
        title="Voir les recommandations"
      >
        📚
      </div>
    );
  }

  // Widget affiché quand ouvert
  return (
    <div style={{
      position: "fixed",
      bottom: "104px",
      left: "32px",
      width: "380px",
      maxWidth: "96vw",
      maxHeight: "82vh",
      background: "linear-gradient(135deg,#FFE9EF 0%,#FFBCCD 60%,#BADFFF 100%)",
      borderRadius: "24px",
      boxShadow: "0 8px 32px rgba(255, 140, 190, 0.18)",
      zIndex: 999,
      fontFamily: "'Segoe UI', Arial, sans-serif",
      overflow: "hidden",
      border: "2px solid #FFC9D7"
    }}>
      <div style={{
        padding: "18px 22px 10px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1.5px solid #FFC9D7",
        background: "rgba(255,255,255,0.85)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span role="img" aria-label="books" style={{ fontSize: 25 }}>📚</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#E04582", letterSpacing: 0.5 }}>
            Recommandations pour Yosr
          </span>
        </div>
        <span
          onClick={() => setIsOpen(false)}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            color: "#E04582",
            fontWeight: 700
          }}
        >
          ×
        </span>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.7)",
        padding: "20px",
        maxHeight: "calc(82vh - 60px)",
        overflowY: "auto"
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          fontSize: "15px",
          fontWeight: "700",
          color: "#E04582",
          letterSpacing: 0.2
        }}>
          Populaires pour vous
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
          {recommendations.map((book, i) => (
            <div
              key={i}
              style={{
                background: "linear-gradient(90deg,#FFCCDE,#BADFFF 70%)",
                padding: "13px 16px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(255, 140, 190, 0.06)"
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "15.5px", color: "#E04582" }}>{book.title}</div>
                <div style={{ color: "#888", fontSize: "13px" }}>{book.author}</div>
              </div>
              <div style={{
                background: "#FF8EB7",
                color: "#fff",
                padding: "4px 13px",
                borderRadius: "16px",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 1px 4px #FFBCCD44"
              }}>
                {book.score}%
              </div>
            </div>
          ))}
        </div>

        <h3 style={{
          margin: "22px 0 13px 0",
          fontSize: "15px",
          fontWeight: "700",
          color: "#E04582"
        }}>
          Basé sur vos emprunts récents
        </h3>

        {!showAiSection ? (
          <div style={{
            background: "linear-gradient(90deg,#FFCCDE,#BADFFF 80%)",
            padding: "14px",
            borderRadius: "14px",
            textAlign: "center",
            boxShadow: "0 1px 4px #FFBCCD33"
          }}>
            <button
              onClick={generateAiRecommendation}
              style={{
                background: "linear-gradient(90deg,#FF8EB7,#BADFFF 80%)",
                color: "#fff",
                border: "none",
                borderRadius: "18px",
                padding: "9px 26px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 8px #FFBCCD33",
                transition: "background 0.3s"
              }}
            >
              Recommandation par IA
            </button>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(90deg,#FFCCDE,#BADFFF 80%)",
            padding: "14px",
            borderRadius: "14px",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#333",
            boxShadow: "0 1px 4px #FFBCCD33"
          }}>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "15px 10px" }}>
                <div style={{ color: "#E04582" }}>Génération de recommandations...</div>
                <div style={{ fontSize: "24px", margin: "12px 0" }}>⏳</div>
              </div>
            ) : (
              <>
                <div style={{ whiteSpace: "pre-line", color: "#E04582", fontWeight: 500 }}>
                  {aiResponse}
                </div>
                {showButtons && (
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "16px",
                    justifyContent: "center"
                  }}>
                    <button
                      onClick={generateAiRecommendation}
                      style={{
                        background: "linear-gradient(90deg,#FF8EB7,#BADFFF 80%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "18px",
                        padding: "7px 22px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Autre
                    </button>
                    <button
                      onClick={() => setShowAiSection(false)}
                      style={{
                        background: "#fff",
                        color: "#E04582",
                        border: "1.5px solid #FF8EB7",
                        borderRadius: "18px",
                        padding: "7px 22px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Fin
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
