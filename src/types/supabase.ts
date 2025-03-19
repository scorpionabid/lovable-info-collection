/**
 * Supabase verilənlər bazası tiplərinin mərkəzləşdirilmiş tərifi
 * Bu fayl Supabase tərəfindən generasiya edilmiş tipləri ixrac edir
 */

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
          request_params: Json | null
          request_size: number | null
          response_size: number | null
          response_summary: Json | null
          status_code: number | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          duration_ms: number
          endpoint: string
          id?: string
          method: string
          request_params?: Json | null
          request_size?: number | null
          response_size?: number | null
          response_summary?: Json | null
          status_code?: number | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          duration_ms?: number
          endpoint?: string
          id?: string
          method?: string
          request_params?: Json | null
          request_size?: number | null
          response_size?: number | null
          response_summary?: Json | null
          status_code?: number | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          component: string | null
          created_at: string
          duration_ms: number | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          success: boolean | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          component?: string | null
          created_at?: string
          duration_ms?: number | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          success?: boolean | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          component?: string | null
          created_at?: string
          duration_ms?: number | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          success?: boolean | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          assignment: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          priority: number
          region_id: string | null
          school_id: string | null
          school_type_id: string | null
          sector_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assignment?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          priority?: number
          region_id?: string | null
          school_id?: string | null
          school_type_id?: string | null
          sector_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assignment?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          priority?: number
          region_id?: string | null
          school_id?: string | null
          school_type_id?: string | null
          sector_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          }
        ]
      }
      columns: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          options: Json | null
          order: number
          required: boolean
          type: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          options?: Json | null
          order?: number
          required?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          options?: Json | null
          order?: number
          required?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "columns_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      data: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category_id: string
          created_at: string
          created_by: string
          data: Json
          id: string
          rejection_reason: string | null
          school_id: string
          status: string
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category_id: string
          created_at?: string
          created_by: string
          data: Json
          id?: string
          rejection_reason?: string | null
          school_id: string
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string
          created_at?: string
          created_by?: string
          data?: Json
          id?: string
          rejection_reason?: string | null
          school_id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      data_history: {
        Row: {
          changed_at: string
          changed_by: string
          data: Json
          data_id: string
          id: string
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by: string
          data: Json
          data_id: string
          id?: string
          status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          data?: Json
          data_id?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_history_data_id_fkey"
            columns: ["data_id"]
            isOneToOne: false
            referencedRelation: "data"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      regions: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          code: string | null
          created_at: string
          id: string
          name: string
          region_id: string | null
          sector_id: string
          type_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: string
          name: string
          region_id?: string | null
          sector_id: string
          type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          region_id?: string | null
          sector_id?: string
          type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          }
        ]
      }
      sectors: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          region_id: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          region_id: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          region_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sectors_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_login: string | null
          last_name: string
          phone: string | null
          region_id: string | null
          role_id: string
          school_id: string | null
          sector_id: string | null
          updated_at: string | null
          utis_code: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name: string
          phone?: string | null
          region_id?: string | null
          role_id: string
          school_id?: string | null
          sector_id?: string | null
          updated_at?: string | null
          utis_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          phone?: string | null
          region_id?: string | null
          role_id?: string
          school_id?: string | null
          sector_id?: string | null
          updated_at?: string | null
          utis_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          }
        ]
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Əsas tip ixracları
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tez-tez istifadə edilən tiplər
export type User = Tables<'users'>
export type Role = Tables<'roles'>
export type Region = Tables<'regions'>
export type Sector = Tables<'sectors'>
export type School = Tables<'schools'>
export type Category = Tables<'categories'>
export type Column = Tables<'columns'>
export type Data = Tables<'data'>
export type DataHistory = Tables<'data_history'>
export type Notification = Tables<'notifications'>
