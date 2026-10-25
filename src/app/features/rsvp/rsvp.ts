import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { RsvpOutcome, RsvpResponse, RsvpService } from '../../core/services/rsvp.service';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

type FormState = 'idle' | 'sending' | 'error' | 'done';

@Component({
  selector: 'app-rsvp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionHeading, RevealDirective],
  templateUrl: './rsvp.html',
  styleUrl: './rsvp.scss',
})
export class Rsvp {
  private readonly fb = inject(FormBuilder);
  private readonly rsvpService = inject(RsvpService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly lg = inject(LanguageService);
  protected readonly config = inject(WEDDING_CONFIG).rsvp;
  protected readonly onlineStorage = this.rsvpService.isOnlineStorageConfigured;
  protected readonly attendeesOptions = Array.from(
    { length: Math.max(1, this.config.maxAttendees) },
    (_, i) => i + 1,
  );

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    attendance: ['accept', Validators.required],
    attendees: [2, [Validators.required, Validators.min(1), Validators.max(this.config.maxAttendees)]],
    message: ['', [Validators.maxLength(500)]],
    // Honeypot — real guests never see or fill this field.
    website: [''],
  });

  private readonly attendance = toSignal(this.form.controls.attendance.valueChanges, {
    initialValue: 'accept' as const,
  });

  protected readonly attending = () => this.attendance() === 'accept';
  protected readonly state = signal<FormState>('idle');
  protected readonly outcome = signal<RsvpOutcome | null>(null);
  protected readonly response = signal<RsvpResponse | null>(null);
  protected readonly shareLink = signal('');
  private submitted = false;

  protected invalid(control: 'name' | 'attendees' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.submitted);
  }

  protected async submit(): Promise<void> {
    this.submitted = true;

    if (this.form.controls.website.value) {
      // Bot: pretend everything is fine, store nothing.
      this.state.set('done');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      setTimeout(() => {
        const firstInvalid = this.host.nativeElement.querySelector<HTMLElement>(
          'input.ng-invalid, select.ng-invalid, textarea.ng-invalid',
        );
        firstInvalid?.focus();
      });
      return;
    }

    const raw = this.form.getRawValue();
    const payload: RsvpResponse = {
      name: raw.name.trim(),
      attendance: raw.attendance === 'decline' ? 'decline' : 'accept',
      attendees: raw.attendance === 'decline' ? 0 : Number(raw.attendees),
      message: raw.message.trim(),
    };

    this.state.set('sending');
    this.outcome.set(null);

    const outcome = await this.rsvpService.submit(payload);
    this.response.set(payload);
    this.outcome.set(outcome);
    this.shareLink.set(this.rsvpService.shareLink(payload));
    this.state.set(outcome.ok ? 'done' : 'error');
  }

  protected reset(): void {
    this.form.reset({ name: '', attendance: 'accept', attendees: 2, message: '', website: '' });
    this.submitted = false;
    this.outcome.set(null);
    this.response.set(null);
    this.state.set('idle');
  }

  protected get attendanceSummary(): string {
    const r = this.response();
    if (!r) return '';
    return r.attendance === 'accept'
      ? this.lg.t('rsvp.accepted', {
          n: this.lg.num(r.attendees),
          unit: this.lg.t(r.attendees === 1 ? 'rsvp.guest' : 'rsvp.guests'),
        })
      : this.lg.t('rsvp.declined');
  }
}
