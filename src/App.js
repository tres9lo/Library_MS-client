import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import BorrowBook from './components/BorrowBook';
import ManageBorrows from './components/ManageBorrows';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/books"
          element={user ? <BookList user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-book"
          element={user && user.role === 'admin' ? <AddBook /> : <Navigate to="/login" />}
        />
        <Route
          path="/borrow"
          element={user ? <BorrowBook user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/manage-borrows"
          element={user && user.role === 'admin' ? <ManageBorrows /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;