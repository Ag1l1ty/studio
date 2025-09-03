CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT ('USR-' || EXTRACT(EPOCH FROM NOW())::TEXT),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'PM/SM', 'Viewer', 'Portfolio Manager')),
    avatar TEXT DEFAULT '',
    assigned_project_ids TEXT[] DEFAULT '{}',
    password TEXT NOT NULL,
    temporary_password BOOLEAN DEFAULT false,
    last_password_change TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
    id TEXT PRIMARY KEY DEFAULT ('PRJ-' || EXTRACT(EPOCH FROM NOW())::TEXT),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Muy conservador', 'Conservador', 'Moderado', 'Moderado - alto', 'Agresivo', 'Muy Agresivo', 'No Assessment')),
    risk_score INTEGER DEFAULT 0,
    budget NUMERIC NOT NULL,
    budget_spent NUMERIC DEFAULT 0,
    projected_deliveries INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_avatar TEXT DEFAULT '',
    metrics JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE deliveries (
    id TEXT PRIMARY KEY DEFAULT ('DLV-' || EXTRACT(EPOCH FROM NOW())::TEXT),
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    delivery_number INTEGER NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado')),
    budget NUMERIC NOT NULL,
    budget_spent NUMERIC DEFAULT 0,
    estimated_date DATE NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_budget_update TIMESTAMP WITH TIME ZONE,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_avatar TEXT DEFAULT '',
    is_archived BOOLEAN DEFAULT false,
    risk_assessed BOOLEAN DEFAULT false,
    error_count INTEGER DEFAULT 0,
    error_solution_time INTEGER DEFAULT 0,
    stage_dates JSONB DEFAULT '{}',
    budget_history JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE risk_profiles (
    id TEXT PRIMARY KEY DEFAULT ('RISK-' || EXTRACT(EPOCH FROM NOW())::TEXT),
    classification TEXT NOT NULL CHECK (classification IN ('Muy conservador', 'Conservador', 'Moderado', 'Moderado - alto', 'Agresivo', 'Muy Agresivo')),
    score TEXT NOT NULL,
    deviation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_stage ON projects(stage);
CREATE INDEX idx_projects_risk_level ON projects(risk_level);
CREATE INDEX idx_deliveries_project_id ON deliveries(project_id);
CREATE INDEX idx_deliveries_stage ON deliveries(stage);

INSERT INTO risk_profiles (classification, score, deviation) VALUES
    ('Muy Agresivo', '>= 18', '+200%'),
    ('Agresivo', '12 - 17', '+100%'),
    ('Moderado - alto', '10 - 11', '+70%'),
    ('Moderado', '6 - 9', '+40%'),
    ('Conservador', '3 - 5', '+20%'),
    ('Muy conservador', '1 - 2', '+10%');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_profiles_updated_at BEFORE UPDATE ON risk_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
