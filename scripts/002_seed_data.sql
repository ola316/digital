-- Insert sample announcements
INSERT INTO announcements (title, content, excerpt, category, featured, published, author) VALUES
  ('Welcome Back to School', 'We are excited to welcome students and families to a new academic year at Oakwood Academy. Please review the updated handbook and calendar.', 'A warm welcome to a new year of learning and growth.', 'General', true, true, 'Principal Adams'),
  ('Science Fair Registration Open', 'Students are invited to participate in the annual Science Fair. Registration closes on September 30. Workshops available every Friday.', 'Showcase your curiosity and creativity at the Science Fair.', 'Academic', true, true, 'STEM Department'),
  ('Varsity Soccer Tryouts', 'Tryouts for the varsity soccer team will be held on the main field next week. Bring appropriate gear and hydration.', 'Join the Oakwood Owls on the field.', 'Sports', false, true, 'Athletics'),
  ('Parent-Teacher Conferences', 'Conferences will be held October 15-16. Online scheduling opens next week. Please book your time slots early.', 'Partnering for student success.', 'General', false, true, 'Office'),
  ('Fall Theater Auditions', 'Auditions for the fall production will take place in the auditorium. All are welcome. Backstage roles also available.', 'Calling all actors, musicians, and crew!', 'Cultural', false, true, 'Arts Department'),
  ('Library Extended Hours', 'The library will extend hours during midterms. Study groups are encouraged. Snacks provided after school.', 'Extra time, extra support.', 'Academic', false, true, 'Library')
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, category, featured, image_url) VALUES
  ('Back-to-School Night', 'Meet teachers and explore classrooms. Welcome remarks by the principal.', CURRENT_DATE + INTERVAL '5 days', '18:00', 'Main Campus', 'Academic', true, '/placeholder.svg?height=400&width=600'),
  ('Soccer Home Opener', 'Oakwood Owls vs. Riverview High. Wear green!', CURRENT_DATE + INTERVAL '8 days', '16:00', 'Athletic Field', 'Sports', true, '/placeholder.svg?height=400&width=600'),
  ('Science Fair Workshop', 'Project ideation and mentorship sessions.', CURRENT_DATE + INTERVAL '12 days', '15:00', 'STEM Lab', 'Academic', false, '/placeholder.svg?height=400&width=600'),
  ('Fall Theater Auditions', 'Auditions for roles and crew sign-ups.', CURRENT_DATE + INTERVAL '14 days', '17:00', 'Auditorium', 'Cultural', false, NULL),
  ('Community Service Day', 'Join us for a day of service across the city.', CURRENT_DATE + INTERVAL '20 days', '09:00', 'Citywide', 'Community', false, NULL),
  ('Parent-Teacher Conferences', 'Scheduled meetings to discuss progress.', CURRENT_DATE + INTERVAL '30 days', '10:00', 'Main Campus', 'General', false, NULL)
ON CONFLICT DO NOTHING;

-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url, category, year, type, featured) VALUES
  ('Campus Green', 'Our beautiful campus during spring.', '/placeholder.svg?height=600&width=800', 'Campus', '2024', 'photo', true),
  ('Robotics Team', 'Robotics team at regional competition.', '/placeholder.svg?height=600&width=800', 'Academic', '2024', 'photo', true),
  ('Spring Concert', 'Highlights from the spring concert.', '/placeholder.svg?height=600&width=800', 'Cultural', '2023', 'photo', false),
  ('Basketball Finals', 'Our team in the finals.', '/placeholder.svg?height=600&width=800', 'Sports', '2023', 'photo', false),
  ('Graduation Highlights', 'Celebrating our graduates.', '/placeholder.svg?height=600&width=800', 'Ceremony', '2023', 'photo', false),
  ('Chemistry Lab', 'Experiment day in the lab.', '/placeholder.svg?height=600&width=800', 'Academic', '2022', 'photo', false)
ON CONFLICT DO NOTHING;

-- Insert initial activity log
INSERT INTO activity_log (action_type, action, message, user_email) VALUES
  ('system', 'init', 'Database initialized with seed data', 'system')
ON CONFLICT DO NOTHING;
