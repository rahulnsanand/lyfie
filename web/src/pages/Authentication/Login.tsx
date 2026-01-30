import { useState } from 'react';
import React from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Authentication.css';
import toast, { Toaster } from 'react-hot-toast';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();    
      try {
        const response = await authService.login(email, password);
        
        // response.ok is true if status is 200-299
        if (response.ok) {
          onLogin(true);
          navigate('/dashboard');
        } else {
          // This handles the 401 case
          onLogin(false);
          toast.error(t('auth.incorrect_username_password'));
        }
      } catch (error) {
        // This handles network/server-down cases
        toast.error(t('auth.network_error'));
        console.error("Login Error:", error);
      }
  };

  return (
    <div className="login-container">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-header">
          <img src={logo} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{t('auth.register_title')}</h2>
        </div>
        
        <input 
          type="email" 
          placeholder={t('auth.email')} 
          className="auth-input-field" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder={t('auth.password')} 
          className="auth-input-field" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="auth-submit-btn">
          {t('auth.sign_in')}
        </button>
        
        <p className="auth-footer-text">
          {t('auth.dont_have_account')}{' '}
          <Link to="/register" className="auth-link">
            {t('auth.register')}
          </Link>
        </p>
      </form>
    </div>
  );
}