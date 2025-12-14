-- Fix admin password - store plain text temporarily for testing
-- IMPORTANT: In production, always use hashed passwords!
UPDATE admin_users 
SET password_hash = 'admin123'
WHERE email = 'admin@oakwood.edu';

-- If no admin exists, create one
INSERT INTO admin_users (email, password_hash, name, role) 
SELECT 'admin@oakwood.edu', 'admin123', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@oakwood.edu');
