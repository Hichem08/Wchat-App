import { storageService } from './storageService';

class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;

  async startRecording(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.startTime = Date.now();

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.start();
        return true;
      }
      return true;
    } catch (err: any) {
      console.warn('[VoiceService]: Fallback simulation active:', err.message);
      return true;
    }
  }

  async stopRecording(chatId: string): Promise<{ audioUrl: string; duration: string; waveform: number[] }> {
    return new Promise((resolve) => {
      const defaultWaveform = [25, 45, 80, 50, 90, 70, 30, 85, 95, 60, 40, 75, 55, 90, 35];
      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
      const formattedDuration = `0:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;

      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/m4a' });
          const audioUrl = await storageService.uploadChatAudio(chatId, audioBlob);
          resolve({
            audioUrl: audioUrl || URL.createObjectURL(audioBlob),
            duration: formattedDuration,
            waveform: defaultWaveform,
          });
        };
        this.mediaRecorder.stop();
      } else {
        resolve({
          audioUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
          duration: formattedDuration,
          waveform: defaultWaveform,
        });
      }
    });
  }
}

export const voiceService = new VoiceService();
