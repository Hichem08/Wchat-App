/**
 * @file callService.ts
 * Future Backend Integration: WebRTC peer-to-peer audio/video calling
 * Ready for:
 * - Signaling via Socket.IO (offer, answer, ice-candidate)
 * - RTCPeerConnection / react-native-webrtc
 * - STUN/TURN servers
 */

import { User } from '../types';

export const callService = {
  initiateCall(recipient: User, callType: 'voice' | 'video') {
    console.log('[callService] WebRTC offer initiated to:', recipient.name, callType);
  },

  acceptCall(callId: string) {
    console.log('[callService] WebRTC call accepted:', callId);
  },

  endCall(callId: string) {
    console.log('[callService] WebRTC call terminated:', callId);
  },

  toggleAudio(muted: boolean) {
    console.log('[callService] WebRTC local audio track enabled:', !muted);
  },

  toggleVideo(enabled: boolean) {
    console.log('[callService] WebRTC local video track enabled:', enabled);
  },
};
