# Decision Method

This project uses a 20-option evaluation protocol for major design or feature direction changes.

## Scoring categories and weights

- Proof-first clarity (30)
- Accessibility and cognitive load at 10% zoom (25)
- CogSec visual compliance (20)
- User path fit and learning efficiency (15)
- Build cost and maintenance effort (10)

## Scale
Each category is scored from 0 to 10. Total score is weighted:

`Total = C1*0.30 + C2*0.25 + C3*0.20 + C4*0.15 + C5*0.10`

## Run protocol
1. Generate 20 ideas for the decision.
2. Score each idea across all categories.
3. Rank all 20 ideas.
4. Keep top quartile (top 5 ideas).
5. Pick the highest-scoring idea from top quartile and proceed.
6. Record all results in `/docs/decision-log.md`.

## Ground rules
- One idea at a time.
- Keep score rows short and concrete.
- No aesthetic-only reasons without proof implication.
