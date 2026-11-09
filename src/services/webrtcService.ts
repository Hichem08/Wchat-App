import { socketService } from './socketService';

export interface CallPeerConfig {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  onRemoteStream: (stream: MediaStream) => void;
  onCallEnded: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onCallEndedCallback: (() => void) | null = null;

  async startCall(
    targetUserId: string,
    chatId: string,
    callType: 'voice' | 'video',
    onRemoteStream: (stream: MediaStream) => void,
    onCallEnded: () => void
  ) {
    this.onRemoteStreamCallback = onRemoteStream;
    this.onCallEndedCallback = onCallEnded;

    try {
      // 1. Get user media (Audio + Video if video call)
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === 'video',
        });
      }

      // 2. Initialize RTCPeerConnection if available
      if (typeof RTCPeerConnection !== 'undefined') {
        this.peerConnection = new RTCPeerConnection(ICE_SERVERS);

        if (this.localStream) {
          this.localStream.getTracks().forEach(track => {
            this.peerConnection?.addTrack(track, this.localStream!);
          });
        }

        this.peerConnection.ontrack = (event) => {
          this.remoteStream = event.streams[0];
          this.onRemoteStreamCallback?.(this.remoteStream);
        };

        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketService.emitIceCandidate({
              targetUserId,
              chatId,
              candidate: event.candidate,
            });
          }
        };

        // 3. Create Offer
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        // 4. Send Offer via Socket.IO signaling
        socketService.emitCallOffer({
          targetUserId,
          chatId,
          type: callType,
          sdp: offer,
        });
      } else {
        // Expo Go fallback signaling
        socketService.emitCallOffer({
          targetUserId,
          chatId,
          type: callType,
        });
      }
    } catch (err: any) {
      console.warn('[WebRTCService Notice]:', err.message);
    }
  }

  async answerCall(
    callerId: string,
    chatId: string,
    callType: 'voice' | 'video',
    remoteSdp?: any
  ) {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === 'video',
        });
      }

      if (typeof RTCPeerConnection !== 'undefined' && remoteSdp) {
        this.peerConnection = new RTCPeerConnection(ICE_SERVERS);

        if (this.localStream) {
          this.localStream.getTracks().forEach(track => {
            this.peerConnection?.addTrack(track, this.localStream!);
          });
        }

        this.peerConnection.ontrack = (event) => {
          this.remoteStream = event.streams[0];
          this.onRemoteStreamCallback?.(this.remoteStream);
        };

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(remoteSdp));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        socketService.emitCallAnswer({
          callerId,
          chatId,
          type: callType,
          sdp: answer,
        });
      } else {
        socketService.emitCallAnswer({
          callerId,
          chatId,
          type: callType,
        });
      }
    } catch (err: any) {
      console.warn('[WebRTCService Answer Notice]:', err.message);
    }
  }

  endCall(targetUserId?: string, chatId?: string) {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (targetUserId) {
      socketService.emitCallEnd({ targetUserId, chatId });
    }

    this.onCallEndedCallback?.();
  }

  toggleMute(isMuted: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
      }
    }
  }

  toggleVideo(isVideoEnabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoEnabled;
      }
    }
  }
}

export const webrtcService = new WebRTCService();
