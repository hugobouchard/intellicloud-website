-- Fix infinite recursion in ic_web_admin_users RLS policies
-- The issue: "Super admins can manage admin_users" policy queries the same table, causing recursion
-- Solution: Use a SECURITY DEFINER helper function instead of direct subquery

-- Drop all problematic policies on ic_web_admin_users
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON ic_web_admin_users;
DROP POLICY IF EXISTS "IntelliCloud admins can view admin_users" ON ic_web_admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON ic_web_admin_users;

-- Create a new helper function to check if user is super admin (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION ic_web_is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM ic_web_admin_users
        WHERE email = auth.jwt() ->> 'email'
        AND domain = 'intellicloud.com'
        AND role = 'super_admin'
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- New policies without recursion:
-- 1. All authenticated users can view admin users (read-only, needed for auth check)
CREATE POLICY "Authenticated users can view admin_users"
    ON ic_web_admin_users FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- 2. Super admins can INSERT/UPDATE/DELETE admin users
CREATE POLICY "Super admins can manage admin_users"
    ON ic_web_admin_users FOR INSERT
    WITH CHECK (ic_web_is_super_admin());

CREATE POLICY "Super admins can update admin_users"
    ON ic_web_admin_users FOR UPDATE
    USING (ic_web_is_super_admin())
    WITH CHECK (ic_web_is_super_admin());

CREATE POLICY "Super admins can delete admin_users"
    ON ic_web_admin_users FOR DELETE
    USING (ic_web_is_super_admin());
