-- Database Schema for Voting System
-- PostgreSQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS voters CASCADE;
DROP TABLE IF EXISTS elections CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Admins Table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Elections Table
CREATE TABLE elections (
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    candidates JSONB NOT NULL, -- Array of candidate objects [{id: 0, name: "Alice"}, ...]
    registration_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registration_end TIMESTAMP,
    voting_start TIMESTAMP,
    voting_end TIMESTAMP,
    reveal_end TIMESTAMP,
    current_phase VARCHAR(50) DEFAULT 'registration', -- registration, commit, reveal, ended
    created_by INTEGER REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voters Table
CREATE TABLE voters (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    organization_id VARCHAR(100) NOT NULL, -- Student ID, Employee ID, etc.
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    wallet_address VARCHAR(42) NOT NULL,
    registration_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    blockchain_synced BOOLEAN DEFAULT FALSE, -- Has address been added to smart contract?
    has_committed BOOLEAN DEFAULT FALSE,
    has_revealed BOOLEAN DEFAULT FALSE,
    vote_salt VARCHAR(66), -- Stored securely for user's reference
    approved_by INTEGER REFERENCES admins(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, organization_id),
    UNIQUE(election_id, wallet_address)
);

-- Optional: Votes Table for analytics (stores only aggregated data, not individual votes)
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id INTEGER NOT NULL,
    vote_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, candidate_id)
);

-- Indexes for performance
CREATE INDEX idx_voters_election ON voters(election_id);
CREATE INDEX idx_voters_status ON voters(registration_status);
CREATE INDEX idx_voters_wallet ON voters(wallet_address);
CREATE INDEX idx_voters_org_id ON voters(organization_id);
CREATE INDEX idx_elections_phase ON elections(current_phase);
CREATE INDEX idx_elections_contract ON elections(contract_address);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_elections_updated_at BEFORE UPDATE ON elections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON voters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample admin user (password: admin123 - CHANGE IN PRODUCTION)
-- Password hash generated with bcrypt
INSERT INTO admins (email, password_hash, full_name) VALUES 
('admin@example.com', '$2a$10$8K1p/a0dL3LR9T7P8qGW8eTxZ5NQ.NqEwx.KtqJXJZR7Y3h2p8w1i', 'System Administrator');

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO voting_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO voting_user;
