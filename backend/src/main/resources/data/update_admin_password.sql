-- Update admin password with correct BCrypt hash for 'admin123'
-- Hash generated with BCryptPasswordEncoder(12)
UPDATE users 
SET password = '$2a$12$LQv3c1yqBWVY0MfqJ1qQO.9xUj0v8nqO1qSzTm.H8gGN9jZmHxCGy'
WHERE username = 'admin';
