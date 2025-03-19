-- tests/supabase/seed.sql

-- Insert roles with UUID values
INSERT INTO roles (id, name, description, permissions) VALUES
('11111111-1111-1111-1111-111111111111', 'SuperAdmin', 'System administrator', '{read:all,write:all,delete:all}'),
('22222222-2222-2222-2222-222222222222', 'RegionAdmin', 'Regional administrator', '{read:region,write:region,read:sector,write:sector,read:school,write:school}'),
('33333333-3333-3333-3333-333333333333', 'SectorAdmin', 'Sector administrator', '{read:sector,write:sector,read:school,write:school}'),
('44444444-4444-4444-4444-444444444444', 'SchoolAdmin', 'School administrator', '{read:school,write:school}');

-- Insert regions
INSERT INTO regions (id, name, description, code) VALUES
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Bakı', 'Bakı şəhəri', 'BAK'),
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Sumqayıt', 'Sumqayıt şəhəri', 'SMQ');

-- Insert sectors
INSERT INTO sectors (id, name, description, region_id) VALUES
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Bakı Mərkəz', 'Bakı mərkəz rayonu', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'),
('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Bakı Sabunçu', 'Bakı Sabunçu rayonu', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'),
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Sumqayıt Mərkəz', 'Sumqayıt mərkəz rayonu', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

-- Insert schools
INSERT INTO schools (id, name, region_id, sector_id, address, director, contact_email, contact_phone) VALUES
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Məktəb №1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Bakı, Mərkəz', 'Müdir 1', 'mekteb1@edu.az', '+994501112233'),
('g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'Məktəb №2', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Bakı, Sabunçu', 'Müdir 2', 'mekteb2@edu.az', '+994502223344'),
('h8h8h8h8-h8h8-h8h8-h8h8-h8h8h8h8h8h8', 'Məktəb №3', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Sumqayıt, Mərkəz', 'Müdir 3', 'mekteb3@edu.az', '+994503334455');

-- Insert test users
INSERT INTO users (id, email, first_name, last_name, role_id, region_id, sector_id, school_id, utis_code) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'superadmin@edu.az', 'Super', 'Admin', '11111111-1111-1111-1111-111111111111', NULL, NULL, NULL, 'SA001'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'region@infoline.az', 'Region', 'Admin', '22222222-2222-2222-2222-222222222222', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', NULL, NULL, 'RA001'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'sector@infoline.az', 'Sector', 'Admin', '33333333-3333-3333-3333-333333333333', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NULL, 'SA002'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'school@infoline.az', 'School', 'Admin', '44444444-4444-4444-4444-444444444444', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'SA003'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'test@example.com', 'Test', 'User', '11111111-1111-1111-1111-111111111111', NULL, NULL, NULL, 'TEST001');