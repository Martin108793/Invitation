# S & T — Khmer Traditional Wedding Digital Invitation

A complete, production-ready **Angular** single-page digital wedding invitation for
*Sokha & Theary*, built around the painted reference card: a cusped gold Khmer arch
on blush paper, cherry-blossom branches, gold side columns with arch plaques, an
Angkor Wat vignette and a devata (apsara) relief on each side, lotus bouquets, pink
silk drapes, the gold “S & T” emblem and a large, spacious ivory centre.

The card is **layered, not a flat poster** (`shared/components/invitation-frame`):
the painted artwork, the S & T emblem and the drifting petals are separate layers,
and every word on the invitation is live HTML text in the empty centre — selectable,
translatable, screen-reader friendly and easy to edit.

Everything a couple needs to change lives in **one file**:
`src/app/core/data/wedding.config.ts`

---

## 1. Quick start

```bash
# 1. install (Node 20.19+ / 22.12+ / 24+)
npm install

# 2. run locally  →  http://localhost:4200
npm start

# 3. production build  →  dist/wedding-invitation/browser
npm run build

# 4. preview the production build locally
npx http-server dist/wedding-invitation/browser -p 8080
```

> This project was generated with **Angular 21** (standalone components, signals,
> SCSS). Angular 22 requires Node ≥ 22.22; if your machine runs Node 22+ you can
> upgrade with `ng update @angular/core @angular/cli`.

---

## 2. Preview

| Cover — the reference card, layered | After opening | Cover (mobile) |
| --- | --- | --- |
| ![Cover](docs/preview-cover.jpg) | ![Invitation](docs/preview-invitation.jpg) | ![Mobile](docs/preview-mobile-cover.jpg) |

---

## 3. What is included

| Requirement | Where |
| --- | --- |
| Full-screen ornamental cover + “Open Invitation” animation | `features/envelope` |
| The layered invitation card (artwork, emblem, sheen, petals, text slot) | `shared/components/invitation-frame` |
| Card artwork + separate emblem layer (WebP, 640 / 1024 px) | `public/images/frame/` |
| Main invitation announcement (same card, full details) | `features/invitation` |
| Couple introduction with portraits | `features/couple` |
| Date / time / venue + live countdown | `features/wedding-details` |
| Traditional Khmer ceremony timeline | `features/wedding-schedule` |
| Gallery with accessible lightbox | `features/gallery` |
| Venue section + Google Maps link | `features/venue` |
| RSVP form (validation, loading, confirmation) | `features/rsvp` |
| Optional music player (never autoplays) | `shared/components/music-player` |
| Falling sakura petals | `shared/components/sakura-petals` |
| Reusable Khmer artwork (arch, monogram, lotus, sakura, Angkor Wat) | `shared/components/*` |
| Central wedding data | `core/data/wedding.config.ts` |

```
src/
├─ app/
│  ├─ core/            models, services (music, rsvp, config token), Angkor geometry
│  ├─ features/        envelope (+ cover-art.svg scene) · invitation · couple ·
│  │                   wedding-details · wedding-schedule · gallery · venue · rsvp
│  ├─ shared/          components (monogram, arch, sakura, lotus, dividers…)
│  │                   + reveal directive
│  ├─ app.ts / app.html / app.scss
│  └─ app.config.ts
├─ styles/             _mixins, _fonts, _ornaments (partials)
├─ styles.scss         design tokens, base typography, buttons, reveal
└─ public/             images · fonts · audio
```

---

## 4. Customising the invitation

Open **`src/app/core/data/wedding.config.ts`** and edit:

* `monogram` — initials shown in the cover emblem (`S` / `&` / `T`).
* `couple.groom`, `couple.bride` — names, Khmer names, family lines, bios, photos.
* `couple.story`, `couple.shortNames` — the romantic paragraph and the footer title.
* `details.dateISO` — **the** wedding date, including the UTC offset, e.g.
  `'2027-01-16T16:00:00+07:00'`. This one value drives the date card, the cover
  date and the countdown.
* `details.dateLabel`, `dateLabelKm`, `shortDate`, `timeLabel` — pre-formatted text
  (so you can write the date exactly as the family prefers).
* `details.timezone` — IANA zone used for all formatting (`Asia/Phnom_Penh`).
* `venue` — name, Khmer name, address, ceremony time, note, photo, `directionsUrl`.
* `schedule` — the ceremony list. Add / remove / reorder objects; the timeline
  renders in array order. `symbol` accepts
  `offering · procession · blessing · rings · veil · thread · banquet`.
* `gallery` — image list (`src`, `srcset`, `width`, `height`, `alt`, `caption`).
* `messages` — every heading, tagline and closing line.
* `rsvp` — `endpoint`, contact fallback, deadline, max attendees.
* `music` — path, title and artist of the instrumental.

