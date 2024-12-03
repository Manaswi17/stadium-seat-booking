import React, { useState } from 'react';

function SignUpForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          placeholder="Your Name"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          placeholder="Your Phone Number"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          placeholder="Create a password"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          placeholder="Confirm your password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-green-500 text-white font-semibold rounded shadow-md"
      >
        Sign Up
      </button>
    </form>
  );
}

export default SignUpForm;
