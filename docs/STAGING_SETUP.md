# Staging Environment Setup

## Overview

Interview Alpha now has a separate staging environment for testing before production releases.

**Branch Structure:**
- `main` → production (interviewalpha.ai)
- `staging` → test environment (staging.interviewalpha.ai)
- Feature branches → off `staging`, merged to `staging` first, then `main`

---

## Environment Indicator

A banner appears on local and staging:
- **Green** (🛠 LOCAL DEVELOPMENT) — localhost:3000
- **Orange-Red** (⚠️ STAGING ENVIRONMENT) — staging.interviewalpha.ai
- **Hidden** — production (no banner shown)

This ensures you always know which environment you're on.

---

## Development Scripts

```bash
# Local development (localhost:3000)
npm run dev

# Staging environment build
npm run dev:staging

# Production build
npm run build:prod

# Staging-specific build
npm run build:staging
```

---

## Workflow

### For New Features/Fixes

1. **Create feature branch off staging:**
   ```bash
   git checkout staging
   git checkout -b feature/my-feature
   ```

2. **Make changes and test locally:**
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

3. **Push to origin:**
   ```bash
   git add -A
   git commit -m "Describe your changes"
   git push origin feature/my-feature
   ```

4. **Merge into staging (test environment):**
   ```bash
   git checkout staging
   git merge feature/my-feature
   git push origin staging
   ```

5. **Test on staging URL** (once deployed to staging.interviewalpha.ai)

6. **Merge to main (production):**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```

---

## Database Setup

### For Staging Environment

If you need a separate Supabase project for staging:

1. Create new Supabase project: "interviewalpha-staging"
2. Export production schema:
   ```bash
   supabase db dump --schema-only > schema.sql
   ```
3. Apply to staging via Supabase SQL editor
4. Add staging credentials to `.env.staging` (NOT committed to git)

### Environment Variables

**`.env.local`** (local development):
```
VITE_APP_ENV=development
VITE_SUPABASE_URL=your_local_supabase_url
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

**`.env.staging`** (staging — NOT committed):
```
VITE_APP_ENV=staging
VITE_SUPABASE_URL=your_staging_supabase_url
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
```

**`.env.production`** (production — set in Vercel):
```
VITE_APP_ENV=production
VITE_SUPABASE_URL=your_prod_supabase_url
VITE_SUPABASE_ANON_KEY=your_prod_anon_key
```

---

## Vercel Deployment

### Automatic Preview URLs

Vercel auto-creates preview URLs for each branch:
- `staging` branch → `https://interviewalpha-git-staging-*.vercel.app`

To use a custom domain (`staging.interviewalpha.ai`):

1. Go to **Vercel Dashboard** → **Settings** → **Domains**
2. Add `staging.interviewalpha.ai`
3. Select the `staging` branch
4. Set environment variables for staging under **Settings → Environment Variables → Preview**

### Setting Environment Variables in Vercel

For each environment, set:
```
VITE_SUPABASE_URL = (staging/prod URL)
VITE_SUPABASE_ANON_KEY = (staging/prod key)
VITE_APP_ENV = staging | production
```

---

## Testing Checklist

Before merging staging → main:

- [ ] All features work on staging.interviewalpha.ai
- [ ] No console errors or warnings
- [ ] Device tracking works (check admin dashboard)
- [ ] Payment/subscription flows work
- [ ] Resume tools functional
- [ ] No data leaks from other environments
- [ ] Mobile responsive tested
- [ ] Performance acceptable

---

## Troubleshooting

**EnvBanner not showing?**
- Check `import.meta.env.VITE_APP_ENV` in browser console
- Verify `vite.config.js` has the define block
- Rebuild: `npm run dev:staging`

**Staging branch not deploying?**
- Verify staging branch exists on GitHub: `git branch -r`
- Check Vercel project settings for branch configuration
- Ensure environment variables are set in Vercel for Preview

**Database sync issues?**
- Export fresh schema: `supabase db dump --schema-only`
- Re-apply to staging database
- Verify migrations are up-to-date

---

## Key Files

- `src/components/EnvBanner.jsx` — Environment indicator component
- `vite.config.js` — Environment variable definition
- `package.json` — Build scripts for each environment
- `.env.local`, `.env.staging`, `.env.production` — Environment configs (NOT committed)

---

## Future Improvements

- [ ] Add staging Supabase project setup documentation
- [ ] Automated staging deployment workflow (CI/CD)
- [ ] Database sync scripts between prod → staging
- [ ] Staging data anonymization script
- [ ] Staging-only test accounts
