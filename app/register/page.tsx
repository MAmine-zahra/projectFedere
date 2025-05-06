'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'; // Import axios for API requests

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
    } else {
      setError('');
      try {
        // Map frontend fields to backend fields
        const payload = {
          nom: formData.username,
          email: formData.email,
          mot_de_passe: formData.password,
        };

        // Send a POST request to the API to save user data
        const response = await axios.post('http://localhost:5000/api/utilisateurs/signin', payload);
        console.log('Response:', response.data); // Log the backend response
        router.push('/login'); // Redirect to the login page
      } catch (err: any) {
        console.error('Error:', err.response?.data || err.message); // Log the error details
        setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="text-4xl mb-2">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Créez votre compte
          </h1>
          <p className="text-gray-700 text-center mt-2">
            Inscrivez-vous pour accéder à la bibliothèque
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-blue-500" />
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 py-2 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-blue-500" />
            <input
              type="email"
              name="email"
              placeholder="Adresse e-mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 py-2 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-blue-500" />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 py-2 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-center transition font-semibold"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-6">
          Déjà inscrit ?
          <a href="/login" className="text-blue-600 ml-1 hover:underline">Connectez-vous</a>
        </p>
      </div>
    </div>
  )
}
