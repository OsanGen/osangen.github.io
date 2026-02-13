# Visual Tokens

## CogSec Pastel palette

- `WHITE`: default background
- `INK`: default text and borders
- `FOG`: soft panels and structure
- `COG_YELLOW`: micro accent only
- `COG_BLUE`: micro accent only
- `COG_MINT`: micro accent only
- `COG_PINK`: micro accent only

Safe defaults used in this repo:
- `WHITE = #ffffff`
- `INK = #12131a`
- `FOG = #f4f6fb`
- `COG_YELLOW = #e6c36f`
- `COG_BLUE = #5d79ff`
- `COG_MINT = #53bfbf`
- `COG_PINK = #df6f95`

The final values should be replaced from official CogSec reference assets.

## Hard visual locks

- Proof-first at 10% zoom.
- Contrast >= 4.5:1 for body and critical UI edges.
- Overlay headline/callout text <= 12 words.
- One accent lead per scene.
- Accent area <= 10-15% of visible area.
- White dominates all layouts.
- No outer glows, no heavy gradients.
- Shadows only subtle soft UI shadow.

## Token role matrix

- `--accent-ink`: heading scale, labels, command rails, and any non-urgent text emphasis.
- `--fog-subtle`: breathable neutral surface fill for low-contrast blocks.
- `--panel-strong`: active filters, selected chips, and command rail states.
- `--stroke`: all card/section boundaries and thin dividers.
- `--surface`: default page shells and content surfaces.
- `--surface-panel`: elevated panels with high contrast borders.
- `--surface-dim`: muted secondary surfaces for metadata and proof rails.
- `--cog-brain`: accent token for Oscar branding.
- `--scene-accent`: single per-section accent signal, never used on multiple cards in one scene.

## Use rules

- One accent token per scene, no stacked gradients.
- No yellow fills on large containers.
- No decorative noise that competes with text.
- Use INK outlines and COG_* only on small accents.
- Use `--accent-ink`, `--fog-subtle`, `--panel-strong`, `--stroke`, `--surface` for visual hierarchy.
