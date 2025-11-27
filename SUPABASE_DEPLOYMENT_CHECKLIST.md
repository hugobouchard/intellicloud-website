# Supabase CMS Deployment Checklist

**Project:** IntelliCloud Website
**Date:** 2025-11-26
**Prepared by:** webmaster-coordinator agent

---

## Pre-Deployment Checklist

### Environment Setup

- [ ] Supabase account created (https://app.supabase.com/)
- [ ] Supabase project created
- [ ] Project region selected (closest to users)
- [ ] Database password saved securely
- [ ] Google Cloud Console project created/selected

### Credentials Gathered

- [ ] Supabase Project URL copied
- [ ] Supabase anon key copied
- [ ] Supabase access token generated
- [ ] Google OAuth Client ID created
- [ ] Google OAuth Client Secret saved

### File Setup

- [ ] `.env` file created from `.env.example`
- [ ] All environment variables filled in `.env`
- [ ] `.env` confirmed in `.gitignore` (already done)
- [ ] `dotenv` package installed: `npm install dotenv`

---

## Deployment Steps

### Phase 1: CLI Authentication

```bash
# Navigate to project
cd C:/Users/hugo/claude/intellicloud-website

# Login to Supabase CLI
supabase login --token YOUR_ACCESS_TOKEN

# Verify login
supabase projects list
```

- [ ] CLI authentication successful
- [ ] Project visible in list

### Phase 2: Project Linking

```bash
# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF

# Verify link
supabase status
```

- [ ] Project linked successfully
- [ ] Status shows connection details

### Phase 3: Database Migration

```bash
# Dry run first (recommended)
supabase db push --dry-run

# Review what will be applied
# If everything looks good, push for real
supabase db push
```

- [ ] Dry run completed successfully
- [ ] Migration pushed to remote
- [ ] No errors reported

### Phase 4: Verify Database

**Via Supabase Dashboard:**

1. Go to: https://app.supabase.com/project/YOUR_PROJECT_REF/editor
2. Check Table Editor for these tables:
   - [ ] ic_web_pages
   - [ ] ic_web_seo_meta
   - [ ] ic_web_site_settings
   - [ ] ic_web_navigation
   - [ ] ic_web_media
   - [ ] ic_web_admin_users
   - [ ] ic_web_audit_log

**Via SQL Editor:**

```sql
-- Check admin user
SELECT * FROM ic_web_admin_users WHERE email = 'hugo@intellicloud.com';
```

- [ ] Admin user exists
- [ ] Role is 'super_admin'
- [ ] is_active is TRUE

### Phase 5: Google OAuth Configuration

**Part A: Google Cloud Console**

1. Navigate to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (if not already done)
3. Add redirect URIs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```
4. Add JavaScript origins:
   ```
   https://YOUR_PROJECT_REF.supabase.co
   http://localhost:5173
   ```

- [ ] OAuth client created
- [ ] Redirect URIs configured
- [ ] JavaScript origins configured

**Part B: Supabase Dashboard**

1. Go to: https://app.supabase.com/project/YOUR_PROJECT_REF/auth/providers
2. Find "Google" provider
3. Toggle "Enable Sign in with Google"
4. Paste Client ID
5. Paste Client Secret
6. Save configuration

- [ ] Google provider enabled
- [ ] Credentials entered
- [ ] Configuration saved

### Phase 6: Local Testing

```bash
# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev
```

**Test OAuth Flow:**

1. Navigate to: http://localhost:5173/admin.html
2. Click "Sign in with Google"
3. Use @intellicloud.com account
4. Should redirect back to admin dashboard

- [ ] OAuth flow initiated successfully
- [ ] Google authentication completed
- [ ] Redirected back to admin
- [ ] No authorization errors

**Test Connection (optional):**

```bash
# Run connection test script
npm run test:supabase
```

- [ ] Connection test passed
- [ ] All tables detected
- [ ] No critical errors

### Phase 7: Production Build

```bash
# Build for production
npm run build

# Verify build succeeded
# Check dist/ directory created
```

- [ ] Build completed without errors
- [ ] `dist/` directory contains files
- [ ] `admin.html` included in build

### Phase 8: Firebase Deployment

```bash
# Deploy to staging first
npm run deploy:staging

# Test on staging URL
# If everything works, deploy to production
npm run deploy:production
```

- [ ] Staging deployment successful
- [ ] Staging URL tested
- [ ] Production deployment successful
- [ ] Production URL verified

### Phase 9: Production Testing

**Test Live Admin Dashboard:**

1. Navigate to: https://site-web-ic.web.app/admin.html
2. Click "Sign in with Google"
3. Use @intellicloud.com account
4. Verify dashboard loads

- [ ] Live OAuth flow works
- [ ] Admin dashboard accessible
- [ ] Can view CMS tables
- [ ] No console errors

---

## Post-Deployment Verification

### Security Checks

- [ ] .env file NOT committed to Git
- [ ] RLS policies active on all tables
- [ ] Only @intellicloud.com users can access admin
- [ ] OAuth redirect URIs are correct
- [ ] Anon key (not service_role key) used in client

### Functionality Checks

- [ ] Can create new pages
- [ ] Can edit existing pages
- [ ] Can manage navigation menus
- [ ] Can upload media (once storage configured)
- [ ] Audit log tracking changes
- [ ] Bilingual content (EN/FR) works

### Performance Checks

- [ ] Admin dashboard loads quickly
- [ ] Database queries respond promptly
- [ ] OAuth flow completes without delays
- [ ] No rate limiting issues

---

## Troubleshooting Reference

### Issue: OAuth "redirect_uri_mismatch"

**Check:**
1. Google Cloud Console redirect URIs match exactly
2. No trailing slashes
3. Protocol (http/https) is correct

**Fix:**
- Update Google OAuth credentials
- Ensure Supabase project URL is correct
- Wait 5 minutes for Google to propagate changes

### Issue: "User not authorized"

**Check:**
1. User email ends with @intellicloud.com
2. User exists in ic_web_admin_users table
3. is_active = TRUE

**Fix:**
```sql
-- Add user to admin table
INSERT INTO ic_web_admin_users (email, domain, full_name, role, is_active)
VALUES ('user@intellicloud.com', 'intellicloud.com', 'User Name', 'admin', TRUE);
```

### Issue: "Table does not exist"

**Check:**
1. Migration was pushed: `supabase db push`
2. No errors during migration
3. Connected to correct project

**Fix:**
```bash
# Re-push migration
supabase db push
```

### Issue: Environment variables not loading

**Check:**
1. .env file exists in project root
2. Variable names start with VITE_ for client-side
3. Dev server restarted after .env changes

**Fix:**
```bash
# Stop dev server (Ctrl+C)
# Restart
npm run dev
```

---

## Additional Admin Users

To add more administrators:

```sql
-- Via Supabase Dashboard → SQL Editor
INSERT INTO ic_web_admin_users (email, domain, full_name, role, is_active)
VALUES
    ('colleague@intellicloud.com', 'intellicloud.com', 'Colleague Name', 'admin', TRUE);
```

**Roles:**
- `super_admin` - Full access including user management
- `admin` - Full CMS access, cannot manage users
- `editor` - Content editing only, no settings

---

## Maintenance Tasks

### Monthly

- [ ] Review audit logs for unusual activity
- [ ] Check admin user list for inactive users
- [ ] Verify OAuth credentials still valid
- [ ] Update Supabase CLI: `npm install -g supabase`

### Quarterly

- [ ] Rotate access tokens
- [ ] Review RLS policies
- [ ] Backup database (Supabase automatic backups)
- [ ] Test disaster recovery procedure

---

## Emergency Contacts

**Supabase Support:** https://supabase.com/support
**Google Cloud Support:** https://cloud.google.com/support
**IntelliCloud Admin:** hugo@intellicloud.com

---

## Documentation References

- **Full Setup Guide:** SUPABASE_CONFIG_PROGRESS.md
- **Quick Start:** SUPABASE_QUICK_START.md
- **Project README:** README.md
- **Development Guide:** CLAUDE.md

---

**Deployment Checklist Version:** 1.0
**Last Updated:** 2025-11-26
