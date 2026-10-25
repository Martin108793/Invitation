import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SakuraPetals } from '../sakura-petals/sakura-petals';

/**
 * The ornamental invitation card from the reference design.
 *
 * Layers, back to front:
 *   1. `frame__art`   – the painted card (gold arch, blossoms, side panels, Angkor
 *                       Wat, apsaras, lotus, silk) with the emblem lifted out.
 *   2. `frame__emblem`– the S & T emblem as its own transparent layer so it can
 *                       animate independently (fade + scale, then a gold sheen).
 *   3. petals         – a few blush petals drifting down *inside* the card.
 *   4. `frame__panel` – the empty ivory centre. Projected content goes here as
 *                       real, selectable, translatable HTML text.
 *
 * Everything is sized with container units (`cqw`), so the artwork and the text
 * scale together from a 320 px phone to a desktop without media queries.
 */
@Component({
  selector: 'app-invitation-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SakuraPetals],
  host: { '[class.has-intro]': 'intro()' },
  template: `
    <div class="frame">
      <img
        class="frame__art"
        src="images/frame/frame-1024.webp"
        srcset="images/frame/frame-640.webp 640w, images/frame/frame-1024.webp 1024w"
        sizes="(max-width: 640px) 100vw, 640px"
        width="1024"
        height="1536"
        alt=""
        decoding="async"
        fetchpriority="high"
      />

      <div class="frame__emblem">
        <img
          src="images/frame/emblem-1024.webp"
          srcset="images/frame/emblem-640.webp 400w, images/frame/emblem-1024.webp 1024w"
          sizes="(max-width: 640px) 40vw, 260px"
          width="387"
          height="390"
          [alt]="emblemAlt()"
          decoding="async"
        />
        <span
          class="frame__sheen"
          aria-hidden="true"
          style="-webkit-mask-image: url(images/frame/emblem-1024.webp); mask-image: url(images/frame/emblem-1024.webp)"
        ></span>
      </div>

      <app-sakura-petals class="frame__petals" />

      <div class="frame__panel">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './invitation-frame.scss',
})
export class InvitationFrame {
  /** Plays the opening reveal. Turn off where the frame is already on screen. */
  readonly intro = input(true);
  readonly emblemAlt = input('S and T wedding monogram');
}
