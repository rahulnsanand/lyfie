import { useState } from 'react';
import { authService } from '../authService';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await authService.login(email, password);
    if (response.ok) {
      onLogin();
      navigate('/dashboard');
    } else {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Lyfie Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" 
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded" 
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Sign In
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link>
        </p>
      </form>
    </div>
  );
}