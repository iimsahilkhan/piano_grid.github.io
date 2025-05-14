// Web Audio API context setup and management
class AudioEngine {
  private context: AudioContext | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gains: Map<string, GainNode> = new Map();

  constructor() {
    this.initContext();
  }

  private initContext() {
    try {
      this.context = new AudioContext();
    } catch (e) {
      console.error("Web Audio API not supported:", e);
    }
  }

  // Map note names to frequencies (Hz)
  private noteToFrequency(note: string): number {
    const noteMap: { [key: string]: number } = {
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
      'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
      'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25
    };
    return noteMap[note] || 440; // Default to A4 if note not found
  }

  public playNote(note: string) {
    if (!this.context) {
      this.initContext();
      if (!this.context) return;
    }

    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    // Stop any existing oscillator for this note
    this.stopNote(note);

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(this.noteToFrequency(note), this.context.currentTime);

    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, this.context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start();
    oscillator.stop(this.context.currentTime + 1.5);

    this.oscillators.set(note, oscillator);
    this.gains.set(note, gainNode);

    oscillator.onended = () => {
      this.oscillators.delete(note);
      this.gains.delete(note);
    };
  }

  public stopNote(note: string) {
    const oscillator = this.oscillators.get(note);
    const gain = this.gains.get(note);

    if (oscillator && gain && this.context) {
      gain.gain.cancelScheduledValues(this.context.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.01);
      
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gain.disconnect();
      }, 10);

      this.oscillators.delete(note);
      this.gains.delete(note);
    }
  }
}

export const audioEngine = new AudioEngine();
