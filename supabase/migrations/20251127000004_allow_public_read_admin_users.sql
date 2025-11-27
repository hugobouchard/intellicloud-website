-- Allow public read access to ic_web_admin_users
-- The table contains only email, domain, and role info - not sensitive
-- The actual authorization is checked by the app after reading the table

CREATE POLICY "Public can view admin_users"
    ON ic_web_admin_users FOR SELECT
    USING (true);
