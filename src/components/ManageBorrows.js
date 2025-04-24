import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ManageBorrows() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/borrow/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBorrows(res.data);
      } catch (error) {
        toast.error('Error fetching borrow records');
      }
    };
    fetchBorrows();
  }, []);

  const handleReturn = async (borrowId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/borrow/admin/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Book marked as returned successfully');
      setBorrows(
        borrows.map((borrow) =>
          borrow.id === borrowId
            ? { ...borrow, status: 'returned', return_date: new Date().toISOString().split('T')[0] }
            : borrow
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error marking book as returned');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen mt-9 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Borrow Management</h1>
          <p className="text-lg text-gray-600">Track and manage all book borrowing activities</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrows.map((borrow) => (
                  <tr key={borrow.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{borrow.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{borrow.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{borrow.borrow_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{borrow.return_date || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        borrow.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {borrow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {borrow.status === 'borrowed' && (
                        <button
                          onClick={() => handleReturn(borrow.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                          Return Book
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

export default ManageBorrows;