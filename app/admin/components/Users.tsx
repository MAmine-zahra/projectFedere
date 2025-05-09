'use client';
import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    nom: string | null;
    email: string | null;
    mot_de_passe: string | null;
    role: string | null;
}

const UsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/utilisateurs');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:5000/api/utilisateurs/${id}`, {
                method: 'DELETE',
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedUserId(expandedUserId === id ? null : id);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users Management</h1>
            <table className="table-auto w-full border-collapse border border-gray-300 bg-white text-black rounded-lg">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Nom</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <React.Fragment key={user.id}>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.nom || 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email || 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.role || 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => toggleExpand(user.id)}
                                    >
                                        {expandedUserId === user.id ? 'Hide Details' : 'Details'}
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            {expandedUserId === user.id && (
                                <tr>
                                    <td colSpan={5} className="border border-gray-300 px-4 py-2 bg-gray-50">
                                        <div
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                expandedUserId === user.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <p><strong>ID:</strong> {user.id}</p>
                                            <p><strong>Nom:</strong> {user.nom || 'N/A'}</p>
                                            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                                            <p><strong>Mot de Passe:</strong> {user.mot_de_passe || 'N/A'}</p>
                                            <p><strong>Role:</strong> {user.role || 'N/A'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;




