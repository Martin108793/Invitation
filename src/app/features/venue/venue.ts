import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/** Venue photograph, address, ceremony time and a Google Maps link. */
@Component({
  selector: 'app-venue',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  templateUrl: './venue.html',
  styleUrl: './venue.scss',
})
export class Venue {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
}
