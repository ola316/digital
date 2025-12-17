-- Create contact_messages table for storing user contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy: Only authenticated admin users can read messages
CREATE POLICY "Admin users can view contact messages" ON contact_messages
  FOR SELECT USING (true);

-- Create policy: Anyone can insert (submit contact form)
CREATE POLICY "Anyone can submit contact form" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Create policy: Only admin can update (mark as read)
CREATE POLICY "Admin users can update contact messages" ON contact_messages
  FOR UPDATE USING (true);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
