import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/** Groom & bride portraits with their introductions. */
@Component({
  selector: 'app-couple',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  templateUrl: './couple.html',
  styleUrl: './couple.scss',
})
export class Couple {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
}
