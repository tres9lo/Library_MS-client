import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function BorrowBook({ user }) {
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [booksRes, historyRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books'),
        axios.get('http://localhost:5000/api/borrow/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      ]);
      setBooks(booksRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleBorrow = async () => {
    if (selectedBooks.length === 0) {
      toast.error('Please select at least one book to borrow');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/borrow',
        { bookIds: selectedBooks },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`${selectedBooks.length} book(s) borrowed successfully`);
      setSelectedBooks([]);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error borrowing books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (borrowId) => {
    setIsLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/borrow/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Book returned successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error returning book');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Library Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Available Books</h2>
            <input
              type="text"
              placeholder="Search books..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                        disabled={book.quantity <= 0}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">{book.title}</td>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        book.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            onClick={handleBorrow}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedBooks.length === 0 || isLoading}
          >
            {isLoading ? 'Processing...' : `Borrow Selected Books (${selectedBooks.length})`}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Borrow History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((borrow) => (
                  <tr key={borrow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{borrow.title}</td>
                    <td className="px-6 py-4">{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{borrow.return_date ? new Date(borrow.return_date).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        borrow.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {borrow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {borrow.status === 'borrowed' && (
                        <button
                          onClick={() => handleReturn(borrow.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Return'}
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
    </div>
  );
}

export default BorrowBook;