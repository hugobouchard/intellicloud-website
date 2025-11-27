-- Fix RLS policy for ic_web_admin_users table
-- Allow authenticated users to view the table to check their own access
-- This resolves the circular dependency where users couldn't query the table
-- to check if they were admins because the RLS policy required them to be admins

-- Authenticated users can view admin_users to check their own access
CREATE POLICY "Authenticated users can view admin_users"
    ON ic_web_admin_users FOR SELECT
    USING (auth.role() = 'authenticated');
