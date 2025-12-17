-- Set a stronger admin password
-- New password: OakAdmin2024!Secure
-- This is a temporary password - please change it after first login

UPDATE admin_users 
SET password_hash = 'OakAdmin2024!Secure',
    updated_at = NOW()
WHERE email = 'admin@oakwood.edu';
