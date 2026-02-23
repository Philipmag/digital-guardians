-- Digital Guardians Database Schema
-- PostgreSQL 15+

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE (Optional - for progress tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    
    -- Accessibility preferences
    preferences JSONB DEFAULT '{
        "font_size": "normal",
        "high_contrast": false,
        "audio_speed": "normal",
        "auto_read_aloud": false
    }',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- SESSIONS TABLE (Anonymous tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Session data
    preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ============================================================================
-- TUTORIALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tutorials (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'beginner',
    duration_minutes INT,
    
    thumbnail_url VARCHAR(500),
    has_audio BOOLEAN DEFAULT FALSE,
    has_quiz BOOLEAN DEFAULT FALSE,
    downloadable_pdf_url VARCHAR(500),
    
    sort_order INT DEFAULT 0,
    popularity_score INT DEFAULT 0,
    
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorials_category ON tutorials(category);
CREATE INDEX IF NOT EXISTS idx_tutorials_published ON tutorials(is_published) WHERE is_published = TRUE;

-- ============================================================================
-- TUTORIAL STEPS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tutorial_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutorial_id VARCHAR(100) REFERENCES tutorials(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    content_html TEXT NOT NULL,
    content_plain TEXT NOT NULL,
    
    image_url VARCHAR(500),
    image_alt TEXT,
    audio_url VARCHAR(500),
    audio_duration_seconds INT,
    
    tips JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tutorial_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_steps_tutorial ON tutorial_steps(tutorial_id);

-- ============================================================================
-- QUIZZES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(100) PRIMARY KEY,
    tutorial_id VARCHAR(100) REFERENCES tutorials(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    passing_score INT DEFAULT 60,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- QUIZ QUESTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(50) PRIMARY KEY,
    quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
    question_order INT NOT NULL,
    
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    
    scenario JSONB,
    options JSONB NOT NULL,
    correct_answer VARCHAR(50) NOT NULL,
    explanation TEXT NOT NULL,
    
    image_url VARCHAR(500),
    
    UNIQUE(quiz_id, question_order)
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz ON quiz_questions(quiz_id);

-- ============================================================================
-- USER PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    
    tutorial_id VARCHAR(100) REFERENCES tutorials(id),
    current_step INT DEFAULT 1,
    completed_at TIMESTAMPTZ,
    
    quiz_score INT,
    quiz_passed BOOLEAN,
    quiz_completed_at TIMESTAMPTZ,
    
    time_spent_seconds INT DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, tutorial_id),
    UNIQUE(session_id, tutorial_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_session ON user_progress(session_id);

-- ============================================================================
-- ANALYSIS LOGS TABLE (Privacy-Preserving)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analysis_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Privacy: Hash of content, not content itself
    content_hash VARCHAR(64),
    
    -- Results (anonymized)
    verdict VARCHAR(20) NOT NULL,
    confidence DECIMAL(3,2),
    risk_score INT,
    scam_type VARCHAR(50),
    
    -- Indicators (no PII)
    indicators JSONB,
    
    -- Metadata
    message_type VARCHAR(20),
    processing_time_ms INT,
    model_version VARCHAR(20),
    
    -- Anonymized tracking
    ip_hash VARCHAR(64),
    session_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_created ON analysis_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_verdict ON analysis_logs(verdict);
CREATE INDEX IF NOT EXISTS idx_analysis_scam_type ON analysis_logs(scam_type);

-- ============================================================================
-- FEEDBACK TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS analysis_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analysis_logs(id) ON DELETE SET NULL,
    
    feedback_type VARCHAR(30) NOT NULL,
    comment TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_analysis ON analysis_feedback(analysis_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON analysis_feedback(feedback_type);

-- ============================================================================
-- SCAM ALERTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS scam_alerts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    summary TEXT NOT NULL,
    full_content TEXT,
    
    scam_type VARCHAR(50),
    affected_regions JSONB DEFAULT '["CA", "US"]',
    
    is_active BOOLEAN DEFAULT TRUE,
    first_reported DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_active ON scam_alerts(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_alerts_created ON scam_alerts(created_at);

-- ============================================================================
-- GLOSSARY TERMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS glossary_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term VARCHAR(100) NOT NULL UNIQUE,
    definition TEXT NOT NULL,
    analogy TEXT,
    
    related_terms JSONB DEFAULT '[]',
    see_tutorial VARCHAR(100) REFERENCES tutorials(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_glossary_term ON glossary_terms(term);
CREATE INDEX IF NOT EXISTS idx_glossary_search ON glossary_terms 
    USING gin(to_tsvector('english', term || ' ' || definition));

-- ============================================================================
-- SCAM REPORTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS scam_reports (
    id VARCHAR(50) PRIMARY KEY,
    analysis_id UUID REFERENCES analysis_logs(id) ON DELETE SET NULL,
    
    report_id VARCHAR(50),
    scam_type VARCHAR(50),
    message_content TEXT,
    additional_info TEXT,
    contact_email VARCHAR(255),
    
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_analysis ON scam_reports(analysis_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON scam_reports(status);

-- ============================================================================
-- REFRESH TOKENS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
