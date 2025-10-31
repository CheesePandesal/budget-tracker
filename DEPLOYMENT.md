# Deployment Guide: Budget Tracker on Vercel

This guide will walk you through deploying your Budget Tracker application to Vercel, including environment variables setup and handling future updates.

## Prerequisites

- ✅ GitHub repository is already published
- ✅ Supabase project is set up
- ✅ Vercel account (create one at [vercel.com](https://vercel.com) if needed)

---

## Part 1: Initial Deployment to Vercel

### Step 1: Connect GitHub to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in (or create an account)
2. **Import Project**: Click on "Add New..." → "Project"
3. **Select Repository**: 
   - You'll see a list of your GitHub repositories
   - Find and click on `budget-tracker`
   - Click "Import"

### Step 2: Configure Project Settings

Vercel will automatically detect your Next.js project. On the configuration screen:

**Framework Preset**: 
- Should auto-detect as "Next.js" ✅

**Root Directory**: 
- Keep as `./` (default) ✅

**Build Command**: 
- Leave as `npm run build` (default) ✅

**Output Directory**: 
- Leave empty (Next.js handles this) ✅

**Install Command**: 
- Leave as `npm install` (default) ✅

### Step 3: Environment Variables (CRITICAL)

This is the most important step! You need to add your Supabase credentials:

1. **In the "Environment Variables" section**, click "Add New"
2. **Add these variables** (get them from your Supabase project settings):

   | Variable Name | Variable Value |
   |--------------|----------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

   **Where to find these values:**
   - Go to your Supabase Dashboard
   - Select your project
   - Go to Settings → API
   - Copy "Project URL" → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Select Environments**: 
   - Check all three: ☑️ Production, ☑️ Preview, ☑️ Development

4. **Save**: Click "Add" for each variable

### Step 4: Deploy

1. **Click "Deploy"** button at the bottom
2. **Wait for Build**: This takes 2-3 minutes
   - Vercel will install dependencies
   - Run the build process
   - Deploy your application

3. **Success!** 🎉
   - You'll see a deployment URL like: `budget-tracker-abc123.vercel.app`
   - Vercel automatically generates a custom domain

### Step 5: Optional - Custom Domain

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `budget-tracker.com`)
4. Follow the DNS configuration instructions

---

## Part 2: Handling Future Updates

Vercel has **automatic deployments** set up by default. Here's how updates work:

### What Happens During Deployment

When you push to GitHub, **Vercel automatically runs these commands**:

```bash
npm install       # Install dependencies
npm run build     # Build your Next.js app
```

Then it deploys the built files to production.

**So you DON'T need to run `npm run build` yourself before pushing** - Vercel does it for you!

However, running `npm run build` locally before pushing is a **best practice** because:
- ✅ Catch build errors locally (don't wait for Vercel)
- ✅ Save time (fix issues before deploying)
- ✅ Test production build locally

### How Automatic Deployments Work

**Vercel automatically deploys your app when:**

1. ✅ You push code to your GitHub repository
2. ✅ You merge a Pull Request
3. ✅ You create a new branch (creates a preview deployment)

### Workflow for Updates

1. **Make Changes Locally**
   ```bash
   # Make your code changes
   ```

2. **Test Locally**
   ```bash
   npm run dev          # Test in development mode
   npm run build        # Test production build (optional but recommended)
   npm run lint         # Check for errors
   ```
   
   ⚠️ **Important**: Running `npm run build` locally before pushing helps catch build errors early. Vercel will still run its own build when you deploy.

3. **Commit and Push to GitHub**
   ```bash
   git add .
   git commit -m "Add new feature: [describe changes]"
   git push origin main
   ```

4. **Vercel Automatically Deploys**
   - Vercel detects the push
   - Runs `npm run build` automatically (same as you did locally)
   - Deploys to production
   - You get notified via email
   - Takes 2-3 minutes total

4. **Check Deployment Status**
   - Go to your Vercel dashboard
   - See "Deployments" tab
   - Each deployment shows build status

### Preview Deployments

When you push to a **feature branch** (not `main`):
- Vercel creates a **preview deployment**
- You get a unique URL like: `budget-tracker-git-feature-branch.vercel.app`
- Great for testing before merging to production
- Perfect for code reviews

### Manual Deployment (Optional)

If you ever need to manually deploy:

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Find a previous deployment
5. Click the "..." menu → "Redeploy"

---

## Part 3: Adding/Changing Environment Variables

If you need to add or update environment variables after deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter variable name and value
5. Select which environments (Production, Preview, Development)
6. Click **Save**
7. **Important**: Click "Redeploy" to apply changes

---

## Part 4: Troubleshooting

### Build Fails

**Error**: "Environment variables not found"

**Solution**: 
- Double-check environment variables in Vercel settings
- Make sure variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix is included for client-side variables

**Error**: "Module not found"

**Solution**:
- Run `npm install` locally first
- Check `package.json` for correct dependencies
- Push `package-lock.json` to GitHub

### App Works Locally But Not on Vercel

**Common Causes**:
1. Missing environment variables
2. CORS issues with Supabase (check Supabase settings)
3. Build errors (check deployment logs in Vercel dashboard)

**Check Logs**:
1. Go to Vercel dashboard
2. Click on failed deployment
3. Scroll to "Build Logs" section
4. Look for error messages

### Supabase Connection Issues

**Check**:
1. Supabase project is active
2. Database is accessible (check Supabase Dashboard)
3. RLS (Row Level Security) policies allow public access if needed
4. API keys are correct in environment variables

---

## Part 5: Best Practices

### Development Workflow

```
┌─────────────────┐
│  Make Changes   │
│   (Locally)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Test Locally  │
│  npm run dev    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Push to GitHub  │
│  git push       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Auto    │
│    Deploys      │
└─────────────────┘
```

### Version Control Best Practices

1. **Always commit before pushing**
2. **Write descriptive commit messages**
3. **Use branches for features** (optional but recommended)
4. **Test locally before pushing**
5. **Keep sensitive data in environment variables**

### Monitoring

- Check Vercel dashboard regularly for deployment status
- Monitor Supabase dashboard for database usage
- Set up Vercel analytics for performance monitoring (optional)

---

## Quick Reference Commands

```bash
# Local Development
npm run dev          # Start dev server
npm run build        # Test production build
npm run lint         # Check for errors

# Git Workflow
git status           # Check changed files
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push origin main # Push to GitHub (triggers Vercel deploy)
```

---

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Status**: [vercel-status.com](https://www.vercel-status.com)

---

## Summary

✅ **Initial Setup**: Connect GitHub → Configure → Add Environment Variables → Deploy

✅ **Future Updates**: Just push to GitHub → Vercel deploys automatically

✅ **Environment Variables**: Add/update in Vercel Settings → Redeploy

✅ **Preview Deployments**: Push to feature branch → Get preview URL

Your app will now automatically deploy every time you push to GitHub! 🚀
