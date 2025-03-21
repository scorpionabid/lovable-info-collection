-- Supabase SQL Editor-da icra etmək üçün indeks yaratma skripti
-- Tez-tez sorğulanan sütunlar üçün indekslər yaradırıq

-- Sektorlar cədvəli üçün indekslər
CREATE INDEX IF NOT EXISTS idx_sectors_name ON sectors(name);
CREATE INDEX IF NOT EXISTS idx_sectors_region_id ON sectors(region_id);
CREATE INDEX IF NOT EXISTS idx_sectors_created_at ON sectors(created_at);
CREATE INDEX IF NOT EXISTS idx_sectors_archived ON sectors(archived);

-- Regionlar cədvəli üçün indekslər
CREATE INDEX IF NOT EXISTS idx_regions_name ON regions(name);

-- Məktəblər cədvəli üçün indekslər (əgər varsa)
CREATE INDEX IF NOT EXISTS idx_schools_sector_id ON schools(sector_id);
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name);

-- Materiallaşdırılmış görünüş yaratmaq (əgər schools cədvəli varsa)
-- Bu, sektor statistikalarını hesablamaq üçün performansı artıracaq
CREATE MATERIALIZED VIEW IF NOT EXISTS sector_stats AS
SELECT 
  s.id as sector_id,
  COUNT(sch.id) as school_count,
  AVG(COALESCE(sch.completion_rate, 0)) as avg_completion_rate
FROM 
  sectors s
LEFT JOIN 
  schools sch ON s.id = sch.sector_id
GROUP BY 
  s.id;

-- Materiallaşdırılmış görünüşü yeniləmək üçün funksiya
CREATE OR REPLACE FUNCTION refresh_sector_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW sector_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger yaratmaq (əgər schools cədvəli varsa)
DROP TRIGGER IF EXISTS refresh_sector_stats_trigger ON schools;
CREATE TRIGGER refresh_sector_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON schools
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_sector_stats();
