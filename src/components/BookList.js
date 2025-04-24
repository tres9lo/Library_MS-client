import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookList({ user }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data);
      } catch (error) {
        alert('Error fetching books');
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBooks(books.filter((book) => book.id !== id));
      alert('Book deleted');
    } catch (error) {
      alert('Error deleting book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book List</h1>
        <div className="bg-white p-6 rounded shadow-md">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Author</th>
                <th className="text-left p-2">ISBN</th>
                <th className="text-left p-2">Quantity</th>
                {user.role === 'admin' && <th className="text-left p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.isbn}</td>
                  <td className="p-2">{book.quantity}</td>
                  {user.role === 'admin' && (
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookList;