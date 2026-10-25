/**
 * Interface labels in both languages.  (Wedding *content* — names, venue,
 * programme, messages — lives in `core/data/wedding.config.ts` and its Khmer
 * twin `wedding.km.ts`.)  Use `{n}`-style placeholders for dynamic parts.
 */
export const UI = {
  'skip': { en: 'Skip to the invitation', km: 'រំលងទៅកាន់ធៀបអញ្ជើញ' },
  'lang.label': { en: 'Language', km: 'ភាសា' },
  'scroll': { en: 'Scroll', km: 'រំកិលចុះ' },

  // Invitation card
  'inv.rsvp': { en: 'Kindly reply (RSVP)', km: 'សូមឆ្លើយតប (RSVP)' },
  'inv.map': { en: 'View map', km: 'មើលផែនទី' },
  'inv.date': { en: 'Date', km: 'កាលបរិច្ឆេទ' },
  'inv.time': { en: 'Time', km: 'ពេលវេលា' },
  'inv.venue': { en: 'Venue', km: 'ទីកន្លែង' },
  'inv.groomFamily': { en: 'Groom’s family', km: 'ក្រុមគ្រួសារខាងកូនកំលោះ' },
  'inv.brideFamily': { en: 'Bride’s family', km: 'ក្រុមគ្រួសារខាងកូនក្រមុំ' },
  'inv.and': { en: 'and', km: 'និង' },
  'inv.city': { en: 'Phnom Penh', km: 'ភ្នំពេញ' },
  'inv.scrollAria': { en: 'Scroll to the couple', km: 'រំកិលទៅកាន់គូស្វាមីភរិយា' },

  // The couple
  'couple.eyebrow': { en: 'The couple', km: 'គូស្វាមីភរិយា' },
  'couple.title': { en: 'Two families, one celebration', km: 'គ្រួសារពីរ មង្គលការតែមួយ' },
  'couple.subtitle': {
    en: 'With the blessing of our parents and elders, we begin a new chapter together.',
    km: 'ដោយមានពរជ័យពីឪពុកម្តាយ និងចាស់ទុំ យើងចាប់ផ្តើមជំពូកថ្មីនៃជីវិតជាមួយគ្នា។',
  },

  // When & where
  'det.eyebrow': { en: 'The celebration', km: 'ពិធីមង្គលការ' },
  'det.title': { en: 'When & where', km: 'ពេលវេលា និងទីកន្លែង' },
  'det.subtitle': {
    en: 'One date, one place, and every person we love under the same roof.',
    km: 'ថ្ងៃតែមួយ កន្លែងតែមួយ ហើយអ្នកជាទីស្រឡាញ់ទាំងអស់នៅក្រោមដំបូលតែមួយ។',
  },
  'det.save': { en: 'Save the date', km: 'សូមកត់ទុកថ្ងៃមង្គល' },
  'det.ceremony': { en: 'Ceremony', km: 'ពិធី' },
  'det.venue': { en: 'Venue', km: 'ទីកន្លែង' },
  'det.address': { en: 'Address', km: 'អាសយដ្ឋាន' },
  'det.until': { en: 'Until {date} at {time}', km: 'រហូតដល់ {date} {time}' },
  'det.timer': { en: 'Time remaining until the wedding', km: 'ពេលវេលានៅសល់មុនពិធីមង្គលការ' },
  'det.thanks': { en: 'Thank you', km: 'សូមអរគុណ' },
  'unit.days': { en: 'Days', km: 'ថ្ងៃ' },
  'unit.hours': { en: 'Hours', km: 'ម៉ោង' },
  'unit.minutes': { en: 'Minutes', km: 'នាទី' },
  'unit.seconds': { en: 'Seconds', km: 'វិនាទី' },

  // Programme
  'sch.eyebrow': { en: 'The programme', km: 'កម្មវិធី' },
  'sch.title': { en: 'Our wedding ceremonies', km: 'ពិធីមង្គលការរបស់យើង' },
  'sch.subtitle': {
    en: 'A traditional Khmer wedding unfolds across one long, joyful day — from the morning offerings to the evening banquet.',
    km: 'មង្គលការប្រពៃណីខ្មែរប្រព្រឹត្តទៅពេញមួយថ្ងៃដ៏រីករាយ ចាប់ពីពិធីសែនព្រេនពេលព្រឹក រហូតដល់ពិសាភោជនាហារពេលល្ងាច។',
  },

  // Gallery
  'gal.eyebrow': { en: 'Moments', km: 'ពេលវេលាអនុស្សាវរីយ៍' },
  'gal.title': { en: 'Our gallery', km: 'វិចិត្រសាលរូបភាព' },
  'gal.subtitle': {
    en: 'Engagement portraits, traditional Khmer dress and the places that shaped our story.',
    km: 'រូបថតមង្គលការ សំលៀកបំពាក់ប្រពៃណីខ្មែរ និងទីកន្លែងដែលបង្កើតជារឿងរ៉ាវរបស់យើង។',
  },
  'gal.enlarge': { en: 'Enlarge photograph: {caption}', km: 'ពង្រីករូបភាព៖ {caption}' },
  'gal.viewer': { en: 'Photo viewer', km: 'កម្មវិធីមើលរូបភាព' },
  'gal.close': { en: 'Close photo viewer', km: 'បិទកម្មវិធីមើលរូបភាព' },
  'gal.prev': { en: 'Previous photograph', km: 'រូបភាពមុន' },
  'gal.next': { en: 'Next photograph', km: 'រូបភាពបន្ទាប់' },

  // Venue
  'ven.eyebrow': { en: 'Directions', km: 'ទិសដៅ' },
  'ven.title': { en: 'The venue', km: 'ទីតាំងមង្គលការ' },
  'ven.subtitle': {
    en: 'A garden pavilion under the palms, twenty minutes from the riverside.',
    km: 'សាលាក្នុងសួនក្រោមដើមត្នោត ឆ្ងាយពីមាត់ទន្លេត្រឹមម្ភៃនាទី។',
  },
  'ven.ceremony': { en: 'Ceremony', km: 'ពិធី' },
  'ven.address': { en: 'Address', km: 'អាសយដ្ឋាន' },
  'ven.directions': { en: 'Get directions', km: 'បង្ហាញផ្លូវ' },

  // RSVP
  'rsvp.eyebrow': { en: 'Reply', km: 'ឆ្លើយតប' },
  'rsvp.title': { en: 'Will you celebrate with us?', km: 'តើលោកអ្នកនឹងរួមអបអរជាមួយយើងទេ?' },
  'rsvp.subtitle': {
    en: 'Your reply helps us prepare a seat, a blessing thread and a plate for you.',
    km: 'ការឆ្លើយតបរបស់លោកអ្នក ជួយយើងរៀបចំកៅអី អំបោះពរជ័យ និងចានអាហារសម្រាប់លោកអ្នក។',
  },
  'rsvp.name': { en: 'Full name', km: 'ឈ្មោះពេញ' },
  'rsvp.namePh': { en: 'Your name', km: 'ឈ្មោះរបស់លោកអ្នក' },
  'rsvp.nameErr': { en: 'Please enter your name (at least 2 characters).', km: 'សូមបំពេញឈ្មោះរបស់លោកអ្នក (យ៉ាងតិច ២ តួអក្សរ)។' },
  'rsvp.join': { en: 'Will you join us?', km: 'តើលោកអ្នកនឹងចូលរួមទេ?' },
  'rsvp.accept': { en: 'Joyfully accept', km: 'ទទួលយកដោយក្តីរីករាយ' },
  'rsvp.acceptSub': { en: 'I will be there', km: 'ខ្ញុំនឹងចូលរួម' },
  'rsvp.decline': { en: 'Regretfully decline', km: 'សូមអភ័យទោស មិនអាចចូលរួម' },
  'rsvp.declineSub': { en: 'I send my blessings', km: 'ខ្ញុំសូមជូនពរពីចម្ងាយ' },
  'rsvp.guestsLabel': { en: 'Number of guests', km: 'ចំនួនភ្ញៀវ' },
  'rsvp.guest': { en: 'guest', km: 'នាក់' },
  'rsvp.guests': { en: 'guests', km: 'នាក់' },
  'rsvp.guestsHint': {
    en: 'Including yourself. Let us know if you need more than {max}.',
    km: 'រួមទាំងខ្លួនលោកអ្នក។ សូមប្រាប់យើងបើត្រូវការច្រើនជាង {max} នាក់។',
  },
  'rsvp.note': { en: 'A note for the couple', km: 'សារជូនគូស្វាមីភរិយា' },
  'rsvp.optional': { en: '(optional)', km: '(មិនចាំបាច់)' },
  'rsvp.notePh': { en: 'A blessing, a memory, a song request…', km: 'ពាក្យជូនពរ ការចងចាំ ឬបទចម្រៀងដែលចង់ស្តាប់…' },
  'rsvp.send': { en: 'Send RSVP', km: 'ផ្ញើការឆ្លើយតប' },
  'rsvp.sending': { en: 'Sending…', km: 'កំពុងផ្ញើ…' },
  'rsvp.please': { en: 'Please note:', km: 'សូមកត់សម្គាល់៖' },
  'rsvp.storage': {
    en: 'online RSVP storage is not connected for this invitation yet. Your answer will be kept on this device and you will be offered a link to send it straight to the couple.',
    km: 'ប្រព័ន្ធរក្សាទុកការឆ្លើយតបតាមអនឡាញមិនទាន់ត្រូវបានភ្ជាប់សម្រាប់ធៀបនេះទេ។ ចម្លើយរបស់លោកអ្នកនឹងត្រូវរក្សាទុកក្នុងឧបករណ៍នេះ ហើយនឹងមានតំណសម្រាប់ផ្ញើដោយផ្ទាល់ទៅគូស្វាមីភរិយា។',
  },
  'rsvp.thank': { en: 'Thank you', km: 'សូមអរគុណ' },
  'rsvp.sendDirect': { en: 'Send directly to the couple', km: 'ផ្ញើដោយផ្ទាល់ទៅគូស្វាមីភរិយា' },
  'rsvp.another': { en: 'Send another response', km: 'ផ្ញើការឆ្លើយតបមួយទៀត' },
  'rsvp.accepted': { en: 'Joyfully accepted · {n} {unit}', km: 'ទទួលយកដោយក្តីរីករាយ · {n} {unit}' },
  'rsvp.declined': { en: 'Regretfully declined', km: 'សូមអភ័យទោស មិនអាចចូលរួម' },

  'svc.device': {
    en: 'Saved on this device only. Online RSVP storage has not been connected yet, so please also send your reply to the couple using the button below.',
    km: 'បានរក្សាទុកក្នុងឧបករណ៍នេះតែប៉ុណ្ណោះ។ ប្រព័ន្ធរក្សាទុកតាមអនឡាញមិនទាន់ភ្ជាប់ទេ ដូច្នេះសូមផ្ញើការឆ្លើយតបទៅគូស្វាមីភរិយាតាមប៊ូតុងខាងក្រោមផងដែរ។',
  },
  'svc.rejected': {
    en: 'The RSVP service did not accept the message. Please try again or contact us directly.',
    km: 'សេវាកម្មឆ្លើយតបមិនបានទទួលសារទេ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងយើងដោយផ្ទាល់។',
  },
  'svc.sent': { en: 'Your reply has reached us. Thank you!', km: 'ការឆ្លើយតបរបស់លោកអ្នកបានមកដល់យើងហើយ។ សូមអរគុណ!' },
  'svc.network': {
    en: 'We could not reach the RSVP service. Please check your connection and try again, or contact the couple directly.',
    km: 'យើងមិនអាចភ្ជាប់ទៅសេវាកម្មឆ្លើយតបបានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត ឬទាក់ទងគូស្វាមីភរិយាដោយផ្ទាល់។',
  },
  'svc.subject': { en: 'RSVP — S & T Wedding', km: 'ការឆ្លើយតប — មង្គលការ S & T' },
  'svc.accepts': { en: 'Joyfully accepts', km: 'ទទួលយកដោយក្តីរីករាយ' },
  'svc.declines': { en: 'Regretfully declines', km: 'សូមអភ័យទោស មិនអាចចូលរួម' },
  'svc.guests': { en: 'Guests: {n}', km: 'ចំនួនភ្ញៀវ៖ {n}' },
  'svc.message': { en: 'Message: {text}', km: 'សារ៖ {text}' },

  // Music
  'music.none': { en: 'No music file found (see README)', km: 'រកមិនឃើញឯកសារតន្ត្រី (មើល README)' },
  'music.unavailable': { en: 'Music unavailable', km: 'មិនមានតន្ត្រី' },
  'music.pause': { en: 'Pause background music', km: 'ផ្អាកតន្ត្រីផ្ទៃខាងក្រោយ' },
  'music.loadingAria': { en: 'Loading music', km: 'កំពុងផ្ទុកតន្ត្រី' },
  'music.play': { en: 'Play background music', km: 'ចាក់តន្ត្រីផ្ទៃខាងក្រោយ' },
  'music.nowPlaying': { en: 'Now playing', km: 'កំពុងចាក់' },
  'music.loading': { en: 'Loading', km: 'កំពុងផ្ទុក' },
  'music.tap': { en: 'Tap to play', km: 'ចុចដើម្បីចាក់' },

  // Footer
  'footer.thanks': { en: 'Thank you', km: 'សូមអរគុណ' },
  'footer.fine': { en: 'Traditional Khmer wedding invitation · {date}', km: 'ធៀបអញ្ជើញមង្គលការប្រពៃណីខ្មែរ · {date}' },
} as const;

export type UiKey = keyof typeof UI;
