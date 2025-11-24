-- IntelliCloud CMS Setup
-- Prefix: ic_web_ (IntelliCloud Website)

-- =============================================
-- PAGES TABLE
-- Stores all page content (EN/FR)
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL CHECK (language IN ('en', 'fr')),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Index for faster lookups
CREATE INDEX idx_ic_web_pages_slug ON ic_web_pages(slug);
CREATE INDEX idx_ic_web_pages_language ON ic_web_pages(language);
CREATE INDEX idx_ic_web_pages_status ON ic_web_pages(status);

-- =============================================
-- SEO META TABLE
-- Stores SEO metadata for pages
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_seo_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES ic_web_pages(id) ON DELETE CASCADE,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    og_type TEXT DEFAULT 'website',
    twitter_card TEXT DEFAULT 'summary_large_image',
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    canonical_url TEXT,
    robots TEXT DEFAULT 'index, follow',
    structured_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for page lookups
CREATE INDEX idx_ic_web_seo_meta_page_id ON ic_web_seo_meta(page_id);

-- =============================================
-- SITE SETTINGS TABLE
-- Global site configuration
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- NAVIGATION MENU TABLE
-- Dynamic navigation menus
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_navigation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_key TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('en', 'fr')),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES ic_web_navigation(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL DEFAULT 0,
    icon TEXT,
    is_external BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for menu queries
CREATE INDEX idx_ic_web_navigation_menu_key ON ic_web_navigation(menu_key);
CREATE INDEX idx_ic_web_navigation_language ON ic_web_navigation(language);
CREATE INDEX idx_ic_web_navigation_parent_id ON ic_web_navigation(parent_id);

-- =============================================
-- MEDIA LIBRARY TABLE
-- Store images and media assets
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    alt_text TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for filename search
CREATE INDEX idx_ic_web_media_filename ON ic_web_media(filename);

-- =============================================
-- ADMIN USERS TABLE
-- Track authorized admin users
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_ic_web_admin_users_email ON ic_web_admin_users(email);
CREATE INDEX idx_ic_web_admin_users_domain ON ic_web_admin_users(domain);

-- =============================================
-- AUDIT LOG TABLE
-- Track all changes for compliance
-- =============================================
CREATE TABLE IF NOT EXISTS ic_web_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    old_data JSONB,
    new_data JSONB,
    user_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX idx_ic_web_audit_log_table_name ON ic_web_audit_log(table_name);
CREATE INDEX idx_ic_web_audit_log_record_id ON ic_web_audit_log(record_id);
CREATE INDEX idx_ic_web_audit_log_created_at ON ic_web_audit_log(created_at);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION ic_web_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_ic_web_pages_updated_at BEFORE UPDATE ON ic_web_pages FOR EACH ROW EXECUTE FUNCTION ic_web_update_updated_at_column();
CREATE TRIGGER update_ic_web_seo_meta_updated_at BEFORE UPDATE ON ic_web_seo_meta FOR EACH ROW EXECUTE FUNCTION ic_web_update_updated_at_column();
CREATE TRIGGER update_ic_web_site_settings_updated_at BEFORE UPDATE ON ic_web_site_settings FOR EACH ROW EXECUTE FUNCTION ic_web_update_updated_at_column();
CREATE TRIGGER update_ic_web_navigation_updated_at BEFORE UPDATE ON ic_web_navigation FOR EACH ROW EXECUTE FUNCTION ic_web_update_updated_at_column();
CREATE TRIGGER update_ic_web_media_updated_at BEFORE UPDATE ON ic_web_media FOR EACH ROW EXECUTE FUNCTION ic_web_update_updated_at_column();
CREATE TRIGGER update_ic_web_admin_users_updated_at BEFORE UPDATE ON ic_web_admin_users FOR EACH ROW EXECUTE FUNCTION ic_web_update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE ic_web_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ic_web_audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is intellicloud.com admin
CREATE OR REPLACE FUNCTION ic_web_is_intellicloud_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM ic_web_admin_users
        WHERE email = auth.jwt() ->> 'email'
        AND domain = 'intellicloud.com'
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read access for published pages
CREATE POLICY "Public can view published pages"
    ON ic_web_pages FOR SELECT
    USING (status = 'published');

-- Public read access for SEO meta
CREATE POLICY "Public can view seo meta"
    ON ic_web_seo_meta FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ic_web_pages
            WHERE ic_web_pages.id = ic_web_seo_meta.page_id
            AND ic_web_pages.status = 'published'
        )
    );

-- Public read access for navigation
CREATE POLICY "Public can view active navigation"
    ON ic_web_navigation FOR SELECT
    USING (is_active = TRUE);

