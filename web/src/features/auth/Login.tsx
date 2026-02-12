import { useState, type FormEvent } from 'react';
import { authService } from '@features/auth/services/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '@assets/logo.svg';
import './Login.css';
import toast, { Toaster } from 'react-hot-toast';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [confirm_password, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const isFormValid = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('auth.error.invalid_email')); 
      return false;
    }

    if (isNewUser) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error(t('auth.error.password_weak'));
        return false;
      }

      if (password !== confirm_password) {
        toast.error(t('auth.error.passwords_mismatch'));
        return false;
      }
      
      if (!name || name.trim().length < 2) {
        toast.error(t('auth.error.name_required'));
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();   
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      const response = isNewUser 
        ? await authService.register(name, email, password)
        : await authService.login(email, password);

      toast.success(isNewUser ? t('auth.message.registered_successfully') : '');
        onLogin(true);
        navigate('/dashboard');
    } catch (err) {
      toast.error(t('auth.error.network_error'));
    } finally {
        setIsLoading(false); // Stop loading regardless of success/fail
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-right" />
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-header">
          <img src={logo} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{t('appname')}</h2>
        </div>

        <div className={`auth-collapse ${isNewUser ? 'is-visible' : ''}`} aria-hidden={!isNewUser}>
          <div className="auth-collapse-inner">
            <input
              type="text"
              placeholder={t('auth.text.name')}
              className="auth-input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isNewUser}
              disabled={!isNewUser}
              tabIndex={isNewUser ? 0 : -1}
            />
          </div>
        </div>

        <div>
          <input 
            type="email" 
            placeholder={isNewUser ? t('auth.text.user_email') : t('auth.text.admin_email')}
            className="auth-input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div>
          <input 
            type="password" 
            placeholder={isNewUser ? t('auth.text.user_password') : t('auth.text.admin_password')}
            className="auth-input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div className={`auth-collapse ${isNewUser ? 'is-visible' : ''}`} aria-hidden={!isNewUser}>
          <div className="auth-collapse-inner">
            <input
              type="password"
              value={confirm_password}
              placeholder={t('auth.text.user_confirm_password')}
              className="auth-input-field"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={isNewUser}
              disabled={!isNewUser}
              tabIndex={isNewUser ? 0 : -1}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`auth-submit-btn ${isLoading ? 'is-loading' : ''}`}
        >
          <span className={isLoading ? 'animate-pulse' : ''}>
            {isLoading 
              ? (isNewUser ? t('auth.text.signing_up') : t('auth.text.signing_in'))
              : (isNewUser ? t('auth.text.sign_up') : t('auth.text.sign_in'))}
          </span>
        </button>

         <p className="auth-footer-text">
          {isNewUser ? t('auth.message.already_have_account') + ' ' : t('auth.message.dont_have_account') + ' '}
          <span 
            onClick={() => setIsNewUser(!isNewUser)} 
            className="auth-link"
            style={{ cursor: 'pointer' }}
          >
            {isNewUser ? t('auth.text.sign_in') : t('auth.text.sign_up')}
          </span>
        </p>
      </form>
    </div>
  );
}