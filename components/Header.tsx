'use client'
import React from 'react'

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">TED Library</h1>
      <nav className="flex gap-4">
        <a href="/home" className="text-gray-600 hover:text-gray-800">Accueil</a>
        <a href="/books" className="text-gray-600 hover:text-gray-800">Livres</a>
        <a href="/profile" className="text-gray-600 hover:text-gray-800">Profile</a>
      </nav>
    </header>
  );
}
