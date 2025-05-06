'use client'
import React, { useEffect, useState } from 'react'
import { formatDate } from '../utils/date'

type User = {
  id: number
  nom: string
  email: string
  mot_de_passe: string
  role: string
}

type BorrowedBook = {
  title: string
  author: string
  borrowedDate: string
  dueDate: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)

          const books = await fetchBorrowedBooks(parsedUser.id)
          setBorrowedBooks(books)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  async function fetchBorrowedBooks(userId: number) {
    const response = await fetch(`http://localhost:5000/api/emprunts/utilisateur/${userId}`)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des livres empruntés')
    }
    const data = await response.json()
    return data.map((book: any) => ({
      title: book.livre,
      author: book.auteur,
      borrowedDate: book.date_emprunt,
      dueDate: book.date_retour,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Chargement...</h1>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Utilisateur non connecté</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 p-6">
      <div className="w-350 mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
          🎀 Student Profile
        </h1>
        <p className="text-gray-500 mt-1">Updated: {new Date().toISOString().split('T')[0]}</p>

        {/* Personal Information */}
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-700">Personal Information</h2>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong>Name:</strong> {user.nom}
            </p>
            <p className="text-gray-700">
              <strong>ID:</strong> {user.id}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700">
              <strong>Major:</strong> Génie Logiciel et SI
            </p>
          </div>
        </div>


        {/* Borrowed Books */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Borrowed Books</h2>
          <table className="w-full mt-2 border-collapse border border-purple-200">
            <thead>
              <tr className="bg-purple-50">
                <th className="border border-purple-200 px-4 py-2 text-left text-purple-700 font-semibold">
                  Book Title
                </th>
                <th className="border border-purple-200 px-4 py-2 text-left text-purple-700 font-semibold">
                  Author
                </th>
                <th className="border border-purple-200 px-4 py-2 text-left text-purple-700 font-semibold">
                  Borrowed Date
                </th>
                <th className="border border-purple-200 px-4 py-2 text-left text-purple-700 font-semibold">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, index) => (
                <tr key={index}>
                  <td className="border border-purple-200 px-4 py-2 text-gray-700">{book.title}</td>
                  <td className="border border-purple-200 px-4 py-2 text-gray-700">{book.author}</td>
                  <td className="border border-purple-200 px-4 py-2 text-gray-700">{formatDate(book.borrowedDate)}</td>
                  <td className="border border-purple-200 px-4 py-2 text-gray-700">{formatDate(book.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
