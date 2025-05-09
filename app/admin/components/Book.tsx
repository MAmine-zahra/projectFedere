'use client';
import { formatDate } from '@/app/utils/date';
import React, { useEffect, useState } from 'react';

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
    auteur: string;
    disponible: number;
    image: string;
    genre: string;
    isbn: string;
    edition: string;
    description: string;
    etat: number;
    issuedDetails?: IssuedDetail[];
}

const BookManager: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/livres');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchBookDetails = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/emprunts/${id}`);
            if (!response.ok) {
                throw new Error('Error fetching book details');
            }
            const details = await response.json();
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === id ? { ...book, issuedDetails: details } : book
                )
            );
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await fetch(`http://localhost:5000/api/livres/${id}`, {
                    method: 'DELETE',
                });
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const toggleExpand = (id: number) => {
        if (expandedBookId === id) {
            setExpandedBookId(null);
        } else {
            setExpandedBookId(id);
            fetchBookDetails(id);
        }
    };

    const handleOpenModal = (book: Book | null = null) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
        setIsModalOpen(false);
    };

    const handleSave = async (book: Book) => {
        try {
            if (book.id) {
                // Update book
                console.log('Updating book:', book);
                await fetch(`http://localhost:5000/api/livres/${book.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(book),
                });
            } else {
                console.log('Adding new book:', book);
                // Add new book
                await fetch('http://localhost:5000/api/livres', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(book),
                });
            }
            fetchBooks();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Book Manager</h1>
            <button
                className="bg-green-500 text-black px-4 py-2 rounded mb-4"
                onClick={() => handleOpenModal()}
            >
                Add New Book
            </button>
            <table className="table-auto w-full border-collapse border border-gray-300 bg-white text-black rounded-lg">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Image</th>
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Author</th>
                        <th className="border border-gray-300 px-4 py-2">Genre</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <React.Fragment key={book.id}>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">
                                    <img
                                        src={book.image}
                                        alt={book.titre}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{book.titre}</td>
                                <td className="border border-gray-300 px-4 py-2">{book.auteur}</td>
                                <td className="border border-gray-300 px-4 py-2">{book.genre}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-black px-2 py-1 rounded mr-2"
                                        onClick={() => toggleExpand(book.id)}
                                    >
                                        {expandedBookId === book.id ? 'Hide Details' : 'Details'}
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-black px-2 py-1 rounded mr-2"
                                        onClick={() => handleOpenModal(book)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 text-black px-2 py-1 rounded"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            {expandedBookId === book.id && (
                                <tr>
                                    <td colSpan={5} className="border border-gray-300 px-4 py-2 bg-gray-50">
                                      
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
                                                <p className="mt-2 text-gray-600">
                                                    <strong>Auteur :</strong> {book.auteur}
                                                </p>
                                                <p className="mt-1 text-gray-600">
                                                    <strong>ISBN :</strong> {book.isbn}
                                                </p>
                                                <p className="mt-1 text-gray-600">
                                                    <strong>Disponibles :</strong> {book.disponible}
                                                </p>
                                                <p className="mt-1 text-gray-600">
                                                    <strong>Edition :</strong> {book.edition}
                                                </p>
                                                <p className="mt-4 text-gray-700">{book.description}</p>
                                            </div>
                                        </div>
                                          <div>
                                            <div className="mt-10">
                                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                                    Historique des emprunts
                                                </h2>
                                                {book.issuedDetails && book.issuedDetails.length > 0 ? (
                                                    <table className="w-full border border-gray-300 rounded-md">
                                                        <thead>
                                                            <tr className="bg-purple-400 text-black">
                                                                <th className="border px-4 py-2">Utilisateur</th>
                                                                <th className="border px-4 py-2">Date d'emprunt</th>
                                                                <th className="border px-4 py-2">Date de retour</th>
                                                                <th className="border px-4 py-2">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {book.issuedDetails.map((detail) => (
                                                                <tr
                                                                    key={detail.id}
                                                                    className="text-center text-black"
                                                                >
                                                                    <td className="border px-4 py-2">
                                                                        {detail.utilisateur}
                                                                    </td>
                                                                    <td className="border px-4 py-2">
                                                                        {formatDate(detail.date_emprunt)}
                                                                    </td>
                                                                    <td className="border px-4 py-2">
                                                                        {formatDate(detail.date_retour)}
                                                                    </td>
                                                                    <td className="border px-4 py-2">
                                                                        <button
                                                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                                                            onClick={async () => {
                                                                                const confirmDelete = window.confirm(
                                                                                    'Are you sure you want to delete this emprunt?'
                                                                                );
                                                                                if (confirmDelete) {
                                                                                    try {
                                                                                        await fetch(`http://localhost:5000/api/emprunts/${detail.id}`, {
                                                                                            method: 'DELETE',
                                                                                        });
                                                                                        // Refresh the book details after deletion
                                                                                        fetchBookDetails(book.id);
                                                                                    } catch (error) {
                                                                                        console.error('Error deleting emprunt:', error);
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-gray-600">
                                                        Aucun emprunt pour ce livre.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white text-black w-3/4 max-w-4xl p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedBook ? 'Update Book' : 'Add New Book'}
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const bookData: Book = {
                                    id: selectedBook?.id || 0,
                                    titre: formData.get('titre') as string,
                                    auteur: formData.get('auteur') as string,
                                    disponible: Number(formData.get('disponible')),
                                    image: formData.get('image') as string,
                                    genre: formData.get('genre') as string,
                                    isbn: formData.get('isbn') as string,
                                    edition: formData.get('edition') as string,
                                    description: formData.get('description') as string,
                                    etat: selectedBook?.etat || 0,
                                };
                                handleSave(bookData);
                            }}
                        >
                            <input
                                name="titre"
                                placeholder="Title"
                                defaultValue={selectedBook?.titre || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="auteur"
                                placeholder="Author"
                                defaultValue={selectedBook?.auteur || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="image"
                                placeholder="Image URL"
                                defaultValue={selectedBook?.image || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="genre"
                                placeholder="Genre"
                                defaultValue={selectedBook?.genre || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="isbn"
                                placeholder="ISBN"
                                defaultValue={selectedBook?.isbn || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="edition"
                                placeholder="Edition"
                                defaultValue={selectedBook?.edition || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                defaultValue={selectedBook?.description || ''}
                                required
                                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-black px-4 py-2 rounded mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 text-black px-4 py-2 rounded"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookManager;