import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RitualSymbol } from '../../shared/components/ritual-symbol/ritual-symbol';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/** Traditional Khmer wedding programme, rendered from the config array. */
@Component({
  selector: 'app-wedding-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RitualSymbol, RevealDirective],
  templateUrl: './wedding-schedule.html',
  styleUrl: './wedding-schedule.scss',
})
export class WeddingSchedule {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
  protected readonly events = this.w.schedule;
}
