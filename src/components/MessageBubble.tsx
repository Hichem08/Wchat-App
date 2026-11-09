import React, { useState, useEffect } from 'react';
import { Play, Pause, Check, CheckCheck, Clock, FileText, MapPin } from 'lucide-react';
import { Message } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const isOutgoing = message.isOutgoing;

  // Format time
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Voice playback simulation
  useEffect(() => {
    let interval: number;
    if (isPlayingVoice) {
      interval = window.setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 1) {
            setIsPlayingVoice(false);
            return 0;
          }
          return prev + 0.08;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlayingVoice]);

  return (
    <div
      className={`flex flex-col my-1.5 ${
        isOutgoing ? (isRTL ? 'items-start' : 'items-end') : (isRTL ? 'items-end' : 'items-start')
      }`}
    >
      <div
        className={`relative max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm transition-all ${
          isOutgoing
            ? 'bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white rounded-br-sm shadow-[0_4px_16px_rgba(139,61,255,0.3)]'
            : isDark
            ? 'bg-[#1B1A2B] text-[#F8F6FF] border border-[#29263D]/60 rounded-bl-sm'
            : 'bg-[#ECEAF5] text-[#12111D] border border-[#D8D4E8]/60 rounded-bl-sm'
        }`}
      >
        {/* Text Message */}
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Image Message */}
        {message.type === 'image' && (
          <div className="space-y-1.5">
            <div className="overflow-hidden rounded-xl border border-white/10 max-h-60">
              <img
                src={message.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                alt="Shared media"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {message.content && message.content !== 'Here is the prototype preview' && (
              <p className="text-sm mt-1">{message.content}</p>
            )}
          </div>
        )}

        {/* Voice Message Bubble */}
        {message.type === 'voice' && (
          <div className="flex items-center gap-3 py-1 min-w-[210px]">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlayingVoice(p => !p)}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-md ${
                isOutgoing
                  ? 'bg-white text-[#8B3DFF] hover:bg-white/90'
                  : 'bg-[#8B3DFF] text-white hover:bg-[#9B54FF]'
              }`}
            >
              {isPlayingVoice ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Audio Waveform visualization */}
            <div className="flex-1 flex items-center gap-1 h-7">
              {(message.voiceWaveform || [30, 45, 80, 60, 95, 40, 70, 85, 50, 65, 90, 40, 60, 75]).map(
                (barHeight, idx) => {
                  const isActive = idx / 14 <= playbackProgress;
                  return (
                    <div
                      key={idx}
                      style={{ height: `${Math.max(20, Math.min(100, barHeight))}%` }}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isOutgoing
                          ? isActive
                            ? 'bg-white'
                            : 'bg-white/40'
                          : isActive
                          ? 'bg-[#8B3DFF]'
                          : isDark
                          ? 'bg-zinc-600'
                          : 'bg-zinc-400'
                      }`}
                    />
                  );
                }
              )}
            </div>

            {/* Duration */}
            <span
              className={`text-xs font-mono font-medium shrink-0 ${
                isOutgoing ? 'text-white/90' : isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
              }`}
            >
              {message.voiceDuration || '0:12'}
            </span>
          </div>
        )}

        {/* File / Document */}
        {message.type === 'file' && (
          <div className="flex items-center gap-3 p-1 min-w-[190px]">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isOutgoing ? 'bg-white/20 text-white' : 'bg-[#8B3DFF]/20 text-[#8B3DFF]'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">
                {message.fileName || message.content}
              </p>
              <p
                className={`text-[10px] ${
                  isOutgoing ? 'text-white/70' : isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                PDF Document • 2.4 MB
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {message.type === 'location' && (
          <div className="flex items-center gap-2.5 p-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">{message.content}</p>
              <p className="text-[10px] opacity-75">Live Location Shared</p>
            </div>
          </div>
        )}

        {/* Footer: Time & Read status + 24h expiration indicator */}
        <div
          className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
            isOutgoing ? 'text-white/80' : isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
          }`}
        >
          {/* Subtle 24h clock icon */}
          <span title="Disappears in 24 hours" className="opacity-60 flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
          </span>
          
          <span>{formatTime(message.createdAt)}</span>

          {isOutgoing && (
            <span className="ml-0.5">
              {message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-white" />
              ) : (
                <Check className="w-3.5 h-3.5 opacity-80" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
