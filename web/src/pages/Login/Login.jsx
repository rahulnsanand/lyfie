import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Lyfie Login</h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          className="login-input" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="login-input" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="login-submit-btn">
          Sign In
        </button>
        
        <p className="login-footer">
          Don't have an account? <Link to="/register" className="register-link">Register</Link>
        </p>
      </form>
    </div>
  );
}