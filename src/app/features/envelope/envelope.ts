import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  output,
  signal,
} from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { InvitationFrame } from '../../shared/components/invitation-frame/invitation-frame';

/**
 * Full-screen invitation cover.
 *
 * The ornamental card is the reference artwork, layered by `InvitationFrame`
 * (painted card + separate S & T emblem + drifting petals) with live HTML text
 * in its empty centre. Pressing “Open Invitation” plays a short exit animation
 * and hands control to the page underneath.
 */
@Component({
  selector: 'app-envelope',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InvitationFrame],
  host: {
    '[class.is-opening]': 'opening()',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'cover-names',
  },
  templateUrl: './envelope.html',
  styleUrl: './envelope.scss',
})
export class Envelope implements OnDestroy {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
  protected readonly opening = signal(false);

  /** Fired the moment the guest opens the invitation (page unlocks). */
  readonly opened = output<void>();
  /** Fired once the cover animation has finished and it can be removed. */
  readonly dismissed = output<void>();

  private timer?: ReturnType<typeof setTimeout>;

  protected openInvitation(): void {
    if (this.opening()) return;
    this.opening.set(true);

    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.opened.emit();
    this.timer = setTimeout(() => this.dismissed.emit(), reduce ? 260 : 1080);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }
}
