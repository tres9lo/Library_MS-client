import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 fixed w-full top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Library Management
        </Link>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Home
              </Link>
              <Link to="/books" className="hover:underline">
                Books
              </Link>
              <Link to="/borrow" className="hover:underline">
                Borrow/Return
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/add-book" className="hover:underline">
                    Add Book
                  </Link>
                  <Link to="/manage-borrows" className="hover:underline">
                    Manage Borrows
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="hover:underline focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;