-- Public read access for media
CREATE POLICY "Public can view media"
    ON ic_web_media FOR SELECT
    USING (true);

-- Public read access for site settings
CREATE POLICY "Public can view site settings"
    ON ic_web_site_settings FOR SELECT
    USING (true);

-- Admin full access policies
CREATE POLICY "IntelliCloud admins can do everything on pages"
    ON ic_web_pages FOR ALL
    USING (ic_web_is_intellicloud_admin())
    WITH CHECK (ic_web_is_intellicloud_admin());

CREATE POLICY "IntelliCloud admins can do everything on seo_meta"
    ON ic_web_seo_meta FOR ALL
    USING (ic_web_is_intellicloud_admin())
    WITH CHECK (ic_web_is_intellicloud_admin());

CREATE POLICY "IntelliCloud admins can do everything on site_settings"
    ON ic_web_site_settings FOR ALL
    USING (ic_web_is_intellicloud_admin())
    WITH CHECK (ic_web_is_intellicloud_admin());

CREATE POLICY "IntelliCloud admins can do everything on navigation"
    ON ic_web_navigation FOR ALL
    USING (ic_web_is_intellicloud_admin())
    WITH CHECK (ic_web_is_intellicloud_admin());

CREATE POLICY "IntelliCloud admins can do everything on media"
    ON ic_web_media FOR ALL
    USING (ic_web_is_intellicloud_admin())
    WITH CHECK (ic_web_is_intellicloud_admin());

CREATE POLICY "IntelliCloud admins can view admin_users"
    ON ic_web_admin_users FOR SELECT
    USING (ic_web_is_intellicloud_admin());

CREATE POLICY "Super admins can manage admin_users"
    ON ic_web_admin_users FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM ic_web_admin_users
            WHERE email = auth.jwt() ->> 'email'
            AND domain = 'intellicloud.com'
            AND role = 'super_admin'
            AND is_active = TRUE
        )
    );

CREATE POLICY "IntelliCloud admins can view audit_log"
    ON ic_web_audit_log FOR SELECT
    USING (ic_web_is_intellicloud_admin());

-- =============================================
-- AUDIT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION ic_web_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO ic_web_audit_log (table_name, record_id, action, old_data, user_email)
        VALUES (TG_TABLE_NAME, OLD.id, 'delete', row_to_json(OLD), auth.jwt() ->> 'email');
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO ic_web_audit_log (table_name, record_id, action, old_data, new_data, user_email)
        VALUES (TG_TABLE_NAME, NEW.id, 'update', row_to_json(OLD), row_to_json(NEW), auth.jwt() ->> 'email');
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO ic_web_audit_log (table_name, record_id, action, new_data, user_email)
        VALUES (TG_TABLE_NAME, NEW.id, 'create', row_to_json(NEW), auth.jwt() ->> 'email');
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers
CREATE TRIGGER ic_web_pages_audit AFTER INSERT OR UPDATE OR DELETE ON ic_web_pages FOR EACH ROW EXECUTE FUNCTION ic_web_audit_trigger();
CREATE TRIGGER ic_web_seo_meta_audit AFTER INSERT OR UPDATE OR DELETE ON ic_web_seo_meta FOR EACH ROW EXECUTE FUNCTION ic_web_audit_trigger();
CREATE TRIGGER ic_web_site_settings_audit AFTER INSERT OR UPDATE OR DELETE ON ic_web_site_settings FOR EACH ROW EXECUTE FUNCTION ic_web_audit_trigger();
CREATE TRIGGER ic_web_navigation_audit AFTER INSERT OR UPDATE OR DELETE ON ic_web_navigation FOR EACH ROW EXECUTE FUNCTION ic_web_audit_trigger();
CREATE TRIGGER ic_web_media_audit AFTER INSERT OR UPDATE OR DELETE ON ic_web_media FOR EACH ROW EXECUTE FUNCTION ic_web_audit_trigger();

-- =============================================
-- INSERT INITIAL DATA
-- =============================================

-- Add default site settings
INSERT INTO ic_web_site_settings (key, value, description) VALUES
    ('site_name', '{"en": "IntelliCloud", "fr": "IntelliCloud"}', 'Site name'),
    ('site_tagline', '{"en": "Cloud Solutions", "fr": "Solutions Cloud"}', 'Site tagline'),
    ('contact_email', '"contact@intellicloud.com"', 'Contact email'),
    ('social_media', '{"twitter": "", "linkedin": "", "github": ""}', 'Social media links');

-- Add your admin user (you'll need to update this with your actual email)
INSERT INTO ic_web_admin_users (email, domain, full_name, role, is_active) VALUES
    ('hugo@intellicloud.com', 'intellicloud.com', 'Hugo Bouchard', 'super_admin', TRUE);
