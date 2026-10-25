import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { GalleryImage } from '../../core/models/wedding.model';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/**
 * Responsive photo grid with an accessible lightbox:
 * click / Enter to open, ← → to browse, Esc to close, swipe on touch devices.
 */
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  private readonly config = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly images: GalleryImage[] = this.config.gallery;
  protected readonly activeIndex = signal<number | null>(null);
  protected readonly activeImage = computed<GalleryImage | null>(() => {
    const index = this.activeIndex();
    return index === null ? null : this.images[index];
  });

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private lastFocused: HTMLElement | null = null;
  private touchStartX = 0;

  constructor() {
    this.destroyRef.onDestroy(() => this.unlock());
  }

  protected open(index: number, event: Event): void {
    this.lastFocused = (event.currentTarget as HTMLElement) ?? null;
    this.activeIndex.set(index);
    this.document.body.classList.add('is-locked');
    this.document.addEventListener('keydown', this.onKeydown);
    setTimeout(() => this.closeButton()?.nativeElement.focus(), 30);
  }

  protected close(): void {
    this.activeIndex.set(null);
    this.unlock();
    this.lastFocused?.focus();
    this.lastFocused = null;
  }

  protected next(): void {
    const index = this.activeIndex();
    if (index === null) return;
    this.activeIndex.set((index + 1) % this.images.length);
  }

  protected previous(): void {
    const index = this.activeIndex();
    if (index === null) return;
    this.activeIndex.set((index - 1 + this.images.length) % this.images.length);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const distance = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(distance) < 48) return;
    distance > 0 ? this.previous() : this.next();
  }

  /** Largest candidate from `srcset`, used for the full-screen view. */
  protected fullSrc(image: GalleryImage): string {
    const candidates = image.srcset.split(',').map((part) => part.trim().split(/\s+/)[0]);
    return candidates[candidates.length - 1] ?? image.src;
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (this.activeIndex() === null) return;
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
      case 'Tab':
        // Keep focus inside the dialog.
        if (!this.closeButton()?.nativeElement.parentElement?.contains(this.document.activeElement)) {
          event.preventDefault();
          this.closeButton()?.nativeElement.focus();
        }
        break;
      default:
        break;
    }
  };

  private unlock(): void {
    this.document.body.classList.remove('is-locked');
    this.document.removeEventListener('keydown', this.onKeydown);
  }
}
