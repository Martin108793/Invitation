/**
 * Procedural geometry for the Angkor Wat line-art used on the cover and in
 * the venue section.
 *
 * Everything is emitted as a couple of SVG path strings (instead of hundreds
 * of nodes) so the illustration stays sharp at any size and costs almost
 * nothing to render.
 */

export interface AngkorGeometry {
  silhouette: string;
  detail: string;
  reflection: string;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * One Khmer prasat (lotus-bud tower): stepped tiers with a small ledge on
 * each level, crowned by a tapering bud.
 */
function prasat(cx: number, baseY: number, halfW: number, height: number, tiers = 4): string {
  const bodyH = height * 0.74;
  const budH = height - bodyH;
  const tierH = bodyH / tiers;
  const shrink = halfW * 0.085;
  let d = `M${round(cx - halfW)} ${round(baseY)}`;

  // Left profile, rising tier by tier.
  for (let i = 0; i < tiers; i++) {
    const wOuter = halfW - shrink * i;
    const wInner = halfW - shrink * (i + 1);
    const yBase = baseY - tierH * i;
    d += `L${round(cx - wOuter)} ${round(yBase - tierH * 0.1)}`;
    d += `L${round(cx - wInner)} ${round(yBase - tierH * 0.42)}`;
    d += `L${round(cx - wInner)} ${round(yBase - tierH)}`;
  }

  const wTop = halfW - shrink * tiers;
  const yTop = baseY - bodyH;
  // Lotus-bud crown.
  d += `C${round(cx - wTop * 1.34)} ${round(yTop - budH * 0.3)} ${round(cx - wTop * 0.86)} ${round(yTop - budH * 0.66)} ${round(cx)} ${round(yTop - budH)}`;
  d += `C${round(cx + wTop * 0.86)} ${round(yTop - budH * 0.66)} ${round(cx + wTop * 1.34)} ${round(yTop - budH * 0.3)} ${round(cx + wTop)} ${round(yTop)}`;

  // Right profile, descending.
  for (let i = tiers - 1; i >= 0; i--) {
    const wOuter = halfW - shrink * i;
    const wInner = halfW - shrink * (i + 1);
    const yBase = baseY - tierH * i;
    d += `L${round(cx + wInner)} ${round(yBase - tierH)}`;
    d += `L${round(cx + wInner)} ${round(yBase - tierH * 0.42)}`;
    d += `L${round(cx + wOuter)} ${round(yBase - tierH * 0.1)}`;
  }

  return d + 'Z';
}

/** Horizontal ledge lines across a tower (drawn as thin detail strokes). */
function prasatTiers(cx: number, baseY: number, halfW: number, height: number, tiers = 4): string {
  const bodyH = height * 0.74;
  const tierH = bodyH / tiers;
  const shrink = halfW * 0.085;
  let d = '';
  for (let i = 1; i < tiers; i++) {
    const w = halfW - shrink * i;
    const y = baseY - tierH * i;
    d += `M${round(cx - w)} ${round(y)}L${round(cx + w)} ${round(y)}`;
  }
  return d;
}

export function angkorGeometry(): AngkorGeometry {
  const baseY = 232;
  const towers = [
    { cx: 452, w: 25, h: 196, tiers: 5 },
    { cx: 366, w: 18, h: 142, tiers: 4 },
    { cx: 538, w: 18, h: 142, tiers: 4 },
    { cx: 296, w: 14, h: 104, tiers: 4 },
    { cx: 608, w: 14, h: 104, tiers: 4 },
  ];

  // Temple terraces: three stacked platforms, widest at the bottom.
  const terraces = [
    { y: baseY, x0: 176, x1: 728, h: 16 },
    { y: baseY + 16, x0: 148, x1: 756, h: 18 },
    { y: baseY + 34, x0: 120, x1: 784, h: 22 },
  ];

  let silhouette = '';
  for (const t of towers) silhouette += prasat(t.cx, baseY, t.w, t.h, t.tiers);
  // Central sanctuary body beneath the towers.
  silhouette += `M392 ${baseY}L512 ${baseY}L512 ${baseY - 64}L392 ${baseY - 64}Z`;
  // Terrace platforms.
  for (const t of terraces) {
    silhouette += `M${t.x0} ${t.y}L${t.x1} ${t.y}L${t.x1} ${t.y + t.h}L${t.x0} ${t.y + t.h}Z`;
  }
  // Long gallery wings left and right of the sanctuary.
  silhouette += `M214 ${baseY}L392 ${baseY}L392 ${baseY - 46}L214 ${baseY - 46}Z`;
  silhouette += `M512 ${baseY}L690 ${baseY}L690 ${baseY - 46}L512 ${baseY - 46}Z`;

  // ── Detail strokes ─────────────────────────────────────
  let detail = '';
  for (const t of towers) detail += prasatTiers(t.cx, baseY, t.w, t.h, t.tiers);

  // Gallery columns + cornice.
  for (let x = 224; x <= 384; x += 20) detail += `M${x} ${baseY}L${x} ${baseY - 38}`;
  for (let x = 520; x <= 682; x += 20) detail += `M${x} ${baseY}L${x} ${baseY - 38}`;
  detail += `M214 ${baseY - 46}L690 ${baseY - 46}`;
  detail += `M214 ${baseY - 8}L690 ${baseY - 8}`;

  // Small pediments (gables) over the gallery entrances.
  for (const cx of [288, 340, 564, 616]) {
    detail += `M${cx - 17} ${baseY - 46}Q${cx} ${baseY - 78} ${cx + 17} ${baseY - 46}`;
    detail += `M${cx - 10} ${baseY - 46}Q${cx} ${baseY - 66} ${cx + 10} ${baseY - 46}`;
  }

  // Sanctuary doorway.
  detail += `M430 ${baseY}L430 ${baseY - 42}Q452 ${baseY - 62} 474 ${baseY - 42}L474 ${baseY}`;
  detail += `M436 ${baseY}L436 ${baseY - 40}Q452 ${baseY - 54} 468 ${baseY - 40}L468 ${baseY}`;

  // Terrace step lines.
  for (const t of terraces) {
    detail += `M${t.x0 + 8} ${t.y + t.h - 7}L${t.x1 - 8} ${t.y + t.h - 7}`;
  }

  // Reflected in the lotus pond (flipped & softened in CSS).
  const pondY = baseY + 56;
  const reflection =
    `translate(0 ${round(pondY * 2)}) scale(1 -1)`;

  return { silhouette, detail, reflection };
}
