import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Globe,
  Wifi,
  Battery,
  Code2,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  Terminal,
} from 'lucide-react';
import { ExpoExporter } from './ExpoExporter';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [showArchModal, setShowArchModal] = useState(false);

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-[#040409]' : 'bg-[#E5E3F0]'
    }`}>
      {/* Top Floating Control Bar for Demo / Testing */}
      <header className="w-full max-w-4xl px-4 py-2.5 flex items-center justify-between z-30 select-none">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-fuchsia-600 flex items-center justify-center shadow-[0_0_10px_rgba(139,61,255,0.6)]">
            <span className="text-white font-extrabold text-sm">W</span>
          </div>
          <div>
            <h1 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Wchat <span className="text-[11px] font-normal text-purple-400">Mobile React Native</span>
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Quick Pills */}
          <div className={`flex items-center p-0.5 rounded-full border text-xs ${
            isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
          }`}>
            {[
              { id: 'en' as Language, label: 'EN' },
              { id: 'fr' as Language, label: 'FR' },
              { id: 'ar' as Language, label: 'العربية (RTL)' },
            ].map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                  language === l.id
                    ? 'bg-[#8B3DFF] text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-full border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] text-amber-400 hover:border-zinc-700'
                : 'bg-white border-[#D8D4E8] text-purple-700 hover:border-zinc-300'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Frame Toggle */}
          <button
            type="button"
            onClick={() => setIsPhoneFrame(p => !p)}
            title={isPhoneFrame ? 'Expand to Full Viewport' : 'Show Phone Frame'}
            className={`p-2 rounded-full border transition-all hidden sm:flex ${
              isDark
                ? 'bg-[#121221] border-[#29263D] text-zinc-300 hover:text-white'
                : 'bg-white border-[#D8D4E8] text-zinc-700 hover:text-black'
            }`}
          >
            {isPhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Architecture & Run Guide Button */}
          <button
            type="button"
            onClick={() => setShowArchModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8B3DFF] to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(139,61,255,0.45)] transition-all active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Expo Go / Android</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
        {isPhoneFrame ? (
          /* Phone Bezel Simulator */
          <div className="relative w-full max-w-[412px] h-[860px] max-h-[96vh] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(139,61,255,0.15)] bg-gradient-to-b from-[#24223A] via-[#121122] to-[#181628] border-4 border-[#2D2A45] flex flex-col overflow-hidden">
            {/* Screen Inner Glass */}
            <div className={`relative flex-1 rounded-[38px] overflow-hidden flex flex-col border shadow-inner ${
              isDark ? 'bg-[#080810] border-[#25223A]' : 'bg-[#F5F4FA] border-[#D8D4E8]'
            }`}>
              {/* Mobile Status Bar (9:41, Dynamic Island, Wifi, Battery) */}
              <div
                className={`h-11 px-6 pt-1 flex items-center justify-between text-xs font-semibold shrink-0 select-none z-30 ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}
                dir="ltr"
              >
                <span>9:41</span>
                
                {/* Dynamic Island pill */}
                <div className="w-24 h-5 rounded-full bg-black flex items-center justify-end px-2 gap-1.5 border border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500/40 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A1829]" />
                </div>

                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Mobile Screen Content */}
              <div className="flex-1 overflow-hidden relative flex flex-col">
                {children}
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="h-5 flex items-center justify-center shrink-0 z-30 select-none">
                <div className={`w-32 h-1 rounded-full ${isDark ? 'bg-white/30' : 'bg-black/30'}`} />
              </div>
            </div>
          </div>
        ) : (
          /* Full Viewport Mode */
          <div className={`w-full max-w-md h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border ${
            isDark ? 'bg-[#080810] border-[#25223A]' : 'bg-[#F5F4FA] border-[#D8D4E8]'
          }`}>
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {children}
            </div>
          </div>
        )}
      </main>

      {/* React Native Architecture & Expo Guide Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-[#121221] border-[#29263D] text-[#F8F6FF]' : 'bg-white border-[#D8D4E8] text-zinc-900'
          }`}>
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
                  <li>Click <strong>Download Expo ZIP</strong> above or open terminal in the project directory:
                    <div className="my-2 p-3 bg-black/80 rounded-xl font-mono text-emerald-400 text-xs select-all border border-purple-500/20">
                      cd expo-wchat<br />
                      npm install<br />
                      npx expo start
                    </div>
                  </li>
                  <li>Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-purple-300">a</kbd> in your terminal to open in Android Emulator, or scan the displayed terminal QR code directly using the <strong>Expo Go</strong> app on your Android device!</li>
                  <li>The app opens immediately with native performance, dark neon aesthetics, multi-language RTL, and instant hot-reloading!</li>
                </ol>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#1B1A2B] border-[#29263D]' : 'bg-[#F5F4FA] border-[#D8D4E8]'}`}>
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

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#1B1A2B] border-[#29263D]' : 'bg-[#F5F4FA] border-[#D8D4E8]'}`}>
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
