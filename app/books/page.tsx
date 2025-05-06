'use client'
import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function Books() {
  const [books, setBooks] = useState<{ id: number; titre: string; genre: string; auteur: string; topic?: string; image?: string; state?: boolean; rating?: number }[]>([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/api/livres'); // Adjust the URL if necessary
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    return (
      book.titre.toLowerCase().includes(search.toLowerCase()) &&
      (genreFilter ? book.genre === genreFilter : true) &&
      (authorFilter ? book.auteur === authorFilter : true) 
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Filtrer par Catégorie</option>
          {Array.from(new Set(books.map((book) => book.genre))).map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Filtrer par Author</option>
          {Array.from(new Set(books.map((book) => book.auteur))).map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`bg-white p-3 rounded-lg shadow-md ${
              book.state ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => {
              if (!book.state) {
                router.push(`/books/${book.id}`);
              }
            }}
          >
            <div className="flex items-center">
              <h2 className="text-md font-bold text-gray-900 flex-1">{book.titre}</h2>
              <img
                src={book.image || '/images/default-book.jpg'}
                alt={book.titre}
                className="w-20 h-28 object-cover rounded-lg ml-3"
              />
            </div>
            <p className="text-gray-700 text-sm">Author: {book.auteur}</p>
            <p className="text-gray-700 text-sm">Catégorie: {book.genre}</p>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  className={`text-yellow-400 ${index < (book.rating ?? 0) ? '' : 'opacity-50'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}