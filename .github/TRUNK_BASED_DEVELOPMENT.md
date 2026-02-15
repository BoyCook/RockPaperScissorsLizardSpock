# Trunk-Based Development Workflow

This project follows **Trunk-Based Development (TBD)** - a source control branching model where developers work directly on a single branch called the "trunk" (`master` in our case).

## Core Principles

### 1. Work Directly on Master
- All development happens on `master` branch
- No long-lived feature branches
- Commit frequently (multiple times per day)

### 2. Small, Incremental Changes
- Break work into small chunks
- Each commit should be deployable
- Use feature flags for incomplete features

### 3. Continuous Integration
- CI runs on every push to master
- Tests must be fast (<10 minutes)
- Failed CI = immediate fix or revert

### 4. Continuous Deployment
- Every commit that passes CI goes to production
- Fast feedback from real users
- Quick rollback if issues arise

## Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin master

# 2. Make changes (small, focused)
# Edit files...

# 3. Commit directly to master
git add .
git commit -m "Add move selection component"

# 4. Push to master
git push origin master

# 5. CI runs automatically
# - Lint, type-check, tests
# - If pass → auto-deploy to production
```

### Making Larger Changes

For larger changes, use **feature flags** instead of branches:

```typescript
// features.ts
export const ENABLE_MULTIPLAYER = process.env.NEXT_PUBLIC_ENABLE_MULTIPLAYER === 'true';

// In component
if (ENABLE_MULTIPLAYER) {
  return <MultiplayerGame />;
}
return <ComingSoon />;
```

This allows:
- Incomplete features in production (hidden)
- Incremental development on master
- Easy rollback via environment variable

### Emergency Fixes

If CI catches a breaking change:

```bash
# Option 1: Quick fix
git commit -m "Fix broken test"
git push

# Option 2: Revert
git revert HEAD
git push
```

### Creating Backup Branches

Before major refactoring, create a backup:

```bash
# Create backup branch (like we did with 'legacy')
git branch backup-before-refactor
git push origin backup-before-refactor

# Continue working on master
```

## Why TBD?

### Benefits
- ✅ **Faster feedback**: Every change tested and deployed immediately
- ✅ **Simpler workflow**: No branch management overhead
- ✅ **Less merge conflicts**: Everyone works on same codebase
- ✅ **Better collaboration**: Changes visible to all immediately
- ✅ **Deployment confidence**: Practice deploying constantly

### Compared to Git Flow
| Aspect | TBD | Git Flow |
|--------|-----|----------|
| Branches | 1 (master) | Many (feature, develop, release) |
| Merge conflicts | Rare | Common |
| Deploy frequency | Every commit | Weekly/sprint |
| Feedback speed | Minutes | Days/weeks |
| Learning curve | Low | High |

## Requirements for TBD

### Must Have
1. ✅ Fast, reliable CI (<10 min)
2. ✅ Good test coverage
3. ✅ Automated deployment
4. ✅ Fast rollback capability
5. ✅ Feature flags for incomplete work

### Team Requirements
- Small teams (1-10 developers)
- High trust and communication
- Discipline to commit frequently
- Willingness to fix broken builds immediately

## CI/CD Pipeline

### On Every Push to Master

```
Push to master
    ↓
Run CI (parallel)
├── Lint
├── Type Check
├── Unit Tests
└── Build
    ↓
✅ All pass
    ↓
Deploy to Production
    ↓
Run E2E Tests
    ↓
Monitor for errors
```

### If CI Fails

```
❌ CI Failed
    ↓
Notification sent
    ↓
Developer fixes immediately
    ↓
Push fix to master
```

## Best Practices

### ✅ Do
- Commit multiple times per day
- Keep commits small and focused
- Run tests locally before pushing
- Fix broken builds immediately
- Use feature flags for WIP features
- Deploy during business hours (for fast rollback)

### ❌ Don't
- Don't let CI stay broken
- Don't push untested code
- Don't push at 5pm on Friday
- Don't create feature branches
- Don't merge PRs (there are none!)
- Don't batch changes for "big releases"

## Monitoring

After each deployment, monitor:
- Application logs
- Error rates
- Performance metrics
- User reports

Use Vercel Analytics or similar for real-time monitoring.

## Rollback Strategy

If a deployment causes issues:

### 1. Quick Revert
```bash
git revert HEAD
git push
```

### 2. Vercel Instant Rollback
```bash
vercel rollback
```

Or via Vercel dashboard: Deployments → Previous deployment → Promote to Production

## FAQ

**Q: What if I'm in the middle of a large change?**
A: Use feature flags or "dark launch" - code is deployed but not accessible to users.

**Q: What about code review?**
A: Review happens before commit (pair programming) or after (async review of commits). Fix issues in follow-up commits.

**Q: What if I break production?**
A: Fast rollback via revert or Vercel instant rollback. Learn from it, add tests to prevent it.

**Q: Can contributors use PRs?**
A: For external contributors, yes. But maintainers should merge quickly and continue on master.

**Q: How do we handle releases?**
A: Every commit is a release. Use semantic versioning tags for milestones: `git tag v1.2.3`

## Learn More

- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [Google's Engineering Practices](https://google.github.io/eng-practices/)
- [Continuous Delivery](https://continuousdelivery.com/)
