export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private buffer: AudioBuffer | null = null;
  private startOffset = 0;
  private startTime = 0;
  private _isPlaying = false;

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get currentTime(): number {
    if (!this.audioContext) return 0;
    if (!this._isPlaying) return this.startOffset;
    return this.startOffset + this.audioContext.currentTime - this.startTime;
  }

  get duration(): number {
    return this.buffer?.duration ?? 0;
  }

  async load(url: string): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioContext = new AudioContext();
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  play(offset = 0): void {
    if (!this.audioContext || !this.buffer) return;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    if (this.gainNode) {
      this.source.connect(this.gainNode);
    }
    this.source.start(0, offset);
    this.startOffset = offset;
    this.startTime = this.audioContext.currentTime;
    this._isPlaying = true;
  }

  pause(): void {
    if (!this.audioContext || !this.source || !this._isPlaying) return;
    this.startOffset += this.audioContext.currentTime - this.startTime;
    this.source.stop();
    this.source.disconnect();
    this._isPlaying = false;
  }

  stop(): void {
    if (!this.source) return;
    try {
      this.source.stop();
      this.source.disconnect();
    } catch {
      // ignore
    }
    this.source = null;
    this.startOffset = 0;
    this._isPlaying = false;
  }

  seek(time: number): void {
    const wasPlaying = this._isPlaying;
    if (wasPlaying) this.stop();
    this.startOffset = Math.max(0, Math.min(time, this.duration));
    if (wasPlaying) this.play(this.startOffset);
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.buffer = null;
    this.gainNode = null;
    this.source = null;
  }
}
