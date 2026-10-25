import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { WEDDING_CONFIG } from './wedding-config';

export type MusicStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'unavailable';

/**
 * Thin, lazy wrapper around a single <audio> element.
 *
 * • Nothing is ever played automatically — playback starts only from a click.
 * • The file is only requested after the first interaction (`preload="none"`).
 * • A missing or unsupported file is handled gracefully (`unavailable`).
 */
@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly config = inject(WEDDING_CONFIG).music;
  private readonly destroyRef = inject(DestroyRef);

  private audio?: HTMLAudioElement;
  private readonly state = signal<MusicStatus>('idle');

  readonly status = this.state.asReadonly();
  readonly isPlaying = computed(() => this.state() === 'playing');
  readonly isLoading = computed(() => this.state() === 'loading');
  readonly isUnavailable = computed(() => this.state() === 'unavailable');
  get title(): string {
    return this.config.title;
  }
  get artist(): string {
    return this.config.artist;
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (!this.audio) return;
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = undefined;
    });
  }

  toggle(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      void this.play();
    }
  }

  async play(): Promise<void> {
    const audio = this.ensureAudio();
    if (!audio) return;

    this.state.set('loading');
    try {
      await audio.play();
      this.state.set('playing');
    } catch {
      // Autoplay policy or a missing file — never throw at the guest.
      this.state.set(this.audio ? 'paused' : 'unavailable');
    }
  }

  pause(): void {
    this.audio?.pause();
    if (this.audio && this.state() !== 'unavailable') this.state.set('paused');
  }

  private ensureAudio(): HTMLAudioElement | undefined {
    if (this.audio) return this.audio;
    if (!this.config.src) {
      this.state.set('unavailable');
      return undefined;
    }

    const audio = new Audio();
    audio.preload = 'none';
    audio.loop = true;
    audio.volume = 0.55;
    audio.src = this.config.src;

    audio.addEventListener('error', () => {
      this.state.set('unavailable');
      console.info(
        `[music] No playable file at "${this.config.src}". Add a licensed instrumental to /public/audio to enable the music player.`,
      );
    });
    audio.addEventListener('playing', () => this.state.set('playing'));
    audio.addEventListener('pause', () => {
      if (this.state() !== 'unavailable') this.state.set('paused');
    });

    this.audio = audio;
    return audio;
  }
}
