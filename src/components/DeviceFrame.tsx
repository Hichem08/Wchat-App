import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Smartphone,
  QrCode,
  X,
  Copy,
  CheckCheck,
  Terminal,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ExpoExporter } from './ExpoExporter';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentAppUrl = typeof window !== 'undefined'
    ? window.location.href
    : 'https://ais-pre-w5edhudglbgsoem3fv6fl6-614362307704.europe-west3.run.app';

  const copyAppUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div
      className={`relative w-full h-[100dvh] h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#080810]' : 'bg-[#F5F4FA]'
      }`}
    >
      {/* Sleek Floating Quick Controls Bar (Desktop & Tablet utility, unobtrusive) */}
      <div className="absolute top-2 right-3 z-40 hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-[#121221]/80 backdrop-blur-md border border-[#29263D] shadow-lg">
        {/* Language selector */}
        <div className="flex items-center px-1">
          {[
            { id: 'en' as Language, label: 'EN' },
            { id: 'fr' as Language, label: 'FR' },
            { id: 'ar' as Language, label: 'العربية' },
          ].map(l => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                language === l.id
                  ? 'bg-[#8B3DFF] text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Dark/Light toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-full hover:bg-white/10 text-amber-400 transition-colors"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-purple-400" />}
        </button>

        {/* Width toggle (Mobile Size vs Full Width) */}
        <button
          type="button"
          onClick={() => setIsFullWidth(p => !p)}
          title={isFullWidth ? 'Mobile Width (Centered)' : 'Full Viewport Width'}
          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 transition-colors"
        >
          {isFullWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Scan to Phone QR */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          title="Scan QR Code to open on your Android phone"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[11px] font-semibold transition-all"
        >
          <QrCode className="w-3 h-3" />
          <span>Phone QR</span>
        </button>

        {/* Expo Go & ZIP */}
        <button
          type="button"
          onClick={() => setShowArchModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8B3DFF] hover:bg-purple-500 text-white text-[11px] font-semibold transition-all shadow-sm"
        >
          <Smartphone className="w-3 h-3" />
          <span>Expo Go</span>
        </button>
      </div>

      {/* Main Responsive App Container - 100% height and width on mobile, cleanly responsive */}
      <main
        className={`w-full h-full flex flex-col overflow-hidden relative ${
          isFullWidth
            ? 'max-w-none'
            : 'max-w-md sm:max-w-lg md:max-w-xl mx-auto sm:border-x sm:border-[#29263D]/40'
        } ${isDark ? 'bg-[#080810]' : 'bg-[#F5F4FA]'}`}
      >
        {children}
      </main>

      {/* Instant Phone QR Code Scanner Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl flex flex-col items-center text-center ${
              isDark ? 'bg-[#121221] border-[#29263D] text-[#F8F6FF]' : 'bg-white border-[#D8D4E8] text-zinc-900'
            }`}
          >
            <div className="w-full flex items-center justify-between mb-4 border-b pb-3 border-purple-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-left">Scan with your Phone</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Open your Android phone camera or QR scanner to open Wchat directly on your phone:
            </p>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl shadow-[0_0_25px_rgba(139,61,255,0.3)] mb-4">
              <QRCodeSVG
                value={currentAppUrl}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-[11px] font-semibold text-purple-400 mb-3">
              Matches your phone screen size automatically!
            </p>

            {/* Copy Link Row */}
            <div
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs mb-3 ${
                isDark ? 'bg-[#1B1A2B] border-[#29263D]' : 'bg-[#F5F4FA] border-[#D8D4E8]'
              }`}
            >
              <span className="truncate max-w-[200px] text-zinc-400 text-[11px] font-mono px-2">
                {currentAppUrl}
              </span>
              <button
                type="button"
                onClick={copyAppUrl}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shrink-0"
              >
                {copiedUrl ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* React Native Architecture & Expo Guide Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl ${
              isDark ? 'bg-[#121221] border-[#29263D] text-[#F8F6FF]' : 'bg-white border-[#D8D4E8] text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b pb-3 border-purple-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  W
                </div>
                <div>
                  <h3 className="font-bold text-lg">Wchat React Native & Expo Guide</h3>
                  <p className="text-xs text-purple-400">Architecture, Structure & Android Testing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowArchModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              {/* Direct Expo ZIP Download component */}
              <div className="p-1">
                <ExpoExporter />
              </div>

              <section className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4">
                <h4 className="font-bold text-sm text-purple-300 flex items-center gap-1.5 mb-2">
                  <Terminal className="w-4 h-4" /> How to run on your Android phone using Expo Go
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Install <strong>Expo Go</strong> from the Google Play Store on your Android phone.</li>
                  <li>
                    Click <strong>Download Expo ZIP</strong> above or open terminal in the project directory:
                    <div className="my-2 p-3 bg-black/80 rounded-xl font-mono text-emerald-400 text-xs select-all border border-purple-500/20">
                      cd expo-wchat<br />
                      npm install<br />
                      npx expo start
                    </div>
                  </li>
                  <li>
                    Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-purple-300">a</kbd> in your terminal to open in Android Emulator, or scan the displayed terminal QR code directly using the <strong>Expo Go</strong> app on your Android device!
                  </li>
                  <li>
                    The app opens immediately with native performance, dark neon aesthetics, multi-language RTL, and instant hot-reloading!
                  </li>
                </ol>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark ? 'bg-[#1B1A2B] border-[#29263D]' : 'bg-[#F5F4FA] border-[#D8D4E8]'
                  }`}
                >
                  <h5 className="font-bold text-purple-400 mb-1">Pure React Native Components</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li><code>SafeAreaView</code> & <code>StatusBar</code></li>
                    <li><code>LinearGradient</code> from <code>expo-linear-gradient</code></li>
                    <li><code>Feather</code> & <code>Ionicons</code> from <code>@expo/vector-icons</code></li>
                    <li><code>FlatList</code> & <code>ScrollView</code></li>
                    <li><code>Modal</code> for Call UI & Send File Sheet</li>
                    <li><code>StyleSheet</code> & responsive Dimensions</li>
                  </ul>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark ? 'bg-[#1B1A2B] border-[#29263D]' : 'bg-[#F5F4FA] border-[#D8D4E8]'
                  }`}
                >
                  <h5 className="font-bold text-emerald-400 mb-1">Backend Integration Roadmap</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li><code>authService.ts</code>: <code>supabase.auth.signUp()</code></li>
                    <li><code>chatService.ts</code>: Socket.IO events</li>
                    <li><code>messageService.ts</code>: Supabase Storage bucket</li>
                    <li><code>callService.ts</code>: <code>react-native-webrtc</code></li>
                    <li>PostgreSQL 24h auto-delete cron</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
