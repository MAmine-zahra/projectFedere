'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock } from 'react-icons/fa'
import Image from 'next/image'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/utilisateurs/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: username, mot_de_passe: password }),
      })
console.log(response.ok==true);

const data = await response.json()
      if (!response.ok) {
        
        setError(data.message || 'Identifiant ou mot de passe incorrect.')
        return
      }

      if (data) {
        setError('')
        localStorage.removeItem('user') // Clear any previous user data
        console.log('Login successful:', data)
        const {nom,email, id, role} = data.user
        localStorage.setItem('user', JSON.stringify({nom,email,id,role})) // Store user data in local storage
        router.push('/home') // Redirect to the home page
      } else {
        setError(data.message || 'Identifiant ou mot de passe incorrect.')
      }
    } catch (err) {
      console.log(err);
      
      
      setError('Identifiant ou mot de passe incorrect.')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center px-4">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">📘</div>
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Bienvenue à la <br /> Bibliothèque <span>📖</span>
            </h1>
            <p className="text-gray-500 text-center mt-2">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-purple-500" />
              <input
                type="text"
                placeholder="Identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 py-2 rounded-xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-purple-500" />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 py-2 rounded-xl border border-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-center transition font-semibold"
            >
              Se connecter
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Pas encore inscrit ?
            <a href="/register" className="text-blue-600 ml-1 hover:underline">Créez un compte</a>
          </p>
        </div>
      </div>
    </>
  )
}
