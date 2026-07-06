/**
 * Generic flat-line UI icons (white bg + ink outline + one accent detail).
 * Kept separate from branded/product icons (e.g. per-GPT icons in gpts.json)
 * which intentionally use a different, richer visual style.
 *
 * validate-content.ts checks every path below against that flat-icon template,
 * so swapping one of these for a mismatched asset fails CI before it ships.
 */
export const HOME_ROUTE_ICONS = {
  games: '/icons/replay-slides.svg',
  workshops: '/icons/teaching-checklist.svg',
  visualClasses: '/icons/learn-catalog.svg',
  contribute: '/icons/contribute-network.svg',
} as const;
