import { User } from '../types';
import { webrtcService } from './webrtcService';

export const callService = {
  initiateCall(
    recipient: User,
    callType: 'voice' | 'video',
    chatId: string,
    onRemoteStream?: (stream: MediaStream) => void,
    onCallEnded?: () => void
  ) {
    console.log(`[callService] Initiating ${callType} call to ${recipient.name} (${recipient.id})`);
    webrtcService.startCall(
      recipient.id,
      chatId,
      callType,
      onRemoteStream || (() => {}),
      onCallEnded || (() => {})
    );
  },

  acceptCall(callerId: string, chatId: string, callType: 'voice' | 'video', remoteSdp?: any) {
    console.log(`[callService] Accepting call from ${callerId}`);
    webrtcService.answerCall(callerId, chatId, callType, remoteSdp);
  },

  endCall(targetUserId?: string, chatId?: string) {
    console.log('[callService] Terminating active call');
    webrtcService.endCall(targetUserId, chatId);
  },

  toggleMute(muted: boolean) {
    webrtcService.toggleMute(muted);
  },

  toggleVideo(enabled: boolean) {
    webrtcService.toggleVideo(enabled);
  },
};
