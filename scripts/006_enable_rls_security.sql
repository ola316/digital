-- Enable Row Level Security on ALL tables
-- This script secures your database so credentials and sensitive data are not publicly accessible

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DROP EXISTING POLICIES (if any)
-- =====================================================

DROP POLICY IF EXISTS "admin_users_server_only" ON admin_users;
DROP POLICY IF EXISTS "announcements_public_read" ON announcements;
DROP POLICY IF EXISTS "announcements_server_write" ON announcements;
DROP POLICY IF EXISTS "events_public_read" ON events;
DROP POLICY IF EXISTS "events_server_write" ON events;
DROP POLICY IF EXISTS "gallery_public_read" ON gallery;
DROP POLICY IF EXISTS "gallery_server_write" ON gallery;
DROP POLICY IF EXISTS "activity_log_server_only" ON activity_log;
DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "site_settings_server_write" ON site_settings;
DROP POLICY IF EXISTS "contact_messages_server_only" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;

-- =====================================================
-- ADMIN_USERS TABLE - COMPLETELY PRIVATE (server-side only)
-- No public access - only accessible via service role key
-- =====================================================

-- No policies = no public access at all
-- The service role key bypasses RLS, so server actions can still query

-- =====================================================
-- ANNOUNCEMENTS TABLE - Public read, server-side write
-- =====================================================

CREATE POLICY "announcements_public_read" ON announcements
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- =====================================================
-- EVENTS TABLE - Public read, server-side write
-- =====================================================

CREATE POLICY "events_public_read" ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- =====================================================
-- GALLERY TABLE - Public read, server-side write
-- =====================================================

CREATE POLICY "gallery_public_read" ON gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- =====================================================
-- ACTIVITY_LOG TABLE - COMPLETELY PRIVATE (server-side only)
-- =====================================================

-- No policies = no public access

-- =====================================================
-- SITE_SETTINGS TABLE - Public read, server-side write
-- =====================================================

CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- =====================================================
-- CONTACT_MESSAGES TABLE - Insert only for public, full access for server
-- =====================================================

CREATE POLICY "contact_messages_insert" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Run this to verify RLS is enabled on all tables:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
