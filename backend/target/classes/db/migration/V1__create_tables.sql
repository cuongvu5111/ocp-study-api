-- Flyway Migration: Create initial tables
-- Version: V1
-- Description: Tạo bảng cho OCP Study Application

-- Topics table (12 topics OCP)
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    month INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    estimated_days INTEGER
);

-- Subtopics table
CREATE TABLE subtopics (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty INTEGER NOT NULL DEFAULT 3,
    estimated_days INTEGER NOT NULL DEFAULT 1,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    order_index INTEGER NOT NULL
);

-- Flashcards table
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    subtopic_id BIGINT REFERENCES subtopics(id) ON DELETE SET NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    code_example TEXT,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    next_review TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Questions table (Quiz)
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    code_snippet TEXT,
    question_type VARCHAR(20) NOT NULL DEFAULT 'SINGLE_CHOICE',
    explanation TEXT,
    difficulty INTEGER NOT NULL DEFAULT 3
);

-- Question Options table
CREATE TABLE question_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_key VARCHAR(1) NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- Topic Progress table
CREATE TABLE topic_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    subtopic_id BIGINT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    notes TEXT,
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, subtopic_id)
);

-- Study Sessions table (for streak tracking)
CREATE TABLE study_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    study_date DATE NOT NULL,
    minutes_studied INTEGER NOT NULL DEFAULT 0,
    flashcards_reviewed INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    notes TEXT,
    UNIQUE(user_id, study_date)
);

-- Create indexes
CREATE INDEX idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX idx_flashcards_topic_id ON flashcards(topic_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review);
CREATE INDEX idx_questions_topic_id ON questions(topic_id);
CREATE INDEX idx_topic_progress_user_id ON topic_progress(user_id);
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, study_date);
