-- Seed admin user với password 'admin123' (BCrypt encoded)
-- BCrypt hash for 'admin123' with strength 12
INSERT INTO users (username, full_name, password, email, role, email_enabled, daily_digest_enabled, created_at)
VALUES (
    'admin',
    'Administrator',
    '$2a$12$LQv3c1yqBWVY0MfqJ1qQO.9xUj0v8nqO1qSzTm.H8gGN9jZmHxCGy',
    'admin@ocp.local',
    'ADMIN',
    true,
    true,
    NOW()
) ON CONFLICT (username) DO NOTHING;
