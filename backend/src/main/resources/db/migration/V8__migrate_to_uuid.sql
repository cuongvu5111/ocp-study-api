-- Flyway Migration: Fresh UUID Migration
-- Version: V8
-- Mô tả: Drop và tạo lại tất cả tables với UUID làm primary key (Fresh Start)
-- CẢNH BÁO: Migration này sẽ XÓA TẤT CẢ DỮ LIỆU HIỆN TẠI

-- Yêu cầu extension uuid-ossp hoặc pgcrypto cho gen_random_uuid()
-- PostgreSQL 13+ đã có sẵn gen_random_uuid() trong core

-- 1. Drop tất cả tables theo thứ tự phụ thuộc (foreign keys)
DROP TABLE IF EXISTS quiz_history CASCADE;
DROP TABLE IF EXISTS flashcard_reviews CASCADE;
DROP TABLE IF EXISTS topic_progress CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS subtopics CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Tạo bảng Users với UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    daily_digest_enabled BOOLEAN DEFAULT TRUE
);

-- 3. Tạo bảng Certifications với UUID
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    start_date DATE,
    end_date DATE,
    duration_months INTEGER
);

-- 4. Tạo bảng Topics với UUID
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    month INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    estimated_days INTEGER
);

-- 5. Tạo bảng Subtopics với UUID
CREATE TABLE subtopics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty INTEGER NOT NULL DEFAULT 3,
    estimated_days INTEGER NOT NULL DEFAULT 1,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    order_index INTEGER NOT NULL
);

-- 6. Tạo bảng Flashcards với UUID
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    subtopic_id UUID REFERENCES subtopics(id) ON DELETE SET NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    code_example TEXT,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    next_review TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 7. Tạo bảng Questions với UUID
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    code_snippet TEXT,
    question_type VARCHAR(20) NOT NULL DEFAULT 'SINGLE_CHOICE',
    explanation TEXT,
    difficulty INTEGER NOT NULL DEFAULT 3
);

-- 8. Tạo bảng Question Options với UUID
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_key VARCHAR(1) NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. Tạo bảng Topic Progress với UUID
CREATE TABLE topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    notes TEXT,
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, subtopic_id)
);

-- 10. Tạo bảng Study Sessions với UUID
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL,
    minutes_studied INTEGER NOT NULL DEFAULT 0,
    flashcards_reviewed INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    notes TEXT,
    UNIQUE(user_id, study_date)
);

-- 11. Tạo bảng Flashcard Reviews với UUID
CREATE TABLE flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    ease_factor DECIMAL(4,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    next_review TIMESTAMP,
    last_reviewed TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tạo bảng Quiz History với UUID
CREATE TABLE quiz_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Tạo bảng Documents với UUID
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT,
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(50)
);

-- 14. Tạo indexes
CREATE INDEX idx_topics_certification_id ON topics(certification_id);
CREATE INDEX idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX idx_flashcards_topic_id ON flashcards(topic_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review);
CREATE INDEX idx_questions_topic_id ON questions(topic_id);
CREATE INDEX idx_topic_progress_user_id ON topic_progress(user_id);
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, study_date);
CREATE INDEX idx_flashcard_reviews_user_id ON flashcard_reviews(user_id);
CREATE INDEX idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX idx_documents_certification_id ON documents(certification_id);
