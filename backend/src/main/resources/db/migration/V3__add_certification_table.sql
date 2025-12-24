-- Create certifications table
CREATE TABLE certifications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50)
);

-- Insert default OCP Certification
INSERT INTO certifications (name, code, description, icon)
VALUES ('OCP Java SE 11 Developer', '1Z0-819', 'Chứng chỉ Oracle Certified Professional: Java SE 11 Developer', '☕');

-- Add certification_id to topics table
ALTER TABLE topics ADD COLUMN certification_id BIGINT;

-- Update existing topics to belong to the default OCP Certification
UPDATE topics SET certification_id = (SELECT id FROM certifications WHERE code = '1Z0-819');

-- Add Foreign Key constraint (ensure not null after update)
ALTER TABLE topics ALTER COLUMN certification_id SET NOT NULL;
ALTER TABLE topics ADD CONSTRAINT fk_topics_certification FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE;

-- Create index
CREATE INDEX idx_topics_certification_id ON topics(certification_id);