### Replacing the photographs

Drop your own files into `public/images/` and update the paths in the config.
For the best performance export **two WebP widths** per photo (e.g. 560 px and
900 px for gallery tiles, 480 px and 760 px for portraits) and keep `width` /
`height` in the config so the layout reserves space and never shifts.

The sample photographs in this repository are AI-generated placeholders — replace
them with the couple's real photographs before sharing the link.

### Ceremony names (Khmer)

```
សែនព្រេន                 Offering to the ancestors
ហែជំនូន                   Procession of gifts
កាត់សក់បង្កក់សិរី         Hair-cutting & blessing
បំពាក់ចិញ្ចៀន             Exchange of rings
សំពះផ្ទឹម                 Joining & veiling
ចងដៃ                    Wrist-tying ceremony
ពិសាភោជនាហារ            Wedding banquet
```

---

## 5. Background music

* The player is **opt-in** — nothing is downloaded or played until the guest taps
  the button (`preload="none"`, no autoplay).
* A short original instrumental loop ships at
  `public/audio/wedding-theme.mp3` so the control works out of the box.
  **Replace it** with a licensed Khmer instrumental (or the couple's chosen song)
  and update `music.title` / `music.artist`.
* If the file is missing or unsupported the button disables itself and shows
  “Music unavailable” — the site never breaks.

---

## 6. RSVP storage (the only thing that needs a backend)

The form, validation, loading state and confirmation screen are complete. Where
the answer *goes* is isolated in `core/services/rsvp.service.ts`.

* **No endpoint configured (default):** the response is saved to this device only.
  The confirmation screen says so explicitly and offers a **“Send directly to the
  couple”** button that opens Telegram / WhatsApp / e-mail pre-filled with the
  reply. The UI never pretends the couple received it.
* **Endpoint configured:** set `rsvp.endpoint` in the config to any URL that
  accepts a JSON `POST` — Formspree, Google Apps Script web app, a Cloudflare
  Worker, Supabase edge function, your own API, etc. The payload is:

  ```json
  { "name": "…", "attendance": "accept|decline", "attendees": 2,
    "message": "…", "submittedAt": "2027-01-02T10:00:00.000Z" }
  ```

  A 2xx response shows “Your reply has reached us”. Failures show a friendly
  retry message. No API key is ever placed in the frontend — use a service that
  authenticates by URL, or proxy through your own backend.

A honeypot field quietly discards bot submissions.

---

## 7. Deployment to free static hosting

`npm run build` produces a fully static site in
`dist/wedding-invitation/browser` (fonts, images and audio are local — there are
no runtime CDN dependencies).

### Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist/wedding-invitation/browser
```

`netlify.toml` is already included (build command + SPA redirect). You can also
drag-and-drop the folder onto <https://app.netlify.com/drop>.

### Vercel

```bash
npx vercel --prod
```

`vercel.json` is included. Framework preset: **Angular**, output directory
`dist/wedding-invitation/browser`.

### Cloudflare Pages

Build command `npm run build`, output directory `dist/wedding-invitation/browser`.

### GitHub Pages

A project page is served from `/<repository>/`, so build with the matching base:

```bash
npm run build -- --base-href=/your-repo-name/
# then publish dist/wedding-invitation/browser (e.g. with gh-pages)
```

For a user/organisation page (`username.github.io`) the default `/` base works.
The app is a single page with in-page anchors, so no rewrite rules are required;
`netlify.toml` / `vercel.json` simply redirect unknown paths back to `index.html`
for safety.

---

## 8. Performance, accessibility & motion

* Zoneless-friendly **OnPush** components; the countdown is the only timer and it
  is cleared in `DestroyRef.onDestroy()` (and stops for good after the wedding).
* Fonts are self-hosted WOFF2 and preloaded; no Google Fonts request at runtime.
* Photographs ship as WebP at two widths with `srcset` + `sizes`, `loading="lazy"`,
  `decoding="async"` and explicit `width`/`height` — no layout shift.
* Sakura petals are 14 pure-CSS elements (`transform`/`opacity` only) and are
  removed entirely when `prefers-reduced-motion: reduce` is set; the cover
  animation, reveals and hovers all respect it too.
* Artwork is inline SVG built from a handful of paths — sharp at any size and
  cheap to paint.
* All decorative layers are `pointer-events: none`, so petals never block buttons.
* Verified with axe-core (WCAG 2.1 A/AA rules): **0 violations** on the cover and
  on the full page. Keyboard support: skip link, focus-visible rings, lightbox
  with ← → / Esc, focus returned to the triggering tile on close.

No performance score is claimed here — run Lighthouse against your own deployed
URL to measure it.

---

## 9. Commands

| Command | Description |
| --- | --- |
| `npm start` | dev server on `http://localhost:4200` |
| `npm run build` | production build (hashed assets, budgets enforced) |
| `npm run watch` | incremental development build |
| `npx tsc -p tsconfig.app.json --noEmit` | type-check everything without emitting |

---

## 10. Credits & licensing notes

* Code: yours to use for the wedding.
* Fonts: Cormorant Garamond, Moul and Noto Serif Khmer — SIL Open Font License,
  bundled locally in `public/fonts`.
* Photos: AI-generated placeholders (replace before publishing).
* `public/audio/wedding-theme.mp3`: an original synthesised instrumental loop
  created for this project — replace it with licensed music if you prefer.

---

## 11. The invitation card artwork

`public/images/frame/` holds the artwork derived from the reference painting:

| File | Purpose |
| --- | --- |
| `frame-1024.webp`, `frame-640.webp` | The card with the emblem lifted out (the paper behind it is rebuilt) |
| `emblem-1024.webp`, `emblem-640.webp` | The S & T emblem on transparency — animated on its own |
| `reference-1024.webp` | The untouched reference, used for the social-share preview |

* The art is raster, 1024 × 1536. It looks sharp up to ~640 CSS px wide on high-density
  screens; the card is capped at 580 px (cover) / 680 px (page) for that reason.
  For crisper results on large screens, supply a 2048 × 3072 export and add it to the `srcset`
  in `invitation-frame.ts`.
* **Changing the initials:** the “S & T” is painted into `emblem-*.webp`. To use other
  initials, replace the emblem files (same pixel box: 387 × 390 at x 319, y 41 of the
  1024 × 1536 canvas) with a new emblem on transparency.
* The text safe-area is the ivory centre (23.5–76.5 % wide, 28.5–85 % tall). Keep new
  content inside it; sizes use container units (`cqw`) so text scales with the card.
* Opening sequence: card opens outward → emblem fades/scales in → text rises → a faint
  gold sheen crosses the emblem every ~9 s. All of it (and the petals) is disabled by
  `prefers-reduced-motion`.

---

## 12. The inside invitation (after “Open Invitation”)

`features/invitation` is a traditional Khmer card built from real layers — no full-page image:

| Layer | Source |
| --- | --- |
| Kbach Khmer gable crest (spire, flame leaves, scrolling vines, rosette) | `shared/components/kbach-sprite` → `#k-pediment` |
| Gold vine rails down both sides | `#k-tile` pattern (same sprite) |
| Rumduol (ផ្ការំដួល) sprays at the four corners and sides | `public/images/ornaments/rumduol-*.svg` |
| Angkor Wat arches, lotus and lower kbach centrepiece | `public/images/ornaments/kbach-foot.svg` (right lotus mirrored in CSS) |
| S & T emblem on cream paper | `public/images/frame/emblem-paper-*.webp` |
| Paper texture | `public/images/ornaments/khmer-paper.svg` |

* The Kbach sprite is **generated**: edit `tools/gen_kbach_sprite.py`, then run
  `python3 tools/gen_kbach_sprite.py`. The artwork is original, inspired by the structure of
  Khmer temple gables (central spire, tiered flame leaves, scrolls, rosette).
* All text comes from `core/data/wedding.config.ts` (names, Khmer names, families, date,
  times, venue, address, programme, story, RSVP deadline).
* The opening animation starts when `.page.is-open` is applied, so it plays as the page fades in.
  `prefers-reduced-motion` disables it.
* Rumduol colours: the real flower is cream-yellow; the artwork is pink as requested.

---

## 13. Two languages — English / ខ្មែរ

A fixed **EN | ខ្មែរ** switch (top-right) changes the whole site live. The choice is remembered on the
guest's device, and a link can open in Khmer directly: `https://your-site/?lang=km`.

| What | Where to edit |
| --- | --- |
| Wedding content in English (names, venue, programme, messages…) | `core/data/wedding.config.ts` |
| The same content in Khmer | `core/data/wedding.km.ts` — same shape; anything left out falls back to English; `schedule` and `gallery` are matched **by position** |
| Interface labels (headings, buttons, form text, countdown…) | `core/i18n/ui-strings.ts` — each key has `en` and `km` |
| Language logic (`t()`, Khmer digits, `<html lang>`) | `core/i18n/language.service.ts` |

* ⚠ The Khmer parents' names (វណ្ណៈ, ស្រីពៅ, ឫទ្ធី, ចិន្ដា), address and all other details are sample values —
  update them together with the English file.
* In Khmer mode, letter-spacing and uppercase styling are switched off (they break Khmer script) and
  line height is increased; see the end of `src/styles.scss`.
* The footer now uses the same S & T emblem as the cover (`images/frame/emblem-paper-*.webp`); the old
  vector `Monogram` component was removed.
