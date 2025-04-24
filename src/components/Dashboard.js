import React from 'react';

function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}</h1>
        <p className="text-gray-600">Use the navigation bar to access library features.</p>
      </div>
    </div>
  );
}

export default Dashboard;