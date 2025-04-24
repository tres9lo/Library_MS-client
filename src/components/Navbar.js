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




    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 fixed w-full top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold tracking-wider hover:text-blue-200 transition duration-300">
          📚 Library Management
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>

              <Link to="/dashboard" className="nav-link hover:text-blue-200 transition duration-300 font-medium">
                Home
              </Link>

              <Link to="/books" className="nav-link hover:text-blue-200 transition duration-300 font-medium">
                Books
              </Link>

              <Link to="/borrow" className="nav-link hover:text-blue-200 transition duration-300 font-medium">
                Borrow/Return
              </Link>
              {user.role === 'admin' && (
                <>

                  <Link to="/add-book" className="nav-link hover:text-blue-200 transition duration-300 font-medium">
                    Add Book
                  </Link>

                  <Link to="/manage-borrows" className="nav-link hover:text-blue-200 transition duration-300 font-medium">
                    Manage Borrows
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}

                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>

              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition duration-300 font-medium">
                Login
              </Link>

              <Link to="/register" className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg transition duration-300 font-medium">
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