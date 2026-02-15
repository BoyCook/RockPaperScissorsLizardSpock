# GitHub Actions Setup Guide

This document explains how to configure GitHub Actions for the Rock Paper Scissors Lizard Spock project.

## Required GitHub Secrets

To enable automated deployments and CI/CD, you need to configure the following secrets in your GitHub repository.

### Setting Up Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Vercel Deployment Secrets

These secrets are required for automated deployments to Vercel.

#### `VERCEL_TOKEN`
- **Description**: Vercel authentication token
- **How to get it**:
  1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
  2. Click "Create Token"
  3. Name it "GitHub Actions"
  4. Copy the token value

#### `VERCEL_ORG_ID`
- **Description**: Your Vercel organization/team ID
- **How to get it**:
  1. Install Vercel CLI: `npm i -g vercel`
  2. Run `vercel login`
  3. Run `vercel link` in your project directory
  4. Open `.vercel/project.json`
  5. Copy the `orgId` value

#### `VERCEL_PROJECT_ID`
- **Description**: Your Vercel project ID
- **How to get it**:
  1. Same as above (step 1-4)
  2. Copy the `projectId` value from `.vercel/project.json`

### Optional Secrets

#### `REDIS_URL` (for E2E tests)
- **Description**: Redis connection URL for testing
- **Example**: `redis://localhost:6379` or Upstash Redis URL

#### `REDIS_TOKEN` (if using Upstash)
- **Description**: Upstash Redis token
- **How to get it**: From your Upstash Redis dashboard

## Workflows

This project uses **Trunk-Based Development (TBD)** - all work happens directly on `master` with continuous deployment.

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: Every push to master

**Jobs**:
- **Lint**: Runs ESLint and Prettier
- **Type Check**: Validates TypeScript types
- **Test**: Runs unit tests with Vitest
- **Build**: Builds the Next.js application

**Status**: Runs on every commit to master

### 2. Deploy Production (`.github/workflows/deploy-production.yml`)

**Triggers**: Automatically after CI passes on master

**What it does**:
- Deploys to Vercel production
- Updates commit status
- Continuous deployment on every commit

**Requirements**: Vercel secrets configured

### 3. E2E Tests (`.github/workflows/e2e-tests.yml`)

**Triggers**: Every push to master, or manual trigger

**What it does**:
- Runs Playwright E2E tests
- Tests across multiple browsers
- Uploads test reports and videos on failure

## GitHub Environments

### Setting Up Environments

1. Go to **Settings** → **Environments**
2. Create one environment:
   - `production` - For production deployments

### Production Environment Protection (Optional)

For the `production` environment, you can optionally configure:
- **Wait timer**: Brief delay before deployment (e.g., 30 seconds)
- **Deployment branches**: Only `master`

**Note**: With TBD, we don't use required reviewers since code is committed directly to master. Reviews happen before commit, not via PRs.

## Branch Protection Rules (Optional)

Since we use Trunk-Based Development, branch protection is optional. If you want to enable CI checks:

1. Go to **Settings** → **Branches**
2. Add rule for `master`
3. Enable:
   - ✅ Require status checks to pass before pushing
     - Select: `lint`, `type-check`, `test`, `build`
   - ⚠️ **Do NOT** enable "Require pull request" - we push directly to master

## Vercel Project Setup

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**:
   Add these in Vercel project settings:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate-random-secret>
   REDIS_URL=<your-redis-url>
   REDIS_TOKEN=<your-redis-token>
   ```

4. **Custom Domain** (Optional):
   - Go to project settings → Domains
   - Add `rockpaperscissorslizardspock.co.uk`

## Testing GitHub Actions Locally

### Using `act` (GitHub Actions locally)

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run CI workflow locally
act push

# Run specific job
act -j lint
```

### Manual Testing

Before pushing, verify locally:

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Tests
npm run test:unit

# Build
npm run build

# E2E tests
npm run test:e2e
```

## Troubleshooting

### Workflow fails with "Resource not accessible by integration"
- Check that GitHub Actions is enabled in repository settings
- Verify the `GITHUB_TOKEN` has sufficient permissions

### Vercel deployment fails
- Verify all three Vercel secrets are set correctly
- Check that the Vercel project is linked to the correct repository
- Ensure environment variables are set in Vercel dashboard

### Tests fail in CI but pass locally
- Check Node.js version matches (20.x)
- Verify all dependencies are in `dependencies`, not `devDependencies`
- Check for environment-specific issues

### E2E tests timeout
- Increase timeout in `playwright.config.ts`
- Check if dev server starts correctly in CI
- Verify no port conflicts

## Monitoring

### Viewing Workflow Runs

1. Go to repository → **Actions** tab
2. Click on a workflow run to see details
3. Click on a job to see logs

### Notifications

- Failed workflows send email notifications to repository watchers
- Configure Slack notifications (optional):
  - Add GitHub app to your Slack workspace
  - Subscribe to repository notifications: `/github subscribe owner/repo`

## Cost Considerations

### GitHub Actions

- **Free tier**: 2,000 minutes/month for public repos, unlimited for public repos
- **Private repos**: 2,000 minutes/month, then $0.008/minute

### Vercel

- **Hobby plan**: Free
  - 100 deployments/day
  - Bandwidth: 100GB/month
  - Build time: 6,000 minutes/month
- **Pro plan**: $20/month per user
  - Unlimited deployments
  - More bandwidth and build time

## Next Steps

1. [ ] Configure GitHub secrets (Vercel)
2. [ ] Set up GitHub environments (preview, production)
3. [ ] Configure branch protection rules
4. [ ] Link Vercel project
5. [ ] Test workflows by creating a PR
6. [ ] Monitor first production deployment

---

For questions or issues, open an issue in the repository.
