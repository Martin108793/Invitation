import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { UI, UiKey } from './ui-strings';

export type Lang = 'en' | 'km';

const STORAGE_KEY = 'st-wedding-lang';
const KM_DIGITS = '០១២៣៤៥៦៧៨៩';

/**
 * Current language (English / Khmer).
 *
 * Order of preference: `?lang=km` in the link → the guest's last choice
 * (kept in localStorage) → English.  Switching also updates `<html lang>`
 * so screen readers and browsers pick the right voice and font.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.initial());
  readonly isKm = computed(() => this.lang() === 'km');

  constructor() {
    effect(() => {
      const lang = this.lang();
      this.document.documentElement.lang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* private mode — the choice simply isn't remembered */
      }
    });
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }

  /** Translate a UI label. `{name}` placeholders are filled from `vars`. */
  t(key: UiKey, vars?: Record<string, string | number>): string {
    let text: string = UI[key][this.lang()];
    if (vars) {
      for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
    }
    return text;
  }

  /** Digits in the current script: 16 → ១៦ in Khmer. */
  num(value: number | string): string {
    const s = String(value);
    return this.lang() === 'km' ? s.replace(/\d/g, (d) => KM_DIGITS[+d]) : s;
  }

  private initial(): Lang {
    try {
      const fromUrl = new URLSearchParams(this.document.location?.search ?? '').get('lang');
      if (fromUrl === 'km' || fromUrl === 'en') return fromUrl;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'km' || saved === 'en') return saved;
    } catch {
      /* ignore */
    }
    return 'en';
  }
}
