
-- Add missing columns to the regions table
ALTER TABLE IF EXISTS regions
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add missing columns to the sectors table
ALTER TABLE IF EXISTS sectors
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Add missing columns to the schools table
ALTER TABLE IF EXISTS schools
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS director TEXT,
ADD COLUMN IF NOT EXISTS student_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS teacher_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Aktiv',
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Rename tables if they exist with old names
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'metrics') THEN
    ALTER TABLE metrics RENAME TO api_metrics;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'audit_log') THEN
    ALTER TABLE audit_log RENAME TO audit_logs;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'data_entries') THEN
    ALTER TABLE data_entries RENAME TO data;
  END IF;
END $$;
