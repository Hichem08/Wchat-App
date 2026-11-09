import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { WchatLogo } from '../components/WchatLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [emailOrPhone, setEmailOrPhone] = useState('hichembendali08@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ emailOrPhone, password });
    onNavigate('home');
  };

  const handleSocialLogin = (provider: 'google' | 'supabase') => {
    login({ emailOrPhone: `user_${provider}@wchat.app` });
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
        <h1 className="text-2xl font-bold mt-4 tracking-tight">{t('welcomeBack')}</h1>
        <p
          className={`text-xs text-center mt-1.5 max-w-xs ${
            isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
          }`}
        >
          {t('signInToAccount')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
        {/* Email or Phone */}
        <div
          className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
              : 'bg-white border-[#D8D4E8] focus-within:border-[#8B3DFF]'
          }`}
        >
          <Mail className={`w-4 h-4 shrink-0 text-[#9994AD] ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <input
            type="text"
            value={emailOrPhone}
            onChange={e => setEmailOrPhone(e.target.value)}
            placeholder={t('emailOrPhone')}
            className="w-full bg-transparent text-sm focus:outline-none"
            dir="ltr"
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

        {/* Log In Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 mt-1 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white font-semibold text-base shadow-[0_4px_24px_rgba(139,61,255,0.4)] hover:shadow-[0_6px_30px_rgba(139,61,255,0.55)] active:scale-[0.98] transition-all"
        >
          {t('logIn')}
        </button>

        {/* Forgot password */}
        <div className="text-center mt-1">
          <button
            type="button"
            onClick={() => alert(isRTL ? 'تم إرسال رابط استعادة كلمة المرور' : 'Password reset link sent to your email')}
            className={`text-xs hover:underline ${
              isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
            }`}
          >
            {t('forgotPassword')}
          </button>
        </div>

        {/* Divider "or" */}
        <div className="flex items-center my-3">
          <div className={`flex-1 border-t ${isDark ? 'border-[#29263D]' : 'border-[#D8D4E8]'}`} />
          <span className={`px-3 text-xs uppercase ${isDark ? 'text-[#9994AD]' : 'text-[#68647E]'}`}>
            {t('or')}
          </span>
          <div className={`flex-1 border-t ${isDark ? 'border-[#29263D]' : 'border-[#D8D4E8]'}`} />
        </div>

        {/* Social Logins */}
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 border transition-all active:scale-[0.98] ${
            isDark
              ? 'bg-[#121221] border-[#29263D] hover:border-zinc-700 text-white'
              : 'bg-white border-[#D8D4E8] hover:border-zinc-300 text-zinc-900'
          }`}
        >
          {/* Google G Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-xs font-semibold">{t('continueWithGoogle')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('supabase')}
          className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 border transition-all active:scale-[0.98] ${
            isDark
              ? 'bg-[#121221] border-[#29263D] hover:border-emerald-500/50 text-white'
              : 'bg-white border-[#D8D4E8] hover:border-emerald-500/50 text-zinc-900'
          }`}
        >
          {/* Supabase Green Lightning Bolt */}
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.9 1.1L3.6 13.9c-.3.5 0 1.1.6 1.1h7.1l-2.4 8c-.2.7.7 1.2 1.2.7l9.4-12.8c.4-.5 0-1.2-.6-1.2h-7.1l2.4-7.9c.3-.8-.6-1.3-1.3-.7z" />
          </svg>
          <span className="text-xs font-semibold">{t('continueWithSupabase')}</span>
        </button>

        {/* Don't have an account */}
        <div className="text-center mt-3 pb-6">
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className={`text-xs hover:underline ${
              isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
            }`}
          >
            {t('dontHaveAccount')}
          </button>
        </div>
      </form>
    </div>
  );
};
