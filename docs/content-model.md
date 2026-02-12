# Content Model

## profile.json

- `name`: string
- `location`: string
- `headline`: string
- `summary`: string[]
- `what_i_do`: string[]
- `how_i_work`: string[]
- `proof_selected`: array of `{ label: string, proof: string[] }`
- `experience`: array of org history entries
- `education`: array of education entries
- `links`: `{ linkedin, portfolio, youtube }`
- `skills`: string[]

## games.json

- `id`: string
- `title`: string
- `tagline`: string
- `concepts`: string[]
- `learn`: string[]
- `deployUrl`: string
- `repoUrl`: string
- `embed`: `{ preferred: 'iframe'|'link', aspectRatio: string, fallback: string }`

## modules.json

- `id`, `title`, `format`, `time`, `level`
- `topics`: string[]
- `proof`: string[]
- `links`: object of URLs
- `cta`: `{ label, href }`
- `status`: string
- `visualClass` optional: `title`, `steps[]`

## workshops.json

- `id`, `date`, `title`, `description`, `replayUrl`, `slidesUrl`, `tags[]`

## posts.json

- `id`, `date`, `title`, `summary`, `url`, `tags[]`, `proofLinks[]?`

## communities.json

- `id`, `name`, `type`, `fit[]`, `why[]`, `join` object

## booking.json

- `calendly.one_on_one`, `calendly.teach_private`, `calendly.teach_class`
- each has `{ label, url }`
- `note`: string
