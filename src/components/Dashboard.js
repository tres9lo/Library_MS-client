import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    booksBorrowed: 0,
    currentlyReading: 0,
    completedBooks: 0,
    booksDueSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async (retryCount = 0) => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/auth/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(res.data);
    } catch (error) {
      if (retryCount < 2) {
        // Retry up to 2 times with a 1-second delay
        setTimeout(() => fetchStats(retryCount + 1), 1000);
      } else {
        toast.error(error.response?.data?.message || 'Error fetching stats');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []); // Empty dependency array to fetch only on mount

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 pt-20">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-indigo-800">Welcome, {user.username}</h1>
          <p className="text-gray-600 text-lg mb-6">Use the navigation bar to access library features.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/borrow" className="bg-indigo-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">My Books</h2>
              <p className="text-gray-600">View and manage your borrowed books</p>
            </Link>
            
            <Link to="/books" className="bg-purple-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-purple-700">Browse Catalog</h2>
              <p className="text-gray-600">Explore our extensive collection of books</p>
            </Link>
            
            <Link to="/borrow" className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-blue-700">Reading History</h2>
              <p className="text-gray-600">Track your reading progress and history</p>
            </Link>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
            {loading ? (
              <div className="text-center text-gray-600">Loading stats...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{stats.booksBorrowed}</p>
                  <p className="text-gray-600">Books Borrowed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{stats.currentlyReading}</p>
                  <p className="text-gray-600">Currently Reading</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{stats.completedBooks}</p>
                  <p className="text-gray-600">Completed Books</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{stats.booksDueSoon}</p>
                  <p className="text-gray-600">Due Soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;