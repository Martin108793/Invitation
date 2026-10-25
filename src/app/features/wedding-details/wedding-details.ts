import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface CountdownUnit {
  label: string;
  value: string;
}

const KM_WEEKDAYS: Record<string, string> = {
  Sunday: 'អាទិត្យ', Monday: 'ច័ន្ទ', Tuesday: 'អង្គារ', Wednesday: 'ពុធ',
  Thursday: 'ព្រហស្បតិ៍', Friday: 'សុក្រ', Saturday: 'សៅរ៍',
};
const KM_MONTHS: Record<string, string> = {
  January: 'មករា', February: 'កុម្ភៈ', March: 'មីនា', April: 'មេសា', May: 'ឧសភា', June: 'មិថុនា',
  July: 'កក្កដា', August: 'សីហា', September: 'កញ្ញា', October: 'តុលា', November: 'វិច្ឆិកា', December: 'ធ្នូ',
};

/** Date, time, venue and the live countdown. */
@Component({
  selector: 'app-wedding-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  templateUrl: './wedding-details.html',
  styleUrl: './wedding-details.scss',
})
export class WeddingDetails {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly target = new Date(this.w.details.dateISO).getTime();
  private readonly now = signal(Date.now());
  private timer?: ReturnType<typeof setInterval>;

  protected readonly isPast = computed(() => this.target - this.now() <= 0);

  protected readonly units = computed<CountdownUnit[]>(() => {
    const diff = Math.max(0, this.target - this.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return [
      { label: this.lg.t('unit.days'), value: this.lg.num(days) },
      { label: this.lg.t('unit.hours'), value: this.lg.num(pad(hours)) },
      { label: this.lg.t('unit.minutes'), value: this.lg.num(pad(minutes)) },
      { label: this.lg.t('unit.seconds'), value: this.lg.num(pad(seconds)) },
    ];
  });

  /** True while it is still the wedding day in the wedding's timezone. */
  protected readonly isWeddingDay = computed(() => {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.w.details.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(new Date(this.target)) === fmt.format(new Date(this.now()));
  });

  protected readonly doneTitle = computed(() =>
    this.isWeddingDay() ? this.w.details.countdownTodayTitle : this.w.details.countdownDoneTitle,
  );

  /** Localised pieces of the date, always resolved in the wedding timezone. */
  protected readonly dateParts = computed(() => {
    const date = new Date(this.target);
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat('en-GB', { timeZone: this.w.details.timezone, ...opts }).format(date);
    const weekday = fmt({ weekday: 'long' });
    const month = fmt({ month: 'long' });
    if (!this.lg.isKm()) return { weekday, day: fmt({ day: '2-digit' }), month, year: fmt({ year: 'numeric' }) };
    return {
      weekday: 'ថ្ងៃ' + (KM_WEEKDAYS[weekday] ?? weekday),
      day: this.lg.num(fmt({ day: '2-digit' })),
      month: 'ខែ' + (KM_MONTHS[month] ?? month),
      year: 'ឆ្នាំ' + this.lg.num(fmt({ year: 'numeric' })),
    };
  });

  constructor() {
    // Tick once a second and stop for good once the wedding has started.
    this.timer = setInterval(() => {
      this.now.set(Date.now());
      if (this.now() >= this.target && this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }, 1000);

    this.destroyRef.onDestroy(() => {
      if (this.timer) clearInterval(this.timer);
      this.timer = undefined;
    });
  }
}
