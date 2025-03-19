
// Sorğu filtrləri
export interface FilterParams {
  searchQuery?: string;
  regionId?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
  archived?: string;
  [key: string]: any; // Allow additional filter parameters
  name?: string; // Added to support region queries
  code?: string; // Added to support region queries
  status?: string; // Added to support region queries
}

// Sıralama parametrləri
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

// SortConfig for region data
export interface SortConfig {
  field?: string;
  direction?: 'asc' | 'desc';
  column?: string; // Added to support region queries
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
  created_at: string; // Required
  schoolCount: number;
  completionRate: number;
  archived: boolean;
  // Compatibility with region module
  schools_count?: number;
  completion_rate?: number;
  // Additional fields for RegionDetails.tsx
  region?: { id: string; name: string; };
  code?: string;
  sectors_count?: number;
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

// SectorTable props definition for RegionDetails.tsx
export interface SectorTableProps {
  sectors: SectorWithStats[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEditSector: (sector: SectorWithStats) => void;
  onDeleteSector: (sectorId: string) => void;
  onDataChange?: () => void;
}

// SectorModal props definition
export interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  sectorId?: string;
  regionId?: string;
  onSuccess?: () => void;
}
