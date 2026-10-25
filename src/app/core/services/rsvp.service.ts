import { Injectable, inject } from '@angular/core';
import { WEDDING_CONFIG } from './wedding-config';
import { LanguageService } from '../i18n/language.service';

export type Attendance = 'accept' | 'decline';

export interface RsvpResponse {
  name: string;
  attendees: number;
  attendance: Attendance;
  message: string;
}

export type StorageResult = 'remote' | 'device' | 'none';

export interface RsvpOutcome {
  ok: boolean;
  stored: StorageResult;
  /** Short, guest-facing explanation. Never claims more than actually happened. */
  message: string;
}

const STORAGE_KEY = 'st-rsvp-responses';

/**
 * RSVP submission.
 *
 * The UI talks to this service only; the transport is isolated here so a real
 * backend (Formspree, Google Apps Script, Supabase, a Cloudflare Worker …) can
 * be dropped in by setting `rsvp.endpoint` in the wedding config.
 *
 * If no endpoint is configured the response is **not** sent anywhere — it is
 * kept on this device and the guest is offered a link to send it to the couple
 * directly. The interface never pretends the couple received it.
 */
@Injectable({ providedIn: 'root' })
export class RsvpService {
  private readonly config = inject(WEDDING_CONFIG);
  private readonly lg = inject(LanguageService);

  get isOnlineStorageConfigured(): boolean {
    return this.config.rsvp.endpoint.trim().length > 0;
  }

  async submit(response: RsvpResponse): Promise<RsvpOutcome> {
    if (!this.isOnlineStorageConfigured) {
      this.saveOnDevice(response);
      return {
        ok: true,
        stored: 'device',
        message: this.lg.t('svc.device'),
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(this.config.rsvp.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...response, submittedAt: new Date().toISOString() }),
        signal: controller.signal,
      });

      if (!res.ok) {
        return {
          ok: false,
          stored: 'none',
          message: this.lg.t('svc.rejected'),
        };
      }

      return { ok: true, stored: 'remote', message: this.lg.t('svc.sent') };
    } catch {
      return {
        ok: false,
        stored: 'none',
        message: this.lg.t('svc.network'),
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  /** A pre-filled message the guest can send straight to the couple. */
  shareLink(response: RsvpResponse): string {
    const { channel, handle } = this.config.rsvp.contact;
    const text = this.composeMessage(response);

    switch (channel) {
      case 'whatsapp':
        return `https://wa.me/${handle.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
      case 'email':
        return `mailto:${handle}?subject=${encodeURIComponent(this.lg.t('svc.subject'))}&body=${encodeURIComponent(text)}`;
      default:
        return `${handle}${handle.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
    }
  }

  private composeMessage(r: RsvpResponse): string {
    const status = r.attendance === 'accept' ? this.lg.t('svc.accepts') : this.lg.t('svc.declines');
    const lines = [
      this.lg.t('svc.subject'),
      `${r.name}: ${status}`,
      r.attendance === 'accept' ? this.lg.t('svc.guests', { n: r.attendees }) : '',
      r.message ? this.lg.t('svc.message', { text: r.message }) : '',
    ].filter(Boolean);
    return lines.join('\n');
  }

  private saveOnDevice(response: RsvpResponse): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push({ ...response, submittedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Private mode / storage disabled — nothing to do, the guest still sees
      // the confirmation screen with the direct-contact button.
    }
  }
}
