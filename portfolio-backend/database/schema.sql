-- ============================================
-- PORTFOLIO CMS DATABASE SCHEMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ADMIN'
    CHECK (role IN ('ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

-- ============================================
-- ABOUT
-- ============================================

CREATE TABLE IF NOT EXISTS about (
                                     id SMALLINT PRIMARY KEY DEFAULT 1
                                     CHECK (id = 1),
    full_name VARCHAR(150),
    headline VARCHAR(255),
    bio TEXT,
    profile_image_url TEXT,
    resume_url TEXT,
    location VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

-- ============================================
-- SKILLS
-- ============================================

CREATE TABLE IF NOT EXISTS skills (
                                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
    icon VARCHAR(100),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_skills_order
    ON skills(display_order);

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_projects_featured
    ON projects(featured);

CREATE INDEX IF NOT EXISTS idx_projects_order
    ON projects(display_order);

-- ============================================
-- BLOGS
-- ============================================

CREATE TABLE IF NOT EXISTS blogs (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'PUBLISHED')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_blogs_slug
    ON blogs(slug);

CREATE INDEX IF NOT EXISTS idx_blogs_status
    ON blogs(status);

-- ============================================
-- EXPERIENCE
-- ============================================

CREATE TABLE IF NOT EXISTS experience (
                                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    location VARCHAR(255),
    employment_type VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
              end_date IS NULL
              OR end_date >= start_date
          )
    );

-- ============================================
-- TESTIMONIALS
-- ============================================

CREATE TABLE IF NOT EXISTS testimonials (
                                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150),
    company VARCHAR(200),
    avatar_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

-- ============================================
-- SERVICES
-- ============================================

CREATE TABLE IF NOT EXISTS services (
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

-- ============================================
-- CONTACT MESSAGES
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UNREAD'
    CHECK (status IN ('UNREAD', 'READ', 'REPLIED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_messages_status
    ON messages(status);

CREATE INDEX IF NOT EXISTS idx_messages_created_at
    ON messages(created_at DESC);

-- ============================================
-- MEDIA
-- ============================================

CREATE TABLE IF NOT EXISTS media (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_media_uploaded_by
    ON media(uploaded_by);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS about_updated_at ON about;

CREATE TRIGGER about_updated_at
    BEFORE UPDATE ON about
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS skills_updated_at ON skills;

CREATE TRIGGER skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS blogs_updated_at ON blogs;

CREATE TRIGGER blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS experience_updated_at ON experience;

CREATE TRIGGER experience_updated_at
    BEFORE UPDATE ON experience
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;

CREATE TRIGGER testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS services_updated_at ON services;

CREATE TRIGGER services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();