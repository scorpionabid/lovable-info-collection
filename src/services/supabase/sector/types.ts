// Sorğu filtrləri
export interface FilterParams {
  searchQuery?: string;
  regionId?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
  archived?: string;
  [key: string]: any; // Allow additional filter parameters
}

// Sıralama parametrləri
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

// Səhifələmə parametrləri
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Sektor yaratmaq üçün məlumatlar
export interface SectorData {
  name: string;
  description?: string;
  region_id: string;
}

// Cədvəl və UI üçün sektor məlumatları
export interface SectorWithStats {
  id: string;
  name: string;
  description?: string;
  region_id: string;
  regionName: string;
  created_at: string; // Make this required
  schoolCount: number;
  completionRate: number;
  archived: boolean;
  // Compatibility with region module
  schools_count?: number;
  completion_rate?: number;
}

// Sektor əlavə etmə nəticəsi
export interface SectorCreationResult {
  success: boolean;
  data?: SectorWithStats;
  error?: string;
}

// Sektor yeniləmə nəticəsi
export interface SectorUpdateResult {
  success: boolean;
  data?: SectorWithStats;
  error?: string;
}

// Sektor silmə nəticəsi
export interface SectorDeletionResult {
  success: boolean;
  error?: string;
}
