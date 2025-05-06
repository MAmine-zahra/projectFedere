// login/page.js
'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { FaUser, FaLock } from 'react-icons/fa'

export default function Login() {
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

          <form className="mt-6 space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-purple-500" />
              <input
                type="text"
                placeholder="Identifiant"
                className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-purple-500" />
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex items-center text-sm">
              <input type="checkbox" id="remember" className="mr-2 text-purple-600" />
              <label htmlFor="remember" className="text-gray-600">Se souvenir de moi</label>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-center transition font-semibold"
            >
              Se connecter
            </button>

            <div className="flex items-center justify-center my-2 text-sm text-gray-500">
              <hr className="border-gray-300 flex-grow" />
              <span className="px-2">ou</span>
              <hr className="border-gray-300 flex-grow" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 rounded-xl py-2 bg-white hover:bg-gray-50 transition"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              <span className="text-gray-600">Google</span>
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Pas encore inscrit ?
            <a href="#" className="text-blue-600 ml-1 hover:underline">Créez un compte</a>
          </p>
        </div>
      </div>
    </>
  )
}