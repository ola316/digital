-- Create a default admin user (password: admin123)
-- In production, you should change this password immediately
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO admin_users (email, password_hash, name, role) VALUES
  ('admin@oakwood.edu', '$2a$10$rQEY9jHZBqZJ5YQwKQh8/.JXqGcQmN5iWnQzF1.lCvqxWE5bpZVoS', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
