import { InjectionToken, inject } from '@angular/core';
import { WeddingConfig } from '../models/wedding.model';
import { WEDDING } from '../data/wedding.config';
import { WEDDING_KM } from '../data/wedding.km';
import { LanguageService } from '../i18n/language.service';

/**
 * Overlays the Khmer text on the English config while the guest is reading in
 * Khmer. The result is a lightweight Proxy: every read of a string goes through
 * the language signal, so templates update the moment the language changes
 * without any component knowing about translation.
 */
function localise<T>(en: T, km: unknown, isKm: () => boolean): T {
  if (en === null || typeof en !== 'object') return en;
  return new Proxy(en as object, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      const alt = km && typeof km === 'object' ? (km as Record<PropertyKey, unknown>)[prop] : undefined;
      if (typeof value === 'string') return isKm() && typeof alt === 'string' ? alt : value;
      if (value && typeof value === 'object') return localise(value, alt, isKm);
      return value;
    },
  }) as T;
}

/**
 * Injection token for the wedding data. Override it in `app.config.ts` if the
 * content ever needs to come from an API instead of a local file.
 */
export const WEDDING_CONFIG = new InjectionToken<WeddingConfig>('WEDDING_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const lang = inject(LanguageService);
    return localise(WEDDING, WEDDING_KM, () => lang.isKm());
  },
});
