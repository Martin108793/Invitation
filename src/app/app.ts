import { ChangeDetectionStrategy, Component, DOCUMENT, DestroyRef, inject, signal } from '@angular/core';
import { WEDDING_CONFIG } from './core/services/wedding-config';
import { Envelope } from './features/envelope/envelope';
import { Invitation } from './features/invitation/invitation';
import { Couple } from './features/couple/couple';
import { WeddingDetails } from './features/wedding-details/wedding-details';
import { WeddingSchedule } from './features/wedding-schedule/wedding-schedule';
import { Gallery } from './features/gallery/gallery';
import { Venue } from './features/venue/venue';
import { Rsvp } from './features/rsvp/rsvp';
import { MusicPlayer } from './shared/components/music-player/music-player';
import { SvgSprite } from './shared/components/svg-sprite/svg-sprite';
import { KbachSprite } from './shared/components/kbach-sprite/kbach-sprite';
import { LangSwitch } from './shared/components/lang-switch/lang-switch';
import { LanguageService } from './core/i18n/language.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SvgSprite,
    KbachSprite,
    Envelope,
    Invitation,
    Couple,
    WeddingDetails,
    WeddingSchedule,
    Gallery,
    Venue,
    Rsvp,
    MusicPlayer,
    LangSwitch,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
  private readonly document = inject(DOCUMENT);

  /** The cover is removed from the DOM once its exit animation finishes. */
  protected readonly coverVisible = signal(true);
  /** True as soon as the guest opens the invitation. */
  protected readonly opened = signal(false);

  constructor() {
    this.lockScroll(true);
    inject(DestroyRef).onDestroy(() => this.lockScroll(false));
  }

  protected onOpened(): void {
    this.opened.set(true);
    this.lockScroll(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  protected onCoverDismissed(): void {
    this.coverVisible.set(false);
    // Move focus into the revealed invitation so keyboard and screen-reader
    // users continue from the top of the page instead of the removed cover.
    const heading = this.document.getElementById('invitation-title');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  private lockScroll(lock: boolean): void {
    this.document.body.classList.toggle('is-locked', lock);
  }
}
