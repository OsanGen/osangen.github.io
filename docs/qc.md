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

- [ ] `/gpts` route is directory mode (short card + one primary CTA per agent)
- [ ] No proof I/O blocks render on the `/gpts` listing
- [ ] `/gpts/[id]` route contains proof/how-to/limits detail content
- [ ] Listing links resolve safely (internal route or valid external URL)

## Layout anti-stretch checks

- [ ] No stretched pills or circular CTAs inside card grids
- [ ] Card grids keep natural card height (`align-items: start`) and avoid tallest-row dead space
- [ ] Nested surfaces (section shell + item card) use distinct backgrounds and borders
- [ ] Dense tag rows are compact and capped where appropriate (`maxItems` + overflow)

## Skim-first content checks

- [ ] About page remains a short snapshot (no full resume blocks)
- [ ] Resume page contains long-form experience/education
- [ ] Each page has one obvious primary CTA
- [ ] Header primary navigation remains capped to 5 items

## Build checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run icons:sync` (optional; only when icon manifest updates)
