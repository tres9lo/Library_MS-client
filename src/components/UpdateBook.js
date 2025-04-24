import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function UpdateBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books`);
        const book = res.data.find((b) => b.id === parseInt(id));
        if (book) {
          setTitle(book.title);
          setAuthor(book.author);
          setIsbn(book.isbn);
          setQuantity(book.quantity);
        } else {
          toast.error('Book not found');
          navigate('/books');
        }
      } catch (error) {
        toast.error('Error fetching book');
      }
    };
    fetchBook();
  }, [id, navigate]);

  const validateForm = () => {
    if (!title || title.trim() === '') {
      toast.error('Title is required');
      return false;
    }
    if (!author || author.trim() === '') {
      toast.error('Author is required');
      return false;
    }
    if (!isbn || !/^\d{10,13}$/.test(isbn)) {
      toast.error('Valid ISBN (10-13 digits) is required');
      return false;
    }
    if (quantity < 0) {
      toast.error('Quantity must be non-negative');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/books/${id}`,
        { title, author, isbn, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Book updated successfully');
      navigate('/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating book');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-12 px-4 sm:px-6 mt-9 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Update Book Details</h2>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter book title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN Number</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter ISBN number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity Available</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-105"
              >
                Update Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBook;