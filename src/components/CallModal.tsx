import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Video, VideoOff, PhoneOff, Minimize2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Avatar } from './Avatar';
import { useLanguage } from '../context/LanguageContext';

export const CallModal: React.FC = () => {
  const {
    currentCall,
    endCall,
    isMuted,
    toggleMute,
    isSpeaker,
    toggleSpeaker,
    isVideoEnabled,
    toggleVideo,
    callDuration,
  } = useChat();
  const { t } = useLanguage();

  if (!currentCall) return null;

  // Format seconds to mm:ss
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080810] text-white overflow-hidden animate-fade-in">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-at-c from-purple-900/30 via-[#080810]/90 to-[#080810] pointer-events-none" />

      {/* Top Header controls */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          type="button"
          onClick={endCall}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/90"
        >
          <Minimize2 className="w-5 h-5" />
        </button>

        <span className="text-xs uppercase tracking-widest font-semibold text-purple-400/90">
          {isVideoEnabled ? t('videoCall') : t('voiceCall')}
        </span>

        <button
          type="button"
          onClick={toggleVideo}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/90"
        >
          {isVideoEnabled ? <Video className="w-5 h-5 text-purple-400" /> : <VideoOff className="w-5 h-5 text-zinc-400" />}
        </button>
      </div>

      {/* Main Avatar / Video Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {isVideoEnabled ? (
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-[0_0_40px_rgba(139,61,255,0.3)] bg-zinc-900">
            {/* Simulated remote video stream */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Remote Video"
              className="w-full h-full object-cover"
            />
            
            {/* Pip self preview */}
            <div className="absolute bottom-4 right-4 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/50 shadow-lg bg-black">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Self preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            {/* Pulsing Concentric Glowing Rings */}
            <div className="absolute w-64 h-64 rounded-full border border-purple-500/20 animate-ping opacity-30" />
            <div className="absolute w-52 h-52 rounded-full border border-purple-500/30 animate-pulse opacity-50" />
            <div className="absolute w-40 h-40 rounded-full bg-purple-600/20 blur-xl" />

            <Avatar
              src={currentCall.user.avatar}
              name={currentCall.user.name}
              size="2xl"
              hasGlow
              className="relative shadow-[0_0_35px_rgba(139,61,255,0.7)] ring-4 ring-purple-500/50"
            />
          </div>
        )}

        {/* User Name & Duration */}
        <h2 className="text-2xl font-bold mt-8 tracking-tight text-white drop-shadow-md">
          {currentCall.user.name}
        </h2>
        <p className="text-sm font-mono font-medium text-purple-300 mt-2 bg-purple-950/60 px-4 py-1 rounded-full border border-purple-500/30">
          {formatDuration(callDuration)}
        </p>
      </div>

      {/* Bottom Call Controls exactly matching reference image */}
      <div className="relative z-10 px-8 pb-12 pt-6">
        <div className="flex items-center justify-around max-w-sm mx-auto bg-[#121221]/80 backdrop-blur-md p-4 rounded-3xl border border-[#29263D]">
          {/* Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Speaker Button */}
          <button
            type="button"
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              isSpeaker
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,61,255,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Video Toggle Button */}
          <button
            type="button"
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              isVideoEnabled
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,61,255,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* End Call Button (Red Circle with hang up icon) */}
          <button
            type="button"
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
