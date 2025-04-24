import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function BorrowBook({ user }) {
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data);
      } catch (error) {
        toast.error('Error fetching books');
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/borrow/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setHistory(res.data);
      } catch (error) {
        toast.error('Error fetching borrow history');
      }
    };

    fetchBooks();
    fetchHistory();
  }, []);

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleBorrow = async () => {
    if (selectedBooks.length === 0) {
      toast.error('Please select at least one book to borrow');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/borrow',
        { bookIds: selectedBooks },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`${selectedBooks.length} book(s) borrowed successfully`);
      setSelectedBooks([]);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error borrowing books');
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/borrow/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Book returned successfully');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error returning book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Borrow/Return Books</h1>
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Books</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Select</th>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Author</th>
                <th className="text-left p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => handleSelectBook(book.id)}
                      disabled={book.quantity <= 0}
                    />
                  </td>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleBorrow}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={selectedBooks.length === 0}
          >
            Borrow Selected Books
          </button>
        </div>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Borrow History</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Borrow Date</th>
                <th className="text-left p-2">Return Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((borrow) => (
                <tr key={borrow.id}>
                  <td className="p-2">{borrow.title}</td>
                  <td className="p-2">{borrow.borrow_date}</td>
                  <td className="p-2">{borrow.return_date || '-'}</td>
                  <td className="p-2">{borrow.status}</td>
                  <td className="p-2">
                    {borrow.status === 'borrowed' && (
                      <button
                        onClick={() => handleReturn(borrow.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BorrowBook;