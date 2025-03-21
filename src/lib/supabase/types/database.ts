
// Type definitions from Supabase's schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_metrics: {
        Row: {
          duration_ms: number
          endpoint: string
          id: string
          method: string
          request_params: Json
          request_size: number
          response_size: number
          response_summary: Json
          status_code: number
          timestamp: string
          user_id: string
        }
        Insert: {
          duration_ms: number
          endpoint: string
          id?: string
          method: string
          request_params: Json
          request_size: number
          response_size: number
          response_summary: Json
          status_code: number
          timestamp?: string
          user_id: string
        }
        Update: {
          duration_ms?: number
          endpoint?: string
          id?: string
          method?: string
          request_params?: Json
          request_size?: number
          response_size?: number
          response_summary?: Json
          status_code?: number
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      // ... Additional tables definitions
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
