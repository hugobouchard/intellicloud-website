# Supabase CMS Quick Start

**For:** Hugo Bouchard & IntelliCloud Team
**Time Required:** 30-45 minutes
**Prerequisite:** Supabase account (free tier works)

---

## TL;DR - The 8-Step Setup

```bash
# 1. Create Supabase project at https://app.supabase.com/
# 2. Get access token at https://app.supabase.com/account/tokens
# 3. Login to CLI
supabase login --token YOUR_ACCESS_TOKEN

# 4. Link project
cd C:/Users/hugo/claude/intellicloud-website
supabase link --project-ref YOUR_PROJECT_REF

# 5. Create .env file
copy .env.example .env
# Edit .env with your Supabase URL and anon key

# 6. Push database migration
supabase db push

# 7. Configure Google OAuth at https://app.supabase.com/project/YOUR_PROJECT_REF/auth/providers

# 8. Test the admin dashboard
npm run dev
# Navigate to http://localhost:5173/admin.html
```

---

## What You Need to Gather

### From Supabase Dashboard

**URL:** https://app.supabase.com/project/YOUR_PROJECT_REF/settings/api

Copy these 2 values:
1. **Project URL** → Goes in .env as `VITE_SUPABASE_URL`
2. **anon public key** → Goes in .env as `VITE_SUPABASE_ANON_KEY`

**URL:** https://app.supabase.com/account/tokens

Generate:
3. **Access Token** → For CLI authentication

### From Google Cloud Console

**URL:** https://console.cloud.google.com/apis/credentials

Create OAuth client and copy:
4. **Client ID** → Goes in .env and Supabase Dashboard
5. **Client Secret** → Goes in .env and Supabase Dashboard

---

## Google OAuth Redirect URIs

When creating OAuth credentials, add these **exact** URLs:

**Authorized redirect URIs:**
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
http://localhost:54321/auth/v1/callback
```

**Authorized JavaScript origins:**
```
https://YOUR_PROJECT_REF.supabase.co
http://localhost:5173
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference ID.

---

## Your .env File Should Look Like This

```bash
# From Supabase Dashboard → Settings → API
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjE2NTY4MCwiZXhwIjoxOTQ3NzQxNjgwfQ.SAMPLE_KEY_DO_NOT_USE

# From Google Cloud Console → Credentials
SUPABASE_AUTH_GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
SUPABASE_AUTH_GOOGLE_SECRET_KEY=GOCSPX-abcdefghijklmnopqrstuvwxyz

# From Supabase Dashboard → Account → Access Tokens
SUPABASE_ACCESS_TOKEN=sbp_1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz
```

---

## Verify Everything Works

### 1. Check CLI Connection
```bash
supabase projects list
```
Should show your linked project.

### 2. Check Database Tables
After `supabase db push`, go to:
https://app.supabase.com/project/YOUR_PROJECT_REF/editor

You should see 7 tables:
- ic_web_pages
- ic_web_seo_meta
- ic_web_site_settings
- ic_web_navigation
- ic_web_media
- ic_web_admin_users
- ic_web_audit_log

### 3. Check Admin User
```sql
SELECT * FROM ic_web_admin_users;
```
Should show: hugo@intellicloud.com as super_admin

### 4. Test OAuth Flow
```bash
npm run dev
```
Navigate to: http://localhost:5173/admin.html
Click "Sign in with Google"
Use @intellicloud.com account

---

## Common Issues

### "Access token not provided"
```bash
# Solution: Set environment variable
export SUPABASE_ACCESS_TOKEN=YOUR_TOKEN  # Mac/Linux
$env:SUPABASE_ACCESS_TOKEN="YOUR_TOKEN"  # Windows PowerShell
```

### "redirect_uri_mismatch"
- Double-check Google OAuth redirect URIs
- No trailing slashes
- Must be exact match

### "User not authorized"
- Verify email ends with @intellicloud.com
- Check ic_web_admin_users table
- Ensure is_active = TRUE

---

## Next: Add More Admins

```sql
INSERT INTO ic_web_admin_users (email, domain, full_name, role, is_active)
VALUES
    ('colleague@intellicloud.com', 'intellicloud.com', 'Colleague Name', 'admin', TRUE);
```

Roles:
- `super_admin` - Full access including user management
- `admin` - Full CMS access
- `editor` - Content editing only

---

## Full Documentation

See **SUPABASE_CONFIG_PROGRESS.md** for complete details, troubleshooting, and CLI reference.

---

**Questions?** Contact Hugo Bouchard (hugo@intellicloud.com)
