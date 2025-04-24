import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function BookList({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data);
      } catch (error) {
        toast.error('Error fetching books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBooks(books.filter((book) => book.id !== id));
        toast.success('Book deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Book List</h1>
          {user.role === 'admin' && (
            <Link
              to="/add-book"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
            >
              Add New Book
            </Link>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500">No books found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Author</th>
                    <th className="text-left p-3 font-semibold">ISBN</th>
                    <th className="text-left p-3 font-semibold">Quantity</th>
                    {user.role === 'admin' && <th className="text-left p-3 font-semibold">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-3">{book.title}</td>
                      <td className="p-3">{book.author}</td>
                      <td className="p-3">{book.isbn}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full ${book.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {book.quantity}
                        </span>
                      </td>
                      {user.role === 'admin' && (
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Link
                              to={`/update-book/${book.id}`}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookList;