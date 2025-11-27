# Supabase CMS Configuration Progress

**Last Updated:** 2025-11-26
**Status:** Partially Automated - Manual Steps Required
**Agent:** webmaster-coordinator

---

## Executive Summary

This document tracks the Supabase CMS configuration for the IntelliCloud website. The setup has been partially automated using the Supabase CLI, with specific manual steps identified below.

**What's Been Prepared:**
- Database migration file created and ready to deploy
- Environment variable template created (.env.example)
- Google OAuth configuration documented in config.toml
- Admin user pre-configured in migration (hugo@intellicloud.com)
- CLI commands prepared for deployment

**What Requires Manual Action:**
- Supabase project creation/linkage
- Google OAuth credentials from Google Cloud Console
- Database migration push to remote
- Environment variable configuration
- Admin user verification

---

## Current Configuration State

### 1. Database Schema (READY)

**Migration File:** `C:/Users/hugo/claude/intellicloud-website/supabase/migrations/20251124030001_intellicloud_cms_setup.sql`

**Tables Created:**
- `ic_web_pages` - Bilingual page content (EN/FR)
- `ic_web_seo_meta` - SEO metadata for pages
- `ic_web_site_settings` - Global site configuration
- `ic_web_navigation` - Dynamic navigation menus
- `ic_web_media` - Media library assets
- `ic_web_admin_users` - Authorized admin users
- `ic_web_audit_log` - Change tracking for compliance

**Features:**
- Row Level Security (RLS) enabled on all tables
- Audit triggers for change tracking
- Auto-update timestamps on all tables
- Domain-restricted admin access (@intellicloud.com only)
- Helper function: `ic_web_is_intellicloud_admin()`

**Pre-configured Admin User:**
```sql
INSERT INTO ic_web_admin_users (email, domain, full_name, role, is_active) VALUES
    ('hugo@intellicloud.com', 'intellicloud.com', 'Hugo Bouchard', 'super_admin', TRUE);
```

### 2. Supabase Client Library (CONFIGURED)

**File:** `C:/Users/hugo/claude/intellicloud-website/src/lib/supabaseClient.js`

**Configuration:**
- Supabase JS SDK v2.84.0 installed
- Client configured to read from environment variables
- Auth helpers implemented for Google OAuth
- Database query helpers for CMS operations
- Domain restriction: Only @intellicloud.com users

**Auth Flow:**
```javascript
authHelpers.signInWithGoogle() // Initiates Google OAuth
authHelpers.checkAdminAccess(user) // Verifies ic_web_admin_users table
authHelpers.isIntelliCloudUser(user) // Validates @intellicloud.com domain
```

### 3. Environment Variables (TEMPLATE CREATED)

**File:** `C:/Users/hugo/claude/intellicloud-website/.env.example`

**Required Variables:**
```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-oauth-client-id
SUPABASE_AUTH_GOOGLE_SECRET_KEY=your-google-oauth-client-secret
SUPABASE_ACCESS_TOKEN=your-supabase-access-token
```

### 4. Google OAuth Configuration (DOCUMENTED IN CONFIG)

**File:** `C:/Users/hugo/claude/intellicloud-website/supabase/config.toml`

**Current Settings:**
```toml
[auth.external.apple]
enabled = false
```

**Required Configuration:**
The config.toml needs Google OAuth section enabled. See Manual Steps below.

### 5. Admin Dashboard (READY)

**File:** `C:/Users/hugo/claude/intellicloud-website/admin.html`

**Integration:**
- Admin script: `src/scripts/admin.js`
- Connects to Supabase using environment variables
- Implements Google OAuth sign-in flow
- Restricts access to @intellicloud.com domain

---

## CLI Tools Status

### Supabase CLI

**Version:** v2.54.11 (installed)
**Latest:** v2.62.10 (update available)
**Update Command:**
```bash
scoop update supabase  # Windows with Scoop
# OR
npm install -g supabase  # Via npm
```

**Key Commands Available:**
- `supabase login` - Authenticate with access token
- `supabase link` - Link to remote project
- `supabase db push` - Deploy migrations to remote
- `supabase db reset` - Reset local database
- `supabase secrets set` - Configure environment secrets
- `supabase projects list` - List available projects

### Docker

