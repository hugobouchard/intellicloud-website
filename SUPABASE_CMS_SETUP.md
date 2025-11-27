# IntelliCloud CMS - Supabase Setup Guide

## Overview

Your IntelliCloud website now has a complete CMS (Content Management System) powered by Supabase with Google OAuth authentication restricted to `@intellicloud.com` domain users.

## What Was Created

### 1. Database Schema (Prefix: `ic_web_`)

All tables use the `ic_web_` prefix to avoid conflicts with other projects in your Supabase database.

**Tables Created:**
- `ic_web_pages` - Website pages with multilingual support (EN/FR)
- `ic_web_seo_meta` - SEO metadata (meta tags, Open Graph, Twitter cards, structured data)
- `ic_web_site_settings` - Global site configuration
- `ic_web_navigation` - Dynamic navigation menus
- `ic_web_media` - Media library for images and assets
- `ic_web_admin_users` - Authorized admin users (@intellicloud.com only)
- `ic_web_audit_log` - Complete audit trail of all changes

**Features:**
- Row Level Security (RLS) enabled on all tables
- Public can view published content
- Only @intellicloud.com users can edit
- Automatic timestamps (created_at, updated_at)
- Complete audit logging
- Bilingual support (English/French)

### 2. Files Created

```
/Users/hugo/claude/intellicloud-website/
├── .env                                    # Supabase configuration
├── admin.html                              # Admin dashboard entry point
├── src/
│   ├── lib/
│   │   └── supabaseClient.js              # Supabase client & helpers
│   └── scripts/
│       └── admin.js                        # Admin dashboard app
└── supabase/
    └── migrations/
        └── 20251124030001_intellicloud_cms_setup.sql
```

## Next Steps to Complete Setup

### Step 1: Get Your Supabase Anon Key

1. Go to https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/settings/api
2. Copy your **anon/public** key
3. Update `.env` file:

```bash
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Step 2: Configure Google OAuth in Supabase

1. Go to https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/auth/providers
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Create OAuth credentials at https://console.cloud.google.com/apis/credentials
   - Set authorized redirect URI to: `https://qbvtpfcfcxgrusfxfqhd.supabase.co/auth/v1/callback`
4. In Supabase, configure:
   - **Client ID**: (from Google)
   - **Client Secret**: (from Google)
   - **Authorized Client IDs**: (optional, for additional security)

### Step 3: Add Your Admin User

Your admin user is already in the database:
- **Email**: hugo@intellicloud.com
- **Role**: super_admin
- **Domain**: intellicloud.com

To add more admin users, insert into `ic_web_admin_users` table via Supabase dashboard.

### Step 4: Test the Admin Dashboard

1. Make sure dev server is running: `npm run dev`
2. Navigate to: http://localhost:5173/admin.html
3. Click "Sign in with Google"
4. Use your @intellicloud.com Google account
5. You should see the admin dashboard

## Admin Dashboard Features

### Current Features (v1)

1. **Authentication**
   - Google OAuth (intellicloud.com domain only)
   - Automatic access control
   - Session management

2. **Pages Management**
   - View all pages
   - See page status (draft/published/archived)
   - Multilingual support (EN/FR)

3. **Navigation Sections**
   - Pages
   - SEO Meta
   - Navigation
   - Settings
   - Media Library

### Planned Features (v2)

- Full CRUD operations for pages
- Rich text editor for content
- SEO meta editor
- Navigation menu builder
- Media uploader
- Site settings editor
- Audit log viewer
- User management

## Database Security

### Row Level Security (RLS) Policies

**Public Access:**
- Can view published pages
- Can view navigation menus
- Can view site settings
- Can view media files

**Admin Access (@intellicloud.com):**
- Full CRUD on all content tables
- View audit logs
- Super admins can manage other admin users

### Helper Functions

- `ic_web_is_intellicloud_admin()` - Checks if current user is authorized admin
- `ic_web_update_updated_at_column()` - Auto-updates timestamps
- `ic_web_audit_trigger()` - Logs all changes

## API Usage Examples

### Frontend Integration

```javascript
import { db } from '/src/lib/supabaseClient.js'

// Get all published pages (EN)
const { data: pages } = await db.getPublishedPages('en')

// Get specific page by slug
const { data: page } = await db.getPageBySlug('about')

// Get navigation menu
const { data: nav } = await db.getNavigation('main', 'en')

// Get site settings
const { data: settings } = await db.getSiteSettings()
```

## Environment Variables

```bash
# .env
VITE_SUPABASE_URL=https://qbvtpfcfcxgrusfxfqhd.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Migration Management

### View Applied Migrations
```bash
export SUPABASE_ACCESS_TOKEN="your_token"
supabase migration list
```

### Create New Migration
```bash
supabase migration new your_migration_name
```

### Apply Migrations
```bash
supabase db push
```

## Troubleshooting

### Can't Access Admin Dashboard
1. Ensure `.env` file has correct Supabase credentials
2. Check Google OAuth is configured in Supabase
3. Verify your email is in `ic_web_admin_users` table
4. Check browser console for errors

### RLS Errors
- Ensure you're signed in with @intellicloud.com account
- Check your user exists in `ic_web_admin_users` table
- Verify `is_active = true` for your user

### Google OAuth Not Working
1. Check redirect URI is correct in Google Console
2. Verify Client ID and Secret in Supabase
3. Ensure domain restriction is NOT set in Google OAuth (we handle this via RLS)

## Database Schema Reference

### ic_web_pages
- `id` - UUID primary key
- `slug` - Unique page identifier
- `language` - 'en' or 'fr'
- `title` - Page title
- `description` - Page description
- `content` - JSONB content data
- `status` - 'draft', 'published', or 'archived'
- `created_at`, `updated_at` - Timestamps
- `created_by`, `updated_by` - User tracking

### ic_web_seo_meta
- `id` - UUID primary key
- `page_id` - Reference to page
- `meta_title`, `meta_description`, `meta_keywords`
- `og_*` - Open Graph tags
- `twitter_*` - Twitter card tags
- `canonical_url`, `robots`
- `structured_data` - JSONB for schema.org

### ic_web_admin_users
- `email` - User email (must be @intellicloud.com)
- `domain` - Email domain
- `role` - 'editor', 'admin', or 'super_admin'
- `is_active` - Enable/disable access

## Support

For issues or questions:
- Check Supabase dashboard logs
- Review browser console errors
- Check `ic_web_audit_log` for operation history

---

**Status**: Database deployed, Admin UI created, awaiting OAuth configuration
**Created**: 2025-11-23
**Project**: IntelliCloud Website CMS
