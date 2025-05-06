'use client'
import React from 'react'

export default function Footer() {
  const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('8, 1 Rue des Minéraux, I 2035')
        .then(() => {
          alert('Address copied to clipboard!');
        })
        .catch(() => {
          alert('Failed to copy address. Please try again.');
        });
    } else {
      // alert('Clipboard API not supported. Please copy manually.');
    }
  };

  return (
    <footer className="bg-gray-100 text-center py-6">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/images/maps1.jpg"
          alt="University Location"
          className="rounded shadow-md"
        />
        <div className="flex items-center gap-2">
          <p className="text-gray-800 text-sm">
            8, 1 Rue des Minéraux, I 2035
          </p>
          <button
            onClick={copyToClipboard}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Copy
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mt-4">
        © {new Date().getFullYear()} TED Library. All rights reserved.
      </p>
    </footer>
  );
}
