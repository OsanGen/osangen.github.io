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

## Use rules

- One accent token per scene, no stacked gradients.
- No yellow fills on large containers.
- No decorative noise that competes with text.
- Use INK outlines and COG_* only on small accents.
- Use `--accent-ink`, `--fog-subtle`, `--panel-strong`, `--stroke`, `--surface` for visual hierarchy.
