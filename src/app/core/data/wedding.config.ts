import { WeddingConfig } from '../models/wedding.model';

/**
 * ─────────────────────────────────────────────────────────────
 *  S & T  —  WEDDING CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  Everything a couple needs to customise lives in this one file.
 *  Replace the sample values below with the real details; no other
 *  file needs to be touched.
 *
 *  ⚠ All names, dates, venues and photos here are placeholders.
 *  ⚠ `details.dateISO` MUST include a UTC offset (+07:00 = Cambodia).
 * ─────────────────────────────────────────────────────────────
 */
export const WEDDING: WeddingConfig = {
  monogram: { left: 'S', right: 'T', separator: '&' },

  couple: {
    shortNames: 'Sokha & Theary',
    story:
      'Our story began under the shade of a frangipani tree beside the Mekong, ' +
      'and it grew the way Cambodian love stories do — slowly, warmly, surrounded ' +
      'by family. Today we invite you to share the blessing of our beginning.',
    groom: {
      role: 'groom',
      roleLabel: 'The Groom',
      name: 'Sokha',
      nameKm: 'សុខា',
      familyLine: 'Beloved son of Mr. Vannak & Mrs. Sreypov',
      bio:
        'An architect who sketches temples for a living and dreams of them at night. ' +
        'Quiet at first, endlessly warm once you know him — and happiest beside Theary.',
      photo: {
        src: 'images/portrait-groom-480.webp',
        srcset: 'images/portrait-groom-480.webp 480w, images/portrait-groom-760.webp 760w',
        width: 760,
        height: 1362,
      },
    },
    bride: {
      role: 'bride',
      roleLabel: 'The Bride',
      name: 'Theary',
      nameKm: 'ធារី',
      familyLine: 'Beloved daughter of Mr. Rithy & Mrs. Chenda',
      bio:
        'A classical dancer and teacher of Khmer arts, with a laugh that fills a room. ' +
        'She collects lotus photographs, old silk patterns, and every story Sokha tells.',
      photo: {
        src: 'images/portrait-bride-480.webp',
        srcset: 'images/portrait-bride-480.webp 480w, images/portrait-bride-760.webp 760w',
        width: 760,
        height: 1362,
      },
    },
  },

  details: {
    dateISO: '2027-01-16T16:00:00+07:00',
    timezone: 'Asia/Phnom_Penh',
    dateLabel: 'Saturday, 16 January 2027',
    dateLabelKm: 'ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧',
    shortDate: '16 · 01 · 2027',
    dayLabel: 'Saturday',
    timeLabel: '4:00 PM onwards',
    countdownTitle: 'Counting the days',
    countdownTodayTitle: 'Today is the day',
    countdownDoneTitle: 'Thank you for celebrating with us',
    countdownDoneMessage:
      'Our wedding day has passed, but the blessings you shared with us remain. ' +
      'Thank you for being part of our story.',
  },

  venue: {
    name: 'Sala Angkor Garden',
    nameKm: 'សាលាអង្គរ',
    addressLine1: 'No. 12, Preah Norodom Boulevard',
    addressLine2: 'Sangkat Tonle Bassac, Phnom Penh, Cambodia',
    ceremonyTime: '4:00 PM — 10:00 PM',
    ceremonyNote:
      'Traditional blessings begin at 4:00 PM, followed by dinner and dancing. ' +
      'Please arrive 20 minutes early to find your seat.',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Tonle+Bassac+Phnom+Penh+Cambodia',
    photo: {
      src: 'images/venue-720.webp',
      srcset: 'images/venue-720.webp 720w, images/venue-1100.webp 1100w',
      width: 1100,
      height: 614,
      alt: 'Khmer-style garden pavilion decorated with pink lotus flowers at dusk',
    },
  },

  /**
   * Traditional Khmer wedding programme.
   * Add, remove or reorder freely — the timeline renders in array order.
   */
  schedule: [
    {
      id: 'sen-pren',
      nameKm: 'សែនព្រេន',
      nameEn: 'Offering to the Ancestors',
      time: '6:00 AM',
      description:
        'The morning blessing at home, where elders offer food and incense to the family ancestors.',
      symbol: 'offering',
    },
    {
      id: 'haer-chum',
      nameKm: 'ហែជំនូន',
      nameEn: 'Procession of Gifts',
      time: '8:00 AM',
      description:
        'The groom’s family carries ceremonial trays of fruit, sweets and silk to the bride’s house.',
      symbol: 'procession',
    },
    {
      id: 'kat-sok',
      nameKm: 'កាត់សក់បង្កក់សិរី',
      nameEn: 'Hair-Cutting & Blessing',
      time: '9:30 AM',
      description:
        'Elders gently snip a lock of hair while symbolically trimming away the past, then bless the couple.',
      symbol: 'blessing',
    },
    {
      id: 'bampear-chienhian',
      nameKm: 'បំពាក់ចិញ្ចៀន',
      nameEn: 'Exchange of Rings',
      time: '11:00 AM',
      description:
        'Golden rings are placed on the couple’s fingers as a promise witnessed by both families.',
      symbol: 'rings',
    },
    {
      id: 'sampeah-phtuem',
      nameKm: 'សំពះផ្ទឹម',
      nameEn: 'Joining & Veiling',
      time: '4:00 PM',
      description:
        'Beneath a ceremonial veil the couple bows together as one, receiving their first blessing as a pair.',
      symbol: 'veil',
    },
    {
      id: 'chong-dai',
      nameKm: 'ចងដៃ',
      nameEn: 'Wrist-Tying Ceremony',
      time: '5:00 PM',
      description:
        'Guests tie white cotton blessings around their wrists while sharing wishes for a long life together.',
      symbol: 'thread',
    },
    {
      id: 'pisar-phouchanahar',
      nameKm: 'ពិសាភោជនាហារ',
      nameEn: 'Wedding Banquet',
      time: '6:30 PM',
      description:
        'A Khmer feast, live music and dancing beneath the lanterns to close the celebration.',
      symbol: 'banquet',
    },
  ],

  gallery: [
    {
      src: 'images/gallery-01-560.webp',
      srcset: 'images/gallery-01-560.webp 560w, images/gallery-01-900.webp 900w',
      width: 900,
      height: 491,
      alt: 'The couple’s hands joined, wearing Khmer gold bangles beside pink lotus petals',
      caption: 'Hand in hand',
    },
    {
      src: 'images/gallery-02-560.webp',
      srcset: 'images/gallery-02-560.webp 560w, images/gallery-02-900.webp 900w',
      width: 900,
      height: 491,
      alt: 'Wrists tied with white cotton blessing threads during a Khmer ceremony',
      caption: 'Chong Dai blessings',
    },
    {
      src: 'images/gallery-03-560.webp',
      srcset: 'images/gallery-03-560.webp 560w, images/gallery-03-900.webp 900w',
      width: 900,
      height: 502,
      alt: 'Angkor Wat at sunrise reflected in a lotus pond',
      caption: 'Where our roots begin',
    },
    {
      src: 'images/gallery-04-560.webp',
      srcset: 'images/gallery-04-560.webp 560w, images/gallery-04-900.webp 900w',
      width: 900,
      height: 491,
      alt: 'Bouquet of pink lotus and sakura blossoms with gold Khmer ornaments',
      caption: 'Lotus & sakura',
    },
    {
      src: 'images/gallery-05-560.webp',
      srcset: 'images/gallery-05-560.webp 560w, images/gallery-05-900.webp 900w',
      width: 900,
      height: 502,
      alt: 'Couple in traditional Khmer attire walking through a pink blossom garden',
      caption: 'Golden hour',
    },
    {
      src: 'images/gallery-06-560.webp',
      srcset: 'images/gallery-06-560.webp 560w, images/gallery-06-900.webp 900w',
      width: 900,
      height: 502,
      alt: 'Khmer wedding reception decorated with pink and ivory flowers',
      caption: 'The celebration',
    },
    {
      src: 'images/gallery-07-560.webp',
      srcset: 'images/gallery-07-560.webp 560w, images/gallery-07-900.webp 900w',
      width: 900,
      height: 491,
      alt: 'Khmer gold jewellery and pink silk fabric with fresh sakura blossoms',
      caption: 'Silk & gold',
    },
  ],

  messages: {
    khmerBlessing: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍',
    weddingInvitation: 'Wedding Invitation',
    withFamilies: 'Together with our families',
    inviteLine: 'Joyfully invite you to celebrate',
    tagline: 'Two hearts, one journey',
    subTagline: 'A lifetime of love and togetherness',
    coverGreeting: 'With the blessing of our families',
    coverHint: 'A traditional Khmer wedding celebration',
    openButton: 'Open Invitation',
    closing: 'Your presence is the loveliest gift. Come share a meal, a blessing and a dance with us.',
    closingSignoff: 'With love and gratitude',
  },

  rsvp: {
    // Leave empty until a form service is configured — the UI adapts automatically.
    endpoint: '',
    contact: { channel: 'telegram', handle: 'https://t.me/your_telegram_username' },
    deadlineLabel: 'Kindly reply before 20 December 2026',
    maxAttendees: 8,
  },

  music: {
    src: 'audio/wedding-theme.mp3',
    title: 'Srok Srei — Khmer Wedding Melody',
    artist: 'Instrumental sample',
  },
};
