import { useState, FormEvent } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Authentication.css';
import toast, { Toaster } from 'react-hot-toast';

interface RegisterProps {
  onLogin: () => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isFormValid = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.invalid_email')); // Use translation for errors too
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(t('auth.password_weak'));
      return false;
    }

    if (password !== confirm_password) {
      setError(t('auth.passwords_mismatch'));
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const response = await authService.register(email, password);

      if (response.ok) {
        toast.success(t('auth.registered_successfully'));
        onLogin();
        navigate('/login');
      } else {
        const errorData = await response.json();
        // Identity API often returns an array of errors
        const errorMessage = errorData.description || errorData[0]?.description || t('auth.registration_failed');
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      toast.error(t('auth.server_unreachable'));
    }
  };

  return (
    <div className="register-container">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-message" role="alert">{error}</p>}
        
        <div className="auth-header">
          <img src={logo} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{t('auth.register_title')}</h2>
        </div>

        <input
          type="email"
          value={email}
          placeholder={t('auth.enter_email')}
          className="auth-input-field"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          value={password}
          placeholder={t('auth.enter_password')}
          className="auth-input-field"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          value={confirm_password}
          placeholder={t('auth.confirm_password')}
          className="auth-input-field"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-submit-btn">
          {t('auth.create_account')}
        </button>

        <p className="auth-footer-text">
          {t('auth.already_have_account')}{" "}
          <Link to="/login" className="auth-link">
            {t('auth.sign_in')}
          </Link>
        </p>
      </form>

      <div className="register-sidebar" />
    </div>
  );
}