**Status:** NOT INSTALLED
**Impact:** Cannot run local Supabase instance (`supabase start` won't work)
**Workaround:** Use remote Supabase project directly

---

## Manual Steps Required

### STEP 1: Create/Access Supabase Project

**Option A: Create New Project**
1. Go to https://app.supabase.com/
2. Click "New Project"
3. Choose organization (or create new one)
4. Project name: `intellicloud-cms` (or preferred name)
5. Database password: Generate strong password (save securely)
6. Region: Select closest to users (e.g., US East, Canada)
7. Click "Create new project" (takes ~2 minutes)

**Option B: Use Existing Project**
1. Navigate to https://app.supabase.com/
2. Select your existing IntelliCloud project

**Get Project Credentials:**
1. Go to Project Settings → API
2. Copy "Project URL" (e.g., https://xyz123.supabase.co)
3. Copy "anon public" key (safe to expose client-side)
4. Save these for .env file

**Reference:** [Supabase Project Setup](https://supabase.com/docs/guides/getting-started)

---

### STEP 2: Generate Supabase Access Token

**Why:** Required for CLI authentication (`supabase login`, `supabase link`, `supabase db push`)

**Steps:**
1. Go to https://app.supabase.com/account/tokens
2. Click "Generate New Token"
3. Name: "IntelliCloud Website CLI"
4. Click "Generate Token"
5. Copy the token immediately (only shown once)
6. Save in .env file as `SUPABASE_ACCESS_TOKEN`

**Authenticate CLI:**
```bash
# Option 1: Login with token
supabase login --token YOUR_ACCESS_TOKEN

# Option 2: Set environment variable
export SUPABASE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN  # Linux/Mac
set SUPABASE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN     # Windows CMD
$env:SUPABASE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"  # Windows PowerShell
```

**Reference:** [Supabase Access Tokens](https://supabase.com/docs/guides/local-development/cli/managing-access-tokens)

---

### STEP 3: Link Local Project to Remote

**Command:**
```bash
cd C:/Users/hugo/claude/intellicloud-website
supabase link --project-ref YOUR_PROJECT_REF
```

**Get Project Reference:**
1. Go to Project Settings → General
2. Find "Reference ID" (e.g., `xyzabcdef123`)
3. Use in link command above

**Verify Link:**
```bash
supabase status
```

**Reference:** [Linking Projects](https://supabase.com/docs/guides/local-development/cli/linking-and-connecting)

---

### STEP 4: Configure Google OAuth

**Part A: Google Cloud Console Setup**

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Name: "IntelliCloud Website - Supabase Auth"
7. Authorized JavaScript origins:
   ```
   https://YOUR_PROJECT_REF.supabase.co
   http://localhost:5173
   ```
8. Authorized redirect URIs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```
9. Click "Create"
10. Copy Client ID and Client Secret (save securely)

**Part B: Configure Supabase Dashboard**

1. Go to https://app.supabase.com/project/YOUR_PROJECT_REF/auth/providers
2. Find "Google" in the providers list
3. Click to expand
4. Toggle "Enable Sign in with Google"
5. Paste Client ID
6. Paste Client Secret
7. (Optional) Add "Authorized Client IDs" if needed
8. Click "Save"

**Part C: Update Local Config (Optional for Local Dev)**

Edit `C:/Users/hugo/claude/intellicloud-website/supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GOOGLE_SECRET_KEY)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
skip_nonce_check = true  # For local development only
```

**References:**
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Bootstrapped Supabase Google OAuth](https://bootstrapped.app/guide/how-to-configure-supabase-authentication-with-google-oauth)

---

### STEP 5: Create .env File

**Command:**
```bash
cd C:/Users/hugo/claude/intellicloud-website
copy .env.example .env   # Windows
# OR
cp .env.example .env     # Linux/Mac
```

**Edit .env with your actual values:**
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR_ACTUAL_ANON_KEY
SUPABASE_AUTH_GOOGLE_CLIENT_ID=123456789-abc...YOUR_CLIENT_ID
SUPABASE_AUTH_GOOGLE_SECRET_KEY=GOCSPX-...YOUR_CLIENT_SECRET
SUPABASE_ACCESS_TOKEN=sbp_...YOUR_ACCESS_TOKEN
```

**Security Note:**
- .env is already in .gitignore (verified)
- Never commit .env to Git
- Keep credentials secure

---

### STEP 6: Push Database Migration

**Dry Run First (Recommended):**
```bash
supabase db push --dry-run
```

**Expected Output:**
```
Would apply migration: 20251124030001_intellicloud_cms_setup.sql
```

**Apply Migration:**
```bash
supabase db push
```

**What This Does:**
- Creates all 7 CMS tables
- Enables Row Level Security
- Creates audit triggers
- Inserts default site settings
- Adds hugo@intellicloud.com as super_admin

**Verify in Supabase Dashboard:**
1. Go to https://app.supabase.com/project/YOUR_PROJECT_REF/editor
2. Check "Table Editor" - should see ic_web_* tables
3. View ic_web_admin_users - should see Hugo's entry

**Reference:** [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)

---

### STEP 7: Verify Admin User

**Option A: Via Supabase Dashboard**
1. Go to Table Editor
2. Select `ic_web_admin_users` table
3. Verify row exists:
   - Email: hugo@intellicloud.com
   - Domain: intellicloud.com
   - Role: super_admin
   - Is Active: true

**Option B: Via SQL Editor**
```sql
SELECT * FROM ic_web_admin_users WHERE email = 'hugo@intellicloud.com';
```

**Add Additional Admin Users (Optional):**
```sql
INSERT INTO ic_web_admin_users (email, domain, full_name, role, is_active)
VALUES
    ('admin@intellicloud.com', 'intellicloud.com', 'Admin User', 'admin', TRUE);
```

---

### STEP 8: Test Authentication Flow

**Local Development:**
```bash
npm run dev
```

**Test Steps:**
1. Navigate to http://localhost:5173/admin.html
2. Click "Sign in with Google"
3. Authenticate with @intellicloud.com account
4. Should redirect back to admin dashboard
5. Verify access granted (not denied)

**Production Testing:**
```bash
npm run build
firebase deploy --only hosting:site-web-ic
```

**Test on Live URL:**
1. Go to https://site-web-ic.web.app/admin.html
2. Complete OAuth flow
3. Verify CMS dashboard loads

**Troubleshooting:**
- If OAuth fails: Check redirect URIs in Google Console
- If access denied: Verify user in ic_web_admin_users table
- If connection fails: Check VITE_SUPABASE_URL and ANON_KEY

---

## CLI Command Reference

### Authentication Commands
```bash
# Login with access token
supabase login --token YOUR_ACCESS_TOKEN

# Verify login status
supabase projects list

# Logout
supabase logout
```

### Project Linking
```bash
# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF

# Check link status
supabase status

# Unlink project
supabase unlink
```

### Database Operations
```bash
# View migration status
supabase db migrations list

# Dry run migration push
supabase db push --dry-run

# Push migrations to remote
supabase db push

# Pull remote schema to local
supabase db pull

# Reset local database (if Docker available)
supabase db reset
```

### Secrets Management
```bash
# Set a secret on remote project
supabase secrets set KEY=VALUE --project-ref YOUR_PROJECT_REF

# List all secrets
supabase secrets list --project-ref YOUR_PROJECT_REF

# Unset a secret
supabase secrets unset KEY --project-ref YOUR_PROJECT_REF
```

**Note:** Secrets are for Edge Functions, not auth providers. OAuth credentials go in Supabase Dashboard.

---

## Troubleshooting Guide

### Issue: "Access token not provided"

**Solution:**
```bash
# Set token as environment variable
export SUPABASE_ACCESS_TOKEN=YOUR_TOKEN  # Linux/Mac
set SUPABASE_ACCESS_TOKEN=YOUR_TOKEN     # Windows CMD
$env:SUPABASE_ACCESS_TOKEN="YOUR_TOKEN"  # PowerShell

# OR login directly
supabase login --token YOUR_TOKEN
```

### Issue: "Project not linked"

**Solution:**
```bash
# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Verify with
supabase status
```

### Issue: Google OAuth "redirect_uri_mismatch"

**Solution:**
1. Check Google Cloud Console → Credentials
2. Verify redirect URIs include:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - `http://localhost:54321/auth/v1/callback` (local dev)
3. No trailing slashes
4. Exact match required

### Issue: Admin user can't access dashboard

**Checklist:**
1. User email ends with @intellicloud.com
2. User exists in ic_web_admin_users table
3. is_active = TRUE
4. OAuth completed successfully (check browser console)

**Query to verify:**
```sql
SELECT * FROM ic_web_admin_users WHERE email = 'YOUR_EMAIL@intellicloud.com';
```

### Issue: Environment variables not loading

**Solution:**
1. Verify .env file exists in project root
2. Check variable names start with VITE_ (for client-side)
3. Restart dev server after .env changes
4. For Vite: `import.meta.env.VITE_SUPABASE_URL`

### Issue: Migration push fails

**Common Causes:**
1. Not linked to project (`supabase link`)
2. Not authenticated (`supabase login`)
3. Migration already applied (check remote history)
4. Syntax errors in SQL

**Debug:**
```bash
supabase db push --debug
```

---

## Security Best Practices

### Environment Variables
- Never commit .env to Git (already in .gitignore)
- Use different credentials for dev/staging/production
- Rotate tokens periodically

### Row Level Security
- All tables have RLS enabled
- Public read access for published content only
- Admin write access restricted to @intellicloud.com
- Audit log tracks all changes

### OAuth Configuration
- Domain restriction: hd: 'intellicloud.com'
- Only authorized domains can authenticate
- Regular review of ic_web_admin_users table

### Database Access
- Use anon key for client-side (public)
- Never expose service_role key client-side
- Keep database password secure

---

## Next Steps After Configuration

### 1. Content Population
- Create initial pages via CMS dashboard
- Set up navigation menus
- Configure site settings

### 2. Media Management
- Configure storage bucket for images
- Set up upload permissions
- Define file size limits

### 3. SEO Configuration
- Add meta tags for key pages
- Configure structured data
- Set canonical URLs

### 4. Testing
- Test bilingual content (EN/FR)
- Verify mobile responsiveness
- Check performance metrics

### 5. Monitoring
- Set up error logging
- Monitor audit logs
- Track user activity

---

## Automation Limitations

### What CLI Cannot Automate

1. **Supabase Project Creation**
   - Requires human decision on region, pricing tier
   - Must accept terms of service
   - Credit card for paid plans

2. **Google OAuth Credentials**
   - Requires Google Cloud Console access
   - Human verification may be needed
   - Organization policies may apply

3. **Initial .env Configuration**
   - Credentials must be manually copied
   - Security risk to automate credential storage
   - User must verify correct values

4. **OAuth Provider Dashboard Config**
   - Supabase Dashboard requires UI interaction
   - No CLI command to enable OAuth providers
   - Must be done via web interface

### What Was Automated

1. Migration file creation with best practices
2. Database schema with RLS and triggers
3. Environment variable template
4. CLI command documentation
5. Supabase client library integration
6. Admin user pre-configuration in migration

---

## File Inventory

### Created/Modified Files

1. `C:/Users/hugo/claude/intellicloud-website/supabase/migrations/20251124030001_intellicloud_cms_setup.sql`
   - Database schema migration
   - 321 lines, 7 tables, RLS policies, triggers

2. `C:/Users/hugo/claude/intellicloud-website/.env.example`
   - Environment variable template
   - 5 required variables documented

3. `C:/Users/hugo/claude/intellicloud-website/SUPABASE_CONFIG_PROGRESS.md`
   - This documentation file
   - Complete setup guide

4. `C:/Users/hugo/claude/intellicloud-website/supabase/config.toml`
   - Existing Supabase CLI config
   - Ready for Google OAuth addition

5. `C:/Users/hugo/claude/intellicloud-website/src/lib/supabaseClient.js`
   - Existing Supabase client library
   - Auth and database helpers

6. `C:/Users/hugo/claude/intellicloud-website/admin.html`
   - Existing admin dashboard entry point

---

## Additional Resources

### Official Documentation
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [Database Migrations Guide](https://supabase.com/docs/guides/deployment/database-migrations)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Community Guides
- [Bootstrapped Supabase Google OAuth](https://bootstrapped.app/guide/how-to-configure-supabase-authentication-with-google-oauth)
- [Local Supabase Google Auth](https://dev.to/thatanjan/how-to-add-google-oauth-in-a-local-supabase-project-3hl3)

### IntelliCloud Project Files
- [CLAUDE.md](C:/Users/hugo/claude/intellicloud-website/CLAUDE.md) - Development guide
- [README.md](C:/Users/hugo/claude/intellicloud-website/README.md) - Project overview
- [DESIGN-SYSTEM.md](C:/Users/hugo/claude/intellicloud-website/docs/DESIGN-SYSTEM.md) - Design tokens

---

## Quick Start Checklist

Use this checklist to complete the configuration:

- [ ] **Step 1:** Create/access Supabase project
- [ ] **Step 2:** Generate Supabase access token
- [ ] **Step 3:** Link local project to remote
- [ ] **Step 4:** Configure Google OAuth (Google Console + Supabase Dashboard)
- [ ] **Step 5:** Create .env file with credentials
- [ ] **Step 6:** Push database migration (`supabase db push`)
- [ ] **Step 7:** Verify admin user in ic_web_admin_users table
- [ ] **Step 8:** Test authentication flow (local and production)

**Estimated Time:** 30-45 minutes

---

## Support

For questions or issues:
1. Check Troubleshooting Guide above
2. Review official Supabase documentation
3. Consult webmaster-coordinator agent
4. Contact Hugo Bouchard (hugo@intellicloud.com)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-26
**Next Review:** After successful deployment
