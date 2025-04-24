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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Borrow Records</h1>
        <div className="bg-white p-6 rounded shadow-md">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Book Title</th>
                <th className="text-left p-2">Borrow Date</th>
                <th className="text-left p-2">Return Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow.id}>
                  <td className="p-2">{borrow.username}</td>
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
                        Mark as Returned
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

export default ManageBorrows;