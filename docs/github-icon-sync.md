# GitHub-driven icon sync (Open-source and resilient visual assets)

## Why this exists

This site keeps icon assets static at build time, but the source now supports updating
them from public GitHub repositories with one command:

- `npm run icons:sync`

This does:

- Read `scripts/icon-sync.manifest.json`
- Fetch icon files through the GitHub Contents API
- Write assets to `public/icons/…` (no design system rewrite, no new packages)

## Open-source repos useful for visuals

- `simple-icons/simple-icons`: curated SVG icons for hundreds of products and platforms.
- `feathericons/feather`: light iconography style for UI systems.
- `eosrei/twemoji-color-font` (or equivalent): emoji and branded emoji sets if you need mood.
- `theatrejs/theatre` / `popmotion/popmotion`: composable motion patterns for premium interactions when you want richer timelines.
- `mattboldt/typed.js`: not visual by itself, but useful for "proof-first" animated text without heavy libraries.

## Safe usage model

- Keep `ICON_SYNC_ENABLED` off by default.
- Enable in CI only on manual or scheduled workflow when you can tolerate API/network variance.
- Keep local fallback assets in repo so the build still works if external sync is skipped.
- Use optional files (`required: false`) for non-breaking experiments.

## GitHub API call pattern used

The sync script calls:

```
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}
```

It expects the `content` field in the JSON response and decodes base64 directly into
`public/icons/...`.

When local token-less limits are enough, the call still works for public repos.
Adding `GITHUB_TOKEN` raises rate limits and reduces transient failures.

## Suggested workflow

1. Update `scripts/icon-sync.manifest.json` with repo/path/destination.
2. Run `npm run icons:sync` locally for quick verification.
3. Run deploy pipeline (build + `/gpts` route check) as usual.
