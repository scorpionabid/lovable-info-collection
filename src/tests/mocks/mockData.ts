
// Mock data for testing

export const mockRegions = [
  { id: 'region-1', name: 'Bakı', description: 'Paytaxt', created_at: '2023-01-01T00:00:00Z' },
  { id: 'region-2', name: 'Sumqayıt', description: 'Sənaye şəhəri', created_at: '2023-01-02T00:00:00Z' },
  { id: 'region-3', name: 'Gəncə', description: 'İkinci böyük şəhər', created_at: '2023-01-03T00:00:00Z' }
];

export const mockSectors = [
  { id: 'sector-1', name: 'Xətai', region_id: 'region-1', description: 'Xətai rayonu', created_at: '2023-01-01T00:00:00Z' },
  { id: 'sector-2', name: 'Yasamal', region_id: 'region-1', description: 'Yasamal rayonu', created_at: '2023-01-02T00:00:00Z' },
  { id: 'sector-3', name: 'Suraxanı', region_id: 'region-1', description: 'Suraxanı rayonu', created_at: '2023-01-03T00:00:00Z' }
];

export const mockSchools = [
  { id: 'school-1', name: 'Məktəb #1', sector_id: 'sector-1', region_id: 'region-1', address: 'Ünvan 1', created_at: '2023-01-01T00:00:00Z' },
  { id: 'school-2', name: 'Məktəb #2', sector_id: 'sector-1', region_id: 'region-1', address: 'Ünvan 2', created_at: '2023-01-02T00:00:00Z' },
  { id: 'school-3', name: 'Məktəb #3', sector_id: 'sector-2', region_id: 'region-1', address: 'Ünvan 3', created_at: '2023-01-03T00:00:00Z' }
];

export const mockCategories = [
  { id: 'category-1', name: 'Əsas məlumatlar', description: 'Məktəb haqqında əsas məlumatlar', created_at: '2023-01-01T00:00:00Z' },
  { id: 'category-2', name: 'Statistik məlumatlar', description: 'Məktəb statistikaları', created_at: '2023-01-02T00:00:00Z' },
  { id: 'category-3', name: 'Resurslar', description: 'Məktəb resursları', created_at: '2023-01-03T00:00:00Z' }
];

export const mockColumns = [
  { id: 'column-1', category_id: 'category-1', name: 'Ad', type: 'text', required: true, created_at: '2023-01-01T00:00:00Z' },
  { id: 'column-2', category_id: 'category-1', name: 'Ünvan', type: 'text', required: true, created_at: '2023-01-01T00:00:00Z' },
  { id: 'column-3', category_id: 'category-2', name: 'Şagird sayı', type: 'number', required: true, created_at: '2023-01-02T00:00:00Z' },
  { id: 'column-4', category_id: 'category-2', name: 'Müəllim sayı', type: 'number', required: true, created_at: '2023-01-02T00:00:00Z' },
  { id: 'column-5', category_id: 'category-3', name: 'Sinif otaqları', type: 'number', required: true, created_at: '2023-01-03T00:00:00Z' }
];

export const mockUsers = [
  {
    id: 'user-1',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@infoline.az',
    role_id: 'role-1',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    first_name: 'Region',
    last_name: 'Admin',
    email: 'region@infoline.az',
    role_id: 'role-2',
    region_id: 'region-1',
    is_active: true,
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 'user-3',
    first_name: 'Sector',
    last_name: 'Admin',
    email: 'sector@infoline.az',
    role_id: 'role-3',
    region_id: 'region-1',
    sector_id: 'sector-1',
    is_active: true,
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: 'user-4',
    first_name: 'School',
    last_name: 'Admin',
    email: 'school@infoline.az',
    role_id: 'role-4',
    region_id: 'region-1',
    sector_id: 'sector-1',
    school_id: 'school-1',
    is_active: true,
    created_at: '2023-01-04T00:00:00Z'
  }
];
