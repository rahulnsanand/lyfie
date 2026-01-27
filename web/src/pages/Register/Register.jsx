import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-header">
          <img src={logo} alt="Logo" className="register-logo" />
          <h2 className="register-title">{t('auth.register_title')}</h2>
        </div>

        <input
          type="email"
          placeholder={t('auth.email')}
          className="input-field"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t('auth.password')}
          className="input-field"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t('auth.confirm_password')}
          className="input-field"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          {t('auth.create_account')}
        </button>

        <p className="footer-text">
          {t('auth.already_account')}{" "}
          <Link to="/login" className="login-link">
            {t('auth.sign_in')}
          </Link>
        </p>
      </form>

      <div className="register-sidebar">
        {/* Empty space or background image */}
      </div>
    </div>
  );
}