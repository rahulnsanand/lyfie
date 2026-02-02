import { useState } from 'react';
import React from 'react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Authentication.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Field, Input, Transition } from '@headlessui/react';

interface AuthenticationProps {
  onLogin: (status: boolean) => void;
}

export default function Authentication({ onLogin }: AuthenticationProps) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

        <Transition
          show={isNewUser}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 -translate-y-4 max-h-0"
          enterTo="opacity-100 translate-y-0 max-h-20"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 max-h-20"
          leaveTo="opacity-0 -translate-y-4 max-h-0"
        >
          <Field className="mb-4">
            <Input
              type="text"
              placeholder={t('auth.text.name')}
              className="auth-input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isNewUser}
            />
          </Field>
        </Transition>

        <Field>
          <Input 
            type="email" 
            placeholder={isNewUser ? t('auth.text.user_email') : t('auth.text.admin_email')}
            className="auth-input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </Field>

        <Field>
          <Input 
            type="password" 
            placeholder={isNewUser ? t('auth.text.user_password') : t('auth.text.admin_password')}
            className="auth-input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </Field>

        <Transition
          show={isNewUser}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 -translate-y-4 max-h-0"
          enterTo="opacity-100 translate-y-0 max-h-20"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 max-h-20"
          leaveTo="opacity-0 -translate-y-4 max-h-0"
        >
          <Field className="mb-4">
            <Input
              type="password"
              value={confirm_password}
              placeholder={t('auth.text.user_confirm_password')}
              className="auth-input-field"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={isNewUser}
            />
          </Field>
        </Transition>

        <Button
          type="submit"
          disabled={isLoading}
          className={`auth-submit-btn ${isLoading ? 'is-loading' : ''}`}
        >
          <span className={isLoading ? 'animate-pulse' : ''}>
            {isLoading 
              ? (isNewUser ? t('auth.text.signing_up') : t('auth.text.signing_in'))
              : (isNewUser ? t('auth.text.sign_up') : t('auth.text.sign_in'))}
          </span>
        </Button>

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