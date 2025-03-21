
-- Add missing columns to the schools table
ALTER TABLE IF EXISTS schools
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS director TEXT,
ADD COLUMN IF NOT EXISTS student_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS teacher_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Aktiv';

-- Add the same for the regions table if missing
ALTER TABLE IF EXISTS regions
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add the same for the sectors table if missing
ALTER TABLE IF EXISTS sectors
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;
