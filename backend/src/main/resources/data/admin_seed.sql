-- Seed admin user với password 'admin123' (BCrypt encoded)
-- BCrypt hash for 'admin123' with strength 12
INSERT INTO users (username, full_name, password, email, role, email_enabled, daily_digest_enabled, created_at)
VALUES (
    'admin',
    'Administrator',
    '$2a$12$QBz0hUf3jFNDyXyEzLsUXuIP1cO6PgJNteDB7qyX.n6/ImnSE2ySq',
    'admin@ocp.local',
    'ADMIN',
    true,
    true,
    NOW()
) ON CONFLICT (username) DO NOTHING;
