# Supabase Google OAuth Setup Guide

This guide walks you through setting up Google OAuth for the IntelliCloud admin dashboard using gcloud CLI.

## Prerequisites

- gcloud CLI installed (already done ✓)
- Google Cloud Project with billing enabled
- Supabase project: https://qbvtpfcfcxgrusfxfqhd.supabase.co

## Step 1: Authenticate with Google Cloud

```bash
gcloud auth login
```

This will open a browser window. Sign in with your Google account that has access to Google Cloud Console.

## Step 2: List or Create a Project

### List existing projects:
```bash
gcloud projects list
```

### Create a new project (if needed):
```bash
gcloud projects create intellicloud-oauth --name="IntelliCloud OAuth"
```

### Set the active project:
```bash
# Replace PROJECT_ID with your actual project ID
gcloud config set project PROJECT_ID
```

## Step 3: Enable Required APIs

```bash
# Enable Google+ API (required for OAuth)
gcloud services enable plus.googleapis.com

# Enable IAM API
gcloud services enable iam.googleapis.com

# Enable Cloud Resource Manager API
gcloud services enable cloudresourcemanager.googleapis.com
```

## Step 4: Create OAuth 2.0 Credentials

### Create OAuth consent screen first:
You need to do this in the Google Cloud Console UI:

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Select "External" user type
3. Fill in:
   - App name: **IntelliCloud Admin**
   - User support email: **your@intellicloud.com**
   - Developer contact: **your@intellicloud.com**
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. Add test users: **your@intellicloud.com**
6. Save and continue

### Create OAuth 2.0 Client ID:

Unfortunately, gcloud doesn't have a direct command to create OAuth clients. You need to use the Console or API:

#### Option A: Via Google Cloud Console (Easier)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: **IntelliCloud Supabase Auth**
5. Authorized redirect URIs:
   ```
   https://qbvtpfcfcxgrusfxfqhd.supabase.co/auth/v1/callback
   ```
6. Click "Create"
7. **Copy the Client ID and Client Secret** - you'll need these for Supabase

#### Option B: Via gcloud (More complex)

```bash
# This requires using the OAuth2 API directly
# You'll need to use curl or a script to call the API
```

## Step 5: Configure Supabase with OAuth Credentials

### Get your Supabase Anon Key:

1. Go to: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/settings/api
2. Copy the **anon/public** key

### Enable Google Provider in Supabase:

1. Go to: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/auth/providers
2. Find "Google" in the providers list
3. Click to expand and enable it
4. Enter the OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
5. Authorized redirect URL should already be set to:
   ```
   https://qbvtpfcfcxgrusfxfqhd.supabase.co/auth/v1/callback
   ```
6. Click "Save"

## Step 6: Update Local Environment Variables

Update the `.env` file in the project root:

```bash
# Open the .env file
code .env  # or nano .env

# Replace with your actual Supabase anon key
VITE_SUPABASE_URL=https://qbvtpfcfcxgrusfxfqhd.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 7: Set Up Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create admin users table
CREATE TABLE IF NOT EXISTS ic_web_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add your email as admin
INSERT INTO ic_web_admin_users (email, is_active, role)
VALUES ('your@intellicloud.com', true, 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create pages table
CREATE TABLE IF NOT EXISTS ic_web_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create SEO meta table
CREATE TABLE IF NOT EXISTS ic_web_seo_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES ic_web_pages(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create navigation table
CREATE TABLE IF NOT EXISTS ic_web_navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_key TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES ic_web_navigation(id) ON DELETE CASCADE,
  order_position INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site settings table
CREATE TABLE IF NOT EXISTS ic_web_site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ic_web_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can read admin_users" ON ic_web_admin_users
  FOR SELECT USING (auth.email() LIKE '%@intellicloud.com');

CREATE POLICY "Admins can do everything on pages" ON ic_web_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ic_web_admin_users
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins can do everything on seo_meta" ON ic_web_seo_meta
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ic_web_admin_users
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins can do everything on navigation" ON ic_web_navigation
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ic_web_admin_users
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins can do everything on site_settings" ON ic_web_site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ic_web_admin_users
      WHERE email = auth.email() AND is_active = true
    )
  );

-- Public read access
CREATE POLICY "Public can read published pages" ON ic_web_pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read navigation" ON ic_web_navigation
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read site settings" ON ic_web_site_settings
  FOR SELECT USING (true);
```

## Step 8: Rebuild and Redeploy

```bash
# Update .env file first, then rebuild
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Step 9: Test the Admin Panel

1. Go to: https://site-web-ic.web.app/admin.html
2. Click "Sign in with Google"
3. Authenticate with your @intellicloud.com account
4. You should be redirected to the admin dashboard

## Troubleshooting

### Error: "Unsupported provider: provider is not enabled"
- Google OAuth is not enabled in Supabase
- Go to Supabase Auth Providers and enable Google

### Error: "redirect_uri_mismatch"
- The redirect URI in Google Cloud Console doesn't match Supabase
- Make sure it's exactly: `https://qbvtpfcfcxgrusfxfqhd.supabase.co/auth/v1/callback`

### Error: "Access denied"
- Your email is not in the `ic_web_admin_users` table
- Add your email using the SQL command above

### Error: "Invalid API key"
- The anon key in `.env` is incorrect
- Copy the correct one from Supabase Dashboard → Settings → API

## Quick Reference

### Supabase Dashboard URLs:
- Project: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd
- API Keys: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/settings/api
- Auth Providers: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/auth/providers
- SQL Editor: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/sql

### Google Cloud Console URLs:
- Credentials: https://console.cloud.google.com/apis/credentials
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent

### Live Site:
- Website: https://site-web-ic.web.app/
- Admin Panel: https://site-web-ic.web.app/admin.html
