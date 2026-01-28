import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';
import logo from '../../assets/logo.svg';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await authService.login(email, password);
    if (response.ok) {
      onLogin();
      navigate('/dashboard');
    } else {
      alert(t('auth.incorrect_username_password'));
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-title">{t('auth.register_title')}</h2>
        </div>
        
        <input 
          type="email" 
          placeholder={t('auth.email')} 
          className="login-input" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder={t('auth.password')} 
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