import { useState } from 'react';
import { authService } from '../authService';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await authService.register(email, password);
    if (response.ok) {
      alert("Registration successful! Please login.");
      navigate('/login');
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Join Lyfie</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" 
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded" 
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Create Account
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-green-600">Login</Link>
        </p>
      </form>
    </div>
  );
}