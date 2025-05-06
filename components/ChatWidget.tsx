"use client";
import { useState, useRef, useEffect } from "react";

const genres = [
  "Drame",
  "Fantastique",
  "Aventure",
  "Science-fiction",
  "Romance",
  "Thriller"
];

const genreBookReplies: Record<string, string> = {
  "Drame": `Voici quelques livres de drame disponibles à la bibliothèque TED University :
- Le Rouge et le Noir (Stendhal)
- Les Misérables (Victor Hugo)
- La Peste (Albert Camus)
- L’Étranger (Albert Camus)
- Le Père Goriot (Honoré de Balzac)
N’hésite pas à demander un auteur ou un titre précis !`,
  "Fantastique": `Quelques livres fantastiques à découvrir :
- Harry Potter à l’école des sorciers (J.K. Rowling)
- Le Seigneur des Anneaux (J.R.R. Tolkien)
- Candide (Voltaire)
- La Métamorphose (Franz Kafka)
Besoin d’une recommandation personnalisée ?`,
  "Aventure": `Voici des romans d’aventure :
- Le Comte de Monte-Cristo (Alexandre Dumas)
- Le Tour du monde en 80 jours (Jules Verne)
- L’Île au trésor (Robert Louis Stevenson)
- Robinson Crusoé (Daniel Defoe)
Demande-moi si tu veux une liste plus longue !`,
  "Science-fiction": `Quelques classiques de la science-fiction :
- 1984 (George Orwell)
- Fahrenheit 451 (Ray Bradbury)
- Le Meilleur des mondes (Aldous Huxley)
- Fondation (Isaac Asimov)
- Dune (Frank Herbert)
Tu veux un conseil sur un sous-genre ?`,
  "Romance": `Suggestions de romans romantiques :
- Orgueil et Préjugés (Jane Austen)
- Roméo et Juliette (Shakespeare)
- L’Écume des jours (Boris Vian)
- Madame Bovary (Gustave Flaubert)
Je peux aussi t’aider à trouver un auteur précis.`,
  "Thriller": `Voici quelques thrillers à suspense :
- Da Vinci Code (Dan Brown)
- Shutter Island (Dennis Lehane)
- La Fille du train (Paula Hawkins)
- Bel-Ami (Guy de Maupassant)
Dis-moi si tu veux une suggestion différente !`
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Bonjour 👋\nJe suis l’assistant virtuel de la Bibliothèque TED University.\nPose-moi une question sur les livres, les horaires, les services, ou choisis un genre :"
    }
  ]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [messages, open]);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    const matchedGenre = Object.keys(genreBookReplies).find(
      genre => text.toLowerCase().includes(genre.toLowerCase())
    );
    setMessages((msgs) => [...msgs, { sender: "user", text }]);
    setInput("");
    if (matchedGenre) {
      setMessages(msgs => [
        ...msgs,
        { sender: "bot", text: genreBookReplies[matchedGenre] }
      ]);
      return;
    }
    const res = await fetch("/api/repondre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setMessages((msgs) => [...msgs, { sender: "bot", text: data.reponse }]);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        id="chat-fab"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #dad7cd 0%, #b7b7a4 100%)",
          color: "#344e41",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          zIndex: 1000,
          border: "2px solid #fff"
        }}
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {open ? "✕" : "💬"}
      </div>

      {/* Chat Widget Popup */}
      {open && (
        <div
          id="chat-widget"
          style={{
            position: "fixed",
            bottom: 104,
            right: 32,
            width: 370,
            maxWidth: "95vw",
            maxHeight: 560,
            background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(52,78,65,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            border: "1.5px solid #dad7cd"
          }}
        >
          <div style={{
            background: "rgba(255,255,255,0.90)",
            color: "#344e41",
            padding: "16px 18px 8px 18px",
            borderBottom: "1px solid #dad7cd",
            fontWeight: "bold",
            fontSize: "1.15rem",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center"
          }}>
            <span style={{ fontSize: 22 }}>📚</span>
            Assistant Bibliothèque TED
          </div>
          <div style={{
            background: "rgba(255,255,255,0.7)",
            padding: "10px 18px 10px 18px",
            borderBottom: "1px solid #dad7cd",
            textAlign: "center"
          }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
              marginTop: 6,
              marginBottom: 2
            }}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setMessages(msgs => [
                      ...msgs,
                      { sender: "user", text: genre },
                      { sender: "bot", text: genreBookReplies[genre] }
                    ]);
                  }}
                  style={{
                    background: "#b7b7a4",
                    color: "#344e41",
                    border: "none",
                    borderRadius: "18px",
                    padding: "7px 16px",
                    fontSize: "15px",
                    cursor: "pointer",
                    fontWeight: 500,
                    boxShadow: "0 1px 4px rgba(52,78,65,0.07)"
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          <div
            id="chat-box"
            ref={chatBoxRef}
            style={{
              flex: 1,
              padding: "14px 10px",
              overflowY: "auto",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  background: msg.sender === "user"
                    ? "linear-gradient(90deg, #344e41 0%, #b7b7a4 100%)"
                    : "linear-gradient(90deg, #fff 0%, #dad7cd 100%)",
                  color: msg.sender === "user" ? "#fff" : "#344e41",
                  borderRadius: msg.sender === "user"
                    ? "18px 18px 2px 18px"
                    : "18px 18px 18px 2px",
                  padding: "11px 15px",
                  maxWidth: "80%",
                  fontSize: "1rem",
                  marginBottom: 2,
                  boxShadow: "0 1px 4px rgba(52,78,65,0.07)",
                  whiteSpace: "pre-line"
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{
            display: "flex",
            borderTop: "1px solid #dad7cd",
            padding: "10px 12px",
            background: "rgba(255,255,255,0.8)"
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre message..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #b7b7a4",
                borderRadius: 14,
                fontSize: "1rem",
                outline: "none",
                background: "#fff",
                color: "#344e41"
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              style={{
                background: "#b7b7a4",
                color: "#344e41",
                border: "none",
                marginLeft: 8,
                padding: "10px 16px",
                borderRadius: 14,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 1px 4px rgba(52,78,65,0.07)"
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}