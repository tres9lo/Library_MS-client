import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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
      await axios.post(
        'http://localhost:5000/api/books',
        { title, author, isbn, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Book added successfully');
      navigate('/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add Book</h2>
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBook;