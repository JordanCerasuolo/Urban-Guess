-- City Geo Typing Database Schema
-- Complete schema reference file (matches migration 001_initial_schema.sql)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for continent-scoped gameplay
CREATE TYPE continent_type AS ENUM (
    'AFRICA',
    'ANTARCTICA',
    'ASIA',
    'EUROPE',
    'NORTH_AMERICA',
    'OCEANIA',
    'SOUTH_AMERICA'
);

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CITIES TABLE
-- ============================================================================
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    continent continent_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    normalized_answer VARCHAR(150) NOT NULL,
    satellite_image_data BYTEA,
    satellite_image_mime_type VARCHAR(50),
    description TEXT,
    hint_1 TEXT,
    hint_2 TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cities_continent_country_name UNIQUE (continent, country, name)
);

-- ============================================================================
-- QUIZ RUNS TABLE
-- ============================================================================
CREATE TABLE quiz_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    continent continent_type NOT NULL,
    score_total INTEGER NOT NULL DEFAULT 0,
    num_rounds INTEGER NOT NULL DEFAULT 5 CHECK (num_rounds > 0),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- QUIZ ROUNDS TABLE
-- ============================================================================
CREATE TABLE quiz_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_run_id UUID NOT NULL REFERENCES quiz_runs(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    round_order INTEGER NOT NULL CHECK (round_order >= 1 AND round_order <= 5),
    points_earned INTEGER NOT NULL DEFAULT 0 CHECK (points_earned >= 0 AND points_earned <= 5),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_try_number INTEGER CHECK (resolved_try_number >= 1 AND resolved_try_number <= 3),
    gave_up BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_quiz_rounds_run_order UNIQUE (quiz_run_id, round_order),
    CONSTRAINT uq_quiz_rounds_run_city UNIQUE (quiz_run_id, city_id)
);

-- ============================================================================
-- ROUND SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE round_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    round_id UUID NOT NULL REFERENCES quiz_rounds(id) ON DELETE CASCADE,
    try_number INTEGER NOT NULL CHECK (try_number >= 1 AND try_number <= 3),
    typed_answer_raw VARCHAR(150),
    typed_answer_normalized VARCHAR(150),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    is_given_up BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_round_submissions_round_try UNIQUE (round_id, try_number),
    CONSTRAINT chk_round_submissions_payload CHECK (
        (is_given_up = TRUE AND typed_answer_raw IS NULL AND typed_answer_normalized IS NULL) OR
        (is_given_up = FALSE AND typed_answer_raw IS NOT NULL)
    )
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE UNIQUE INDEX idx_users_username ON users(username);
CREATE UNIQUE INDEX idx_users_email ON users(email);

CREATE INDEX idx_cities_continent_active ON cities(continent, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_cities_normalized_answer ON cities(normalized_answer);

CREATE INDEX idx_quiz_runs_user_id ON quiz_runs(user_id);
CREATE INDEX idx_quiz_runs_continent ON quiz_runs(continent);
CREATE INDEX idx_quiz_runs_continent_score ON quiz_runs(continent, score_total DESC);
CREATE INDEX idx_quiz_runs_user_ended ON quiz_runs(user_id, ended_at DESC) WHERE ended_at IS NOT NULL;

CREATE INDEX idx_quiz_rounds_quiz_run_id ON quiz_rounds(quiz_run_id);
CREATE INDEX idx_quiz_rounds_city_id ON quiz_rounds(city_id);

CREATE INDEX idx_round_submissions_round_id ON round_submissions(round_id);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE users IS 'Stores registered users of the game application.';
COMMENT ON TABLE cities IS 'Stores cities with continent metadata, optional description, two in-game hints, canonical normalized answer, and optional satellite image bytes.';
COMMENT ON COLUMN cities.description IS 'General city description (e.g. for profiles or listings).';
COMMENT ON COLUMN cities.hint_1 IS 'First hint to serve in-game (e.g. after first wrong guess).';
COMMENT ON COLUMN cities.hint_2 IS 'Second hint to serve in-game (e.g. after second wrong guess).';
COMMENT ON TABLE quiz_runs IS 'Represents one 5-round continent-scoped quiz run for a user.';
COMMENT ON TABLE quiz_rounds IS 'Stores each city presented in a quiz run and resolved score/status.';
COMMENT ON TABLE round_submissions IS 'Stores per-try user submissions for each round including optional give-up marker.';

COMMENT ON COLUMN cities.normalized_answer IS 'Canonical normalized city answer used after raw city-name comparison fails.';
COMMENT ON COLUMN round_submissions.typed_answer_normalized IS 'Normalized user input using strict_punctless rules.';

