import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';

/** English / ខ្មែរ toggle, fixed to the top-right corner on every screen. */
@Component({
  selector: 'app-lang-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lang" role="group" [attr.aria-label]="lg.t('lang.label')">
      <button
        type="button"
        lang="en"
        [class.is-active]="!lg.isKm()"
        [attr.aria-pressed]="!lg.isKm()"
        (click)="lg.set('en')"
      >
        EN
      </button>
      <button
        type="button"
        lang="km"
        class="khmer"
        [class.is-active]="lg.isKm()"
        [attr.aria-pressed]="lg.isKm()"
        (click)="lg.set('km')"
      >
        ខ្មែរ
      </button>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      z-index: 400;
      top: max(0.7rem, env(safe-area-inset-top));
      right: max(0.7rem, env(safe-area-inset-right));
    }

    .lang {
      display: flex;
      padding: 3px;
      gap: 2px;
      background: rgba(255, 248, 240, 0.94);
      border: 1px solid #b88643;
      border-radius: 3px;
      box-shadow:
        0 8px 22px -12px rgba(91, 59, 42, 0.5),
        inset 0 0 0 2px rgba(255, 253, 249, 0.9);
      backdrop-filter: blur(6px);
    }

    button {
      min-width: 2.9rem;
      min-height: 2.4rem;
      padding: 0 0.7rem;
      border: 0;
      border-radius: 2px;
      background: transparent;
      color: #8c5d28;
      font: inherit;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition:
        background-color 0.25s ease,
        color 0.25s ease;
    }

    button.khmer {
      letter-spacing: 0;
      font-size: 0.9rem;
    }

    button:hover {
      background: rgba(217, 173, 98, 0.18);
    }

    button.is-active {
      background: linear-gradient(135deg, #d9ad62, #b88643);
      color: #fffdf9;
    }

    button:focus-visible {
      outline: 2px solid #5b3b2a;
      outline-offset: 1px;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `,
})
export class LangSwitch {
  protected readonly lg = inject(LanguageService);
}
