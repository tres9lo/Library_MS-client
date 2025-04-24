import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/books"
            className="bg-white p-6 rounded shadow-md hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">View Books</h2>
            <p className="text-gray-600">Browse the library's book collection</p>
          </Link>
          {user.role === 'admin' && (
            <>
              <Link
                to="/add-book"
                className="bg-white p-6 rounded shadow-md hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">Add Book</h2>
                <p className="text-gray-600">Add a new book to the library</p>
              </Link>
              <Link
                to="/manage-borrows"
                className="bg-white p-6 rounded shadow-md hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">Manage Borrows</h2>
                <p className="text-gray-600">View and manage book borrowing records</p>
              </Link>
            </>
          )}
          <Link
            to="/borrow"
            className="bg-white p-6 rounded shadow-md hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">Borrow/Return Books</h2>
            <p className="text-gray-600">Manage your borrowed books</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;