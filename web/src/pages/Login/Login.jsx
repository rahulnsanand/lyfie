import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';
import logo from '../../assets/logo.svg';
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
          {t('auth.sign_in')}
        </button>
        
        <p className="login-footer">
          {t('auth.already_have_account')} <Link to="/register" className="register-link">{t('auth.register')}</Link>
        </p>
      </form>
    </div>
  );
}