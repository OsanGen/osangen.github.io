# QC and release gate

## CogSec ship gate

- [ ] Content reads at 10% zoom.
- [ ] Body contrast meets 4.5:1 minimum.
- [ ] Overlay text <= 12 words.
- [ ] One accent lead per page.
- [ ] Accent area <= 15% visible area.
- [ ] No outer glow, no heavy gradients.
- [ ] Proof-first pattern present: Claim, Proof, Next step.

## Accessibility checks

- [ ] Semantic HTML and heading order
- [ ] Keyboard focus ring visible
- [ ] skip-to-content link present
- [ ] Reduced motion support
- [ ] External links include clear affordance in context

## GPT page checks

- [ ] `/gpts` route includes proof-first ordering (Claim -> Proof -> Links/Next step)
- [ ] 3 seeded cards render with valid proof fallback when links are missing
- [ ] Filter controls remain keyboard operable
- [ ] Empty state appears when no matches

## Build checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run icons:sync` (optional; only when icon manifest updates)
