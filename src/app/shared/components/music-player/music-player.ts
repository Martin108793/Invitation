import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { MusicService } from '../../../core/services/music.service';

/**
 * Optional background music. Never autoplays — playback starts only from this
 * control, and a missing audio file simply disables the button.
 */
@Component({
  selector: 'app-music-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="player">
      <button
        type="button"
        class="player__button"
        [class.is-playing]="music.isPlaying()"
        [disabled]="music.isUnavailable()"
        [attr.aria-pressed]="music.isPlaying()"
        [attr.aria-label]="actionLabel()"
        [attr.title]="music.isUnavailable() ? lg.t('music.none') : actionLabel()"
        (click)="music.toggle()"
      >
        <span class="player__ring" aria-hidden="true"></span>

        @if (music.isLoading()) {
          <span class="player__spinner" aria-hidden="true"></span>
        } @else if (music.isPlaying()) {
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <rect x="7" y="5" width="3.4" height="14" rx="1" />
            <rect x="13.6" y="5" width="3.4" height="14" rx="1" />
          </svg>
        } @else if (music.isUnavailable()) {
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
            <path d="M9 18V6l10-2v12" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="16" r="2.5" />
            <path d="M3 3l18 18" stroke-linecap="round" />
          </svg>
        } @else {
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
            <path d="M9 18V6l10-2v12" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="16" r="2.5" />
          </svg>
        }
      </button>

      <span class="player__text">
        <span class="player__title">{{ music.title }}</span>
        <span class="player__state">{{ statusLabel() }}</span>
      </span>

      <span class="sr-only" aria-live="polite">{{ statusLabel() }}</span>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      right: max(0.9rem, env(safe-area-inset-right));
      bottom: max(0.9rem, env(safe-area-inset-bottom));
      z-index: 90;
    }

    .player {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.4rem 0.9rem 0.4rem 0.4rem;
      border: 1px solid rgba(176, 141, 87, 0.45);
      border-radius: 999px;
      background: rgba(255, 250, 243, 0.9);
      box-shadow: 0 14px 34px -22px rgba(112, 47, 69, 0.7);
      backdrop-filter: blur(8px);
    }

    .player__button {
      position: relative;
      display: grid;
      place-items: center;
      width: 2.6rem;
      height: 2.6rem;
      border: 1px solid rgba(176, 141, 87, 0.55);
      border-radius: 50%;
      background: var(--gold-fill);
      color: #4a3416;
      cursor: pointer;
      flex: 0 0 auto;
      transition: transform 0.35s var(--ease-soft), box-shadow 0.35s var(--ease-soft);
    }

    .player__button:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 8px 18px -12px rgba(176, 141, 87, 0.9);
    }

    .player__button:focus-visible {
      outline: 2px solid var(--burgundy);
      outline-offset: 3px;
    }

    .player__button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background: rgba(255, 245, 232, 0.9);
    }

    .player__ring {
      position: absolute;
      inset: -5px;
      border: 1px solid rgba(212, 175, 55, 0.6);
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .player__button.is-playing .player__ring {
      opacity: 1;
      animation: ring-pulse 2.6s ease-in-out infinite;
    }

    @keyframes ring-pulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 0.55;
      }
      50% {
        transform: scale(1.12);
        opacity: 0.15;
      }
    }

    .player__spinner {
      width: 1rem;
      height: 1rem;
      border: 1.5px solid rgba(74, 52, 22, 0.35);
      border-top-color: #4a3416;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .player__text {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      max-width: 11rem;
    }

    .player__title {
      font-size: 0.68rem;
      letter-spacing: 0.06em;
      color: var(--burgundy);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .player__state {
      font-size: 0.56rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold-deep);
    }

    @media (max-width: 520px) {
      .player {
        padding: 0.35rem;
      }

      .player__text {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .player__button.is-playing .player__ring {
        animation: none;
      }
    }
  `,
})
export class MusicPlayer {
  protected readonly music = inject(MusicService);
  protected readonly lg = inject(LanguageService);

  protected readonly actionLabel = computed(() => {
    if (this.music.isUnavailable()) return this.lg.t('music.unavailable');
    if (this.music.isPlaying()) return this.lg.t('music.pause');
    if (this.music.isLoading()) return this.lg.t('music.loadingAria');
    return this.lg.t('music.play');
  });

  protected readonly statusLabel = computed(() => {
    if (this.music.isUnavailable()) return this.lg.t('music.unavailable');
    if (this.music.isPlaying()) return this.lg.t('music.nowPlaying');
    if (this.music.isLoading()) return this.lg.t('music.loading');
    return this.lg.t('music.tap');
  });
}
