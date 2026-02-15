# Claude Code Instructions

## GitHub Actions Debugging

**ALWAYS use `gh` CLI for debugging GitHub Actions:**

- Use `gh run list` to check recent workflow runs
- Use `gh run view <run-id>` to see details of a specific run
- Use `gh run view <run-id> --log` to view full logs
- Use `gh run view <run-id> --log-failed` to view only failed job logs
- Use `gh run watch <run-id>` to watch a run in progress

Never rely on manual inspection or guessing - always check actual run logs with gh.

## Workflow

- This project uses Trunk-Based Development (TBD)
- Work directly on master branch
- No PRs or feature branches
- Continuous deployment on every push to master

## Testing

**ALWAYS run tests before committing:**

- Run `npm run test:unit` before every commit
- Run `npm run lint` and Prettier checks before every commit
- If modifying user-facing features, run `npm run test:e2e` to verify end-to-end flows

Test configuration:
- Unit tests: `npm run test:unit` (Vitest)
- E2E tests: `npm run test:e2e` (Playwright)
- Vitest is configured to only run tests in `tests/unit/**/*.test.{ts,tsx}`
- Playwright runs tests in `tests/e2e/**/*.spec.ts`

**E2E Testing Options:**

- `npm run test:e2e` - Expects dev server already running on port 3000
- `npm run test:e2e:with-server` - Automatically starts and stops the dev server
- In CI, the server is automatically started by the webServer config

## Node Version

- Use Node.js 24.13.1 LTS (Krypton) as specified in .nvmrc
