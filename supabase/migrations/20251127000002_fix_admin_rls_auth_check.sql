-- Fix authentication check in RLS policy
-- The previous policy used auth.role() which may not work correctly
-- This version uses auth.uid() which is the proper way to check if user is authenticated

-- Drop the incorrect policy
DROP POLICY "Authenticated users can view admin_users" ON ic_web_admin_users;

-- Create the correct policy that checks if user is authenticated
CREATE POLICY "Authenticated users can view admin_users"
    ON ic_web_admin_users FOR SELECT
    USING (auth.uid() IS NOT NULL);
