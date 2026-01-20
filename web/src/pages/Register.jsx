import { useState } from 'react';
import { authService } from '../authService';
import { Link, useNavigate } from 'react-router-dom';
import Aurora from '../components/Aurora';
import { useTranslation } from 'react-i18next';

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
    /* 1. Relative container to hold everything */
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#b407e4", "#eaa648", "#29d4ff"]}
          blend={0.56}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="relative z-10 p-8 shadow-2xl rounded-2xl w-96 mx-4 transition-colors duration-500
                 bg-bg-main/60 backdrop-blur-md border border-text-main/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          {t('auth.register_title')}
        </h2>
        
        <input 
          type="email" 
          placeholder={t('auth.email')} 
          className="w-full p-3 mb-4 rounded-lg outline-none transition-all duration-300
                    bg-bg-main/50 text-text-main border border-text-main/20
                    focus:ring-2 focus:ring-green-500 focus:border-green-500
                    placeholder:text-text-main/40" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder={t('auth.password')}  
          className="w-full p-3 mb-4 rounded-lg outline-none transition-all duration-300
                    bg-bg-main/50 text-text-main border border-text-main/20
                    focus:ring-2 focus:ring-green-500 focus:border-green-500
                    placeholder:text-text-main/40" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <input 
          type="password" 
          placeholder={t('auth.confirm_password')} 
          className="w-full p-3 mb-4 rounded-lg outline-none transition-all duration-300
                    bg-bg-main/50 text-text-main border border-text-main/20
                    focus:ring-2 focus:ring-green-500 focus:border-green-500
                    placeholder:text-text-main/40" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
        >
          {t('auth.create_account')} 
        </button>
        
        <p className="mt-4 text-sm text-center text-gray-600">
          {t('auth.already_account')} <Link to="/login" className="text-green-600 font-semibold hover:underline">{t('auth.sign_in')} </Link>
        </p>
      </form>
    </div>
    );
}