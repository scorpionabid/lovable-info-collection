
/**
 * Supabase verilənlər bazası tipi
 */

export interface Database {
  public: {
    Tables: {
      api_metrics: {
        Row: {
          duration_ms: number;
          endpoint: string;
          id: string;
          method: string;
          request_params: any;
          request_size: number;
          response_size: number;
          response_summary: any;
          status_code: number;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          duration_ms: number;
          endpoint: string;
          id?: string;
          method: string;
          request_params?: any;
          request_size?: number;
          response_size?: number;
          response_summary?: any;
          status_code?: number;
          timestamp?: string;
          user_id?: string;
        };
        Update: {
          duration_ms?: number;
          endpoint?: string;
          id?: string;
          method?: string;
          request_params?: any;
          request_size?: number;
          response_size?: number;
          response_summary?: any;
          status_code?: number;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      // Digər tablolar üçün bənzər tip təyini...
      // Sadəcə nümunə üçün yoxlanılacaq məlumat komponentləri üçün minimum təyin edilmiş tipi buraxırıq
      // Refactoring tamamlandıqda bu tipləri davam etmək lazım olacaq
    };
    Views: {}; 
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// Məlumat bazası tipi ilə generik tipler
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// JSON tipi
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
