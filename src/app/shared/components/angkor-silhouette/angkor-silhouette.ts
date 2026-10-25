import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { angkorGeometry } from '../../../core/utils/angkor-geometry';

/**
 * Elegant gold-and-ivory line drawing of Angkor Wat's five lotus-bud towers.
 * Rendered from two path strings so it stays razor sharp at any size.
 */
@Component({
  selector: 'app-angkor-silhouette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg [attr.viewBox]="compact() ? '262 10 388 348' : '0 0 900 380'" focusable="false" preserveAspectRatio="xMidYMax meet">
      <!-- Ground / terrace haze -->
      <ellipse cx="452" cy="330" rx="330" ry="20" fill="url(#grad-pinkwash)" opacity="0.85" />

      <!-- Temple mass: pale ivory shading with a champagne-gold edge -->
      <path
        [attr.d]="geo().silhouette"
        fill="url(#grad-ivory-gold)"
        fill-opacity="0.92"
        stroke="url(#grad-gold-line)"
        stroke-width="1.1"
        stroke-linejoin="round"
      />

      <!-- Architectural detail -->
      <path
        [attr.d]="geo().detail"
        fill="none"
        stroke="#B08D57"
        stroke-width="0.85"
        stroke-opacity="0.62"
        stroke-linecap="round"
      />

      <!-- Lotus pond -->
      @if (pond()) {
        <g stroke="#B08D57" stroke-opacity="0.35" fill="none" stroke-linecap="round">
          <path d="M128 346h648" />
          <path d="M176 358h552" stroke-opacity="0.22" />
          <path d="M244 352h60M360 352h34M520 352h74M640 352h42" stroke-opacity="0.4" />
        </g>
        <g fill="url(#grad-lotus-inner)" opacity="0.75">
          <use href="#s-lotus" x="196" y="318" width="46" height="30" />
          <use href="#s-lotus" x="640" y="322" width="40" height="26" />
          <use href="#s-lotus" x="420" y="326" width="34" height="22" />
        </g>
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class AngkorSilhouette {
  readonly pond = input(true);
  /** Crops the drawing to the central towers (for narrow side panels). */
  readonly compact = input(false);
  protected readonly geo = computed(() => angkorGeometry());
}
