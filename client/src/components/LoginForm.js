import React, { useState } from 'react';

function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded shadow-md hover:from-blue-600 hover:to-green-500"
      >
        Log In
      </button>
    </form>
  );
}

export default LoginForm;
