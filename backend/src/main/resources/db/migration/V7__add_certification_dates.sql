-- Add start_date and end_date columns to certifications table
ALTER TABLE certifications
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;
