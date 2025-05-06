'use client'
import React, { useEffect, useState } from 'react'
interface Book {
  id: number;
  titre: string;
  auteur: string;
  image?: string;
}
export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/api/livres'); // Adjust the URL if necessary
        const data = await response.json();
        // Filter books with IDs from 1 to 8
        const filteredBooks = data.filter((book:Book) => book.id >= 1 && book.id <= 8);
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <main className="px-8 py-12 text-center">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to TED University Library!
          </h2>
          <p className="text-gray-600 mb-6">Plongez dans une expérience académique enrichie avec la Bibliothèque TED,
           spécialement conçue pour les étudiants et professeurs de l’Institut Supérieur Privé des Technologies de Digitalisation.
            Accédez à des milliers de ressources (livres, articles, vidéos pédagogiques) en un clic, 24h/24.
             Les professeurs bénéficient de privilèges exclusifs : dépôt de cours, 
             réservation d’espaces collaboratifs et accès prioritaire aux dernières recherches. 
             Les étudiants profitent d’un système de recommandations intelligentes, de quotas d’impression gratuits et d’outils d’annotation
              avancés. Gagnez du temps avec notre moteur de recherche optimisé et des collections triées par filière (GLSI, Data Science, 
              etc.). Connectez-vous dès maintenant et transformez vos études en succès avec TED ! 📚✨</p>
        </div>
        
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Popular books of the month:
          </h3>
          <div className="flex gap-4 justify-center flex-wrap">
          {books.map((book) => (
          <a
            key={book.id}
            href={`/books/${book.id}`}
            className="w-[150px] bg-white bg-opacity-80 p-4 rounded-lg shadow-md"
          >
            <img
              src={book.image || '/images/default-book.jpg'}
              alt={book.titre}
              className="rounded shadow-md w-[150px] h-[200px] object-cover"
            />
            <p className="text-center text-gray-800 mt-2 break-words">
              {book.titre}
            </p>
            <p className="text-center text-gray-600 mt-1 break-words">
              {book.auteur}
            </p>
          </a>
        ))}
          </div>
        </section>
      </main>
    </div>
  )
}
