import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface ArchPaths {
  outer: string;
  inner: string;
  fill: string;
}

interface ArchPoint {
  x: number;
  y: number;
}

/**
 * A cusped Khmer-style arch generated from a parametric curve, with an
 * inner hairline and optional gold bead studs — the frame of the invitation.
 */
@Component({
  selector: 'app-khmer-arch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 600 470" focusable="false" preserveAspectRatio="none">
      <defs>
        <linearGradient id="arch-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FCE4EC" stop-opacity="0.45" />
          <stop offset="52%" stop-color="#FCE4EC" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#FFF5E8" stop-opacity="0" />
        </linearGradient>
      </defs>

      <path [attr.d]="paths().fill" fill="url(#arch-fill)" />
      <path [attr.d]="paths().fill" fill="none" stroke="#E8A0BF" stroke-opacity="0.22" stroke-width="12" />

      <path
        [attr.d]="paths().outer"
        fill="none"
        stroke="url(#grad-gold-line)"
        [attr.stroke-width]="thickness()"
        stroke-linecap="round"
      />
      <path
        [attr.d]="paths().inner"
        fill="none"
        stroke="#B08D57"
        stroke-opacity="0.48"
        [attr.stroke-width]="thickness() * 0.4"
        stroke-linecap="round"
        stroke-dasharray="1 5"
      />

      @if (studs()) {
        <g fill="url(#grad-gold)">
          @for (p of studPoints(); track $index) {
            <circle [attr.cx]="p.x" [attr.cy]="p.y" r="2.2" />
          }
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
      overflow: visible;
    }
  `,
})
export class KhmerArch {
  /** Number of cusps per side (including the apex cusp). */
  readonly lobes = input(3);
  /** How deep the scallops cut into the arch. */
  readonly amplitude = input(20);
  readonly thickness = input(2.4);
  readonly studs = input(true);

  private readonly curvePoints = computed<ArchPoint[]>(() => {
    const cx = 300;
    const apexY = 40;
    const springY = 452;
    const W = 292;
    const H = springY - apexY;
    const lobes = this.lobes();
    const amp = this.amplitude();
    const steps = 110;
    const pts: ArchPoint[] = [];

    for (let i = 0; i <= steps; i++) {
      const phi = Math.PI - (i / steps) * Math.PI;
      const o = amp * Math.sin(phi) * (1 - Math.cos(2 * lobes * (phi - Math.PI / 2))) * 0.5;
      pts.push({
        x: cx + (W - o * 0.9) * Math.cos(phi),
        y: springY - (H - o) * Math.sin(phi),
      });
    }
    return pts;
  });

  protected readonly paths = computed<ArchPaths>(() => {
    const toPath = (pts: ArchPoint[], dy = 0, dx = 0) =>
      pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.x + dx).toFixed(1)} ${(p.y + dy).toFixed(1)}`)
        .join('');

    const pts = this.curvePoints();
    const outer = toPath(pts);
    const inner = toPath(pts, 20, 0);
    return { outer, inner, fill: `${outer}L${pts[pts.length - 1].x.toFixed(1)} 452Z` };
  });

  /** A bead every few points along the outside of the arch. */
  protected readonly studPoints = computed<ArchPoint[]>(() => {
    const pts = this.curvePoints();
    return pts.filter((_, i) => i % 9 === 4);
  });
}
