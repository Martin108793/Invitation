/**
 * Typed models for every piece of data that appears on the invitation.
 * The single source of truth for the content lives in
 * `src/app/core/data/wedding.config.ts`.
 */

export type CoupleRole = 'groom' | 'bride';

export interface CoupleMember {
  role: CoupleRole;
  /** Name shown under the portrait. */
  name: string;
  /** Khmer-script name (optional). */
  nameKm?: string;
  /** Small label above the name, e.g. "The Groom". */
  roleLabel: string;
  /** e.g. "Son of Mr. … & Mrs. …" */
  familyLine: string;
  /** Two or three warm lines of introduction. */
  bio: string;
  /** Portrait image plus responsive candidates. */
  photo: { src: string; srcset: string; width: number; height: number };
}

export interface WeddingVenue {
  name: string;
  nameKm?: string;
  addressLine1: string;
  addressLine2: string;
  /** Human readable ceremony time, e.g. "4:00 PM". */
  ceremonyTime: string;
  ceremonyNote: string;
  /** External Google Maps link used by the "Get Directions" button. */
  directionsUrl: string;
  photo: { src: string; srcset: string; width: number; height: number; alt: string };
}

export interface WeddingEvent {
  id: string;
  /** Khmer ceremony name — the primary label. */
  nameKm: string;
  /** Optional English translation. */
  nameEn?: string;
  time: string;
  description: string;
  /** Key of a decorative symbol rendered by `<app-ritual-symbol>`. */
  symbol: RitualSymbol;
}

export type RitualSymbol =
  | 'offering'
  | 'procession'
  | 'blessing'
  | 'rings'
  | 'veil'
  | 'thread'
  | 'banquet';

export interface GalleryImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface WeddingDetails {
  /** ISO-8601 date-time WITH an explicit UTC offset — used for the countdown. */
  dateISO: string;
  /** IANA timezone used for all date formatting. */
  timezone: string;
  /** Pre-formatted long date, e.g. "Saturday, 16 January 2027". */
  dateLabel: string;
  dateLabelKm: string;
  /** Pre-formatted short date used on the cover, e.g. "16 · 01 · 2027". */
  shortDate: string;
  dayLabel: string;
  timeLabel: string;
  countdownTitle: string;
  /** Shown while the wedding day itself is happening. */
  countdownTodayTitle: string;
  /** Shown once the wedding day is over. */
  countdownDoneTitle: string;
  countdownDoneMessage: string;
}

export interface RsvpConfig {
  /**
   * Optional POST endpoint for storing responses (Formspree, Google Apps
   * Script, Cloudflare Worker, Supabase function …). When empty, the form
   * works but clearly tells the guest that the answer was NOT stored online
   * and offers to send it directly to the couple instead.
   */
  endpoint: string;
  /** Contact used for the "send directly" fallback. */
  contact: { channel: 'telegram' | 'whatsapp' | 'email'; handle: string };
  deadlineLabel: string;
  maxAttendees: number;
}

export interface MusicConfig {
  /** Path to a local, licensed instrumental file inside /public/audio. */
  src: string;
  title: string;
  artist: string;
}

export interface WeddingConfig {
  monogram: { left: string; right: string; separator: string };
  couple: {
    groom: CoupleMember;
    bride: CoupleMember;
    /** Names joined with the separator, shown as the main hero title. */
    shortNames: string;
    story: string;
  };
  details: WeddingDetails;
  venue: WeddingVenue;
  schedule: WeddingEvent[];
  gallery: GalleryImage[];
  messages: {
    khmerBlessing: string;
    weddingInvitation: string;
    withFamilies: string;
    inviteLine: string;
    tagline: string;
    subTagline: string;
    coverGreeting: string;
    coverHint: string;
    openButton: string;
    closing: string;
    closingSignoff: string;
  };
  rsvp: RsvpConfig;
  music: MusicConfig;
}
