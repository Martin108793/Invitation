import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WEDDING_CONFIG } from '../../core/services/wedding-config';
import { LanguageService } from '../../core/i18n/language.service';
import { SakuraPetals } from '../../shared/components/sakura-petals/sakura-petals';

/**
 * The inside invitation — what guests see after pressing “Open Invitation”.
 *
 * A traditional Khmer card composed of layers:
 *   • Kbach Khmer gable (SVG sprite, `#k-pediment`) over the top border
 *   • gold vine rails down both sides (SVG pattern `#k-tile`)
 *   • Rumduol (ផ្ការំដួល) sprays at the four corners and along the sides
 *   • cream paper with the live invitation text
 *   • Angkor Wat + lotus foot (`images/ornaments/kbach-foot.svg`)
 * All words come from `core/data/wedding.config.ts`.
 */
@Component({
  selector: 'app-invitation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SakuraPetals],
  templateUrl: './invitation.html',
  styleUrl: './invitation.scss',
})
export class Invitation {
  protected readonly w = inject(WEDDING_CONFIG);
  protected readonly lg = inject(LanguageService);
}
