import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Authentication.css';
import toast, { Toaster } from 'react-hot-toast';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await authService.login(email, password);
    if (response.ok) {
      onLogin(true);
      navigate('/dashboard');
    } else {
      onLogin(false);
      toast.error(t('auth.incorrect_username_password'));
    }
  };

  return (
    <div className="login-container">
      <Toaster />
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-header">
          <img src={logo} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{t('auth.register_title')}</h2>
        </div>
        
        <input 
          type="email" 
          placeholder={t('auth.email')} 
          className="auth-input-field" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder={t('auth.password')} 
          className="auth-input-field" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="auth-submit-btn">
          {t('auth.sign_in')}
        </button>
        
        <p className="auth-footer-text">
          {t('auth.dont_have_account')} <Link to="/register" className="auth-link">{t('auth.register')}</Link>
        </p>
      </form>
    </div>
  );
}