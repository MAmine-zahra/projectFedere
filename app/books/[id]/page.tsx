'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDate } from '@/app/utils/date'
import { isTodayOutsideIntervals } from '@/app/utils/emp'

export default function BookPage() {
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userId = user ? JSON.parse(user).id : null
  const { id } = useParams()
  const router = useRouter()

  interface IssuedDetail {
    id: number;
    utilisateur: string;
    date_emprunt: string;
    date_retour: string;
    retourne: number;
  }

  interface Book {
    id: number;
    titre: string;
    image: string;
    auteur: string;
    isbn: string;
    disponible: number;
    edition: string;
    description: string;
    etat: boolean;
    genre: string;
    issuedDetails: IssuedDetail[];
  }

  const [book, setBook] = useState<Book | null>(null)
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchBook()
        await fetchIssuedDetails()
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  async function fetchBook() {
    const response = await fetch(`http://localhost:5000/api/livres/${id}`)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du livre')
    }
    const data = await response.json()
    await fetchRecommendedBooks(data.genre, data.id)
    setBook({ ...data, issuedDetails: [] })
  }

  async function fetchIssuedDetails() {
    const response = await fetch(`http://localhost:5000/api/emprunts/${id}`)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des emprunts')
    }
    const details = await response.json()
    setBook((prevBook) => (prevBook ? { ...prevBook, issuedDetails: details } : null))
  }
  console.log(book);

  async function fetchRecommendedBooks(genre: string, id: number) {
    const response = await fetch(`http://localhost:5000/api/livres?categorie=${genre}`)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des recommandations')
    }
    const recommendations = await response.json()
    setRecommendedBooks(recommendations.filter((recBook: Book) => recBook.id !== id))
  }
    
  const handleBorrow = async () => {
    if (!book || book.etat) {
      alert('Ce livre est déjà emprunté.')
      return
    }
    try {
      const today = new Date()
      const returnDate = new Date(today)
      returnDate.setDate(today.getDate() + 10)

      const response = await fetch(`http://localhost:5000/api/emprunts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utilisateur_id: userId, // Assuming you have a way to get the user ID
          livre_id: book.id,
          date_emprunt: today.toISOString().split('T')[0],
          date_retour: returnDate.toISOString().split('T')[0],
        }),
      })

      if (!response.ok) throw new Error("Erreur pendant l'emprunt")


      setBook({ ...book, etat: true })
      await fetchIssuedDetails()
    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'emprunt.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Chargement...</h1>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Livre introuvable</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={book.image}
              alt={book.titre}
              className="w-48 h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{book.titre}</h1>
            <p className="mt-2 text-gray-600"><strong>Auteur :</strong> {book.auteur}</p>
            <p className="mt-1 text-gray-600"><strong>ISBN :</strong> {book.isbn}</p>
            <p className="mt-1 text-gray-600"><strong>Disponibles :</strong> {book.disponible}</p>
            <p className="mt-1 text-gray-600"><strong>Edition :</strong> {book.edition}</p>
            <p className="mt-4 text-gray-700">{book.description}</p>

            <button
              onClick={handleBorrow}
              className={`mt-6 px-6 py-2 rounded-lg ${
                (book.etat || isTodayOutsideIntervals(book.issuedDetails as any[]))
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
              disabled={book.etat || isTodayOutsideIntervals(book.issuedDetails as any[])}
            >
              {(book.etat || isTodayOutsideIntervals(book.issuedDetails as any[])) ? 'Déjà emprunté' : 'Emprunter'}
            </button>
          </div>
        </div>

        {/* Tableau des emprunts */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historique des emprunts</h2>
          {book.issuedDetails && book.issuedDetails.length > 0 ? (
            <table className="w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-purple-400 text-black">
                <th className="border px-4 py-2">Utilisateur</th>
                <th className="border px-4 py-2">Date d'emprunt</th>
                <th className="border px-4 py-2">Date de retour</th>
              </tr>
            </thead>
            <tbody>
              {book.issuedDetails.map((detail) => (
                <tr key={detail.id} className="text-center text-black">
                  <td className="border px-4 py-2">{detail.utilisateur}</td>
                  <td className="border px-4 py-2">{formatDate(detail.date_emprunt)}</td>
                  <td className="border px-4 py-2">{formatDate(detail.date_retour)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          ) : (
            <p className="text-gray-600">Aucun emprunt pour ce livre.</p>
          )}
        </div>

        {/* Recommended Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommandations</h2>
          {recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedBooks.map((recBook) => (
                <div
                  key={recBook.id}
                  className="bg-gray-100 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                  onClick={() => router.push(`/books/${recBook.id}`)}
                >
                  <img
                    src={recBook.image}
                    alt={recBook.titre}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h3 className="mt-2 text-lg font-bold text-gray-800">{recBook.titre}</h3>
                  <p className="text-gray-600"><strong>Auteur :</strong> {recBook.auteur}</p>
                  <p className="text-gray-600"><strong>Genre :</strong> {recBook.genre}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucune recommandation disponible.</p>
          )}
        </div>
      </div>
    </div>
  )
}