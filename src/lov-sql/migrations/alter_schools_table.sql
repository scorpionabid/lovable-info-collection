
-- Add missing columns to the schools table
ALTER TABLE IF EXISTS schools
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS director TEXT,
ADD COLUMN IF NOT EXISTS student_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS teacher_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Aktiv',
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Add the same for the regions table if missing
ALTER TABLE IF EXISTS regions
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add the same for the sectors table if missing
ALTER TABLE IF EXISTS sectors
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Rename metrics to api_metrics if exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'metrics') THEN
    ALTER TABLE metrics RENAME TO api_metrics;
  END IF;
END $$;

-- Rename audit_log to audit_logs if exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'audit_log') THEN
    ALTER TABLE audit_log RENAME TO audit_logs;
  END IF;
END $$;

-- Rename data_entries to data if exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'data_entries') THEN
    ALTER TABLE data_entries RENAME TO data;
  END IF;
END $$;
