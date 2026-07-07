# Hvitis.dev

Required node >=20 to run.

## Development

```bash
npm install
npx next dev
```

Then open http://localhost:3000 (the all-posts page is at `/blog`).

Note: `yarn dev` currently fails with `This package doesn't seem to be present in your lockfile` because `yarn.lock` is out of sync with `node_modules`. Until that's resolved, run Next directly via `npx next dev` (or `npm run dev`, which does the same) instead of `yarn dev`.
