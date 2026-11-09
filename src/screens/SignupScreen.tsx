import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Hash, Lock, Eye, EyeOff } from 'lucide-react';
import { WchatLogo } from '../components/WchatLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError(isRTL ? 'الرجاء إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError(isRTL ? 'الرجاء إدخال البريد أو رقم الهاتف' : 'Please enter an email or phone number');
      return;
    }

    signup({
      fullName,
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@wchat.app`,
      phone: phone.trim() || '+1 555 019 2831',
      matricule: matricule.trim() || '2025' + Math.floor(100 + Math.random() * 900),
      password,
    });

    onNavigate('home');
  };

  return (
    <div
      className={`relative flex flex-col h-full overflow-y-auto px-6 py-4 ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Header Back Button */}
      <div className="flex items-center pt-2 mb-2">
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-zinc-900'
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Top Logo & Headings */}
      <div className="flex flex-col items-center mb-6">
        <WchatLogo size="md" showText={true} />
        <h1 className="text-2xl font-bold mt-4 tracking-tight">{t('createAccount')}</h1>
        <p
          className={`text-xs text-center mt-1.5 max-w-xs ${
            isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
          }`}
        >
          {t('joinWchat')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3.5 pb-6">
        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-3.5 py-2.5 rounded-xl">
            {error}
          </div>
        ) : null}

        {/* Full Name */}
        <div
          className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
              : 'bg-white border-[#D8D4E8] focus-within:border-[#8B3DFF]'
          }`}
        >
          <User className={`w-4 h-4 shrink-0 text-[#9994AD] ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <input
            type="text"
            value={fullName}
            onChange={e => {
              setFullName(e.target.value);
              setError('');
            }}
            placeholder={t('fullName')}
            className="w-full bg-transparent text-sm focus:outline-none"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Email */}
        <div
          className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
              : 'bg-white border-[#D8D4E8] focus-within:border-[#8B3DFF]'
          }`}
        >
          <Mail className={`w-4 h-4 shrink-0 text-[#9994AD] ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder={t('email')}
            className="w-full bg-transparent text-sm focus:outline-none"
            dir="ltr"
          />
        </div>

        {/* Phone Number */}
        <div
          className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
              : 'bg-white border-[#D8D4E8] focus-within:border-[#8B3DFF]'
          }`}
        >
          <Phone className={`w-4 h-4 shrink-0 text-[#9994AD] ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder={t('phoneNumber')}
            className="w-full bg-transparent text-sm focus:outline-none"
            dir="ltr"
          />
        </div>

        {/* Matricule (optional) */}
        <div
          className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
              : 'bg-white border-[#D8D4E8] focus-within:border-[#8B3DFF]'
          }`}
        >
          <Hash className={`w-4 h-4 shrink-0 text-[#9994AD] ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <input
            type="text"
            value={matricule}
            onChange={e => setMatricule(e.target.value)}
            placeholder={t('matricule')}
            className="w-full bg-transparent text-sm focus:outline-none"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Password */}
        <div
          className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
              : 'bg-white border-[#D8D4E8] focus-within:border-[#8B3DFF]'
          }`}
        >
          <Lock className={`w-4 h-4 shrink-0 text-[#9994AD] ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('password')}
            className="w-full bg-transparent text-sm focus:outline-none"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="text-[#9994AD] hover:text-white p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Sign Up Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 mt-2 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white font-semibold text-base shadow-[0_4px_24px_rgba(139,61,255,0.4)] hover:shadow-[0_6px_30px_rgba(139,61,255,0.55)] active:scale-[0.98] transition-all"
        >
          {t('signUp')}
        </button>

        {/* Already have an account */}
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className={`text-xs hover:underline ${
              isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
            }`}
          >
            {t('alreadyHaveAccount')}
          </button>
        </div>
      </form>
    </div>
  );
};
