import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Register.css';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be 8+ characters with an uppercase letter, a number, and a symbol.");
      return false;
    }

    if (password !== confirm_password) {
      setError("Passwords do not match!");
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const response = await authService.register(email, password);

      if (response.ok) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        const errorData = await response.json();

        const errorMessage = errorData.message || errorData.description || "Registration failed";
        
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      toast.error("Server is unreachable. Please try again later.");
    }
  };

  return (
    <div className="register-container">
      <Toaster />
      <form onSubmit={handleSubmit} className="register-form">
        {error && <p className="error-message">{error}</p>}
        <div className="register-header">
          <img src={logo} alt="Logo" className="register-logo" />
          <h2 className="register-title">{t('auth.register_title')}</h2>
        </div>

        <input
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
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          {t('auth.create_account')}
        </button>

        <p className="footer-text">
          {t('auth.already_have_account')}{" "}
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