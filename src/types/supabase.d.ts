
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      api_metrics: {
        Row: {
          duration_ms: number;
          endpoint: string;
          id: string;
          method: string;
          request_params: Json;
          request_size: number;
          response_size: number;
          response_summary: Json;
          status_code: number;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          duration_ms: number;
          endpoint: string;
          id?: string;
          method: string;
          request_params?: Json;
          request_size?: number;
          response_size?: number;
          response_summary?: Json;
          status_code?: number;
          timestamp?: string;
          user_id?: string;
        };
        Update: {
          duration_ms?: number;
          endpoint?: string;
          id?: string;
          method?: string;
          request_params?: Json;
          request_size?: number;
          response_size?: number;
          response_summary?: Json;
          status_code?: number;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role_id: string;
          region_id?: string;
          sector_id?: string;
          school_id?: string;
          phone?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login?: string;
          utis_code?: string;
          avatar_url?: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role_id: string;
          region_id?: string;
          sector_id?: string;
          school_id?: string;
          phone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
          utis_code?: string;
          avatar_url?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role_id?: string;
          region_id?: string;
          sector_id?: string;
          school_id?: string;
          phone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
          utis_code?: string;
          avatar_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_region_id_fkey";
            columns: ["region_id"];
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_sector_id_fkey";
            columns: ["sector_id"];
            referencedRelation: "sectors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_school_id_fkey";
            columns: ["school_id"];
            referencedRelation: "schools";
            referencedColumns: ["id"];
          }
        ];
      };
      regions: {
        Row: {
          id: string;
          name: string;
          code?: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sectors: {
        Row: {
          id: string;
          name: string;
          region_id: string;
          description?: string;
          created_at: string;
          updated_at: string;
          archived?: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          region_id: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          archived?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          region_id?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          archived?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "sectors_region_id_fkey";
            columns: ["region_id"];
            referencedRelation: "regions";
            referencedColumns: ["id"];
          }
        ];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          code: string;
          region_id: string;
          sector_id: string;
          type_id: string;
          address: string;
          director?: string;
          email?: string;
          phone?: string;
          status?: string;
          student_count?: number;
          teacher_count?: number;
          created_at: string;
          updated_at: string;
          archived: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          region_id: string;
          sector_id: string;
          type_id: string;
          address: string;
          director?: string;
          email?: string;
          phone?: string;
          status?: string;
          student_count?: number;
          teacher_count?: number;
          created_at?: string;
          updated_at?: string;
          archived?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          region_id?: string;
          sector_id?: string;
          type_id?: string;
          address?: string;
          director?: string;
          email?: string;
          phone?: string;
          status?: string;
          student_count?: number;
          teacher_count?: number;
          created_at?: string;
          updated_at?: string;
          archived?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "schools_region_id_fkey";
            columns: ["region_id"];
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schools_sector_id_fkey";
            columns: ["sector_id"];
            referencedRelation: "sectors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schools_type_id_fkey";
            columns: ["type_id"];
            referencedRelation: "school_types";
            referencedColumns: ["id"];
          }
        ];
      };
      school_types: {
        Row: {
          id: string;
          name: string;
          description?: string;
          created_at: string;
          updated_at: string;
          created_by?: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description?: string;
          permissions?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          permissions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          permissions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description?: string;
          region_id?: string;
          sector_id?: string;
          school_id?: string;
          school_type_id?: string;
          created_by?: string;
          status: string;
          priority: number;
          assignment?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          region_id?: string;
          sector_id?: string;
          school_id?: string;
          school_type_id?: string;
          created_by?: string;
          status?: string;
          priority?: number;
          assignment?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          region_id?: string;
          sector_id?: string;
          school_id?: string;
          school_type_id?: string;
          created_by?: string;
          status?: string;
          priority?: number;
          assignment?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      columns: {
        Row: {
          id: string;
          category_id?: string;
          name: string;
          type: string;
          description?: string;
          required?: boolean;
          options?: Json;
          order?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string;
          name: string;
          type: string;
          description?: string;
          required?: boolean;
          options?: Json;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          type?: string;
          description?: string;
          required?: boolean;
          options?: Json;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      data: {
        Row: {
          id: string;
          category_id?: string;
          school_id?: string;
          data: Json;
          status: string;
          created_by?: string;
          approved_by?: string;
          submitted_at?: string;
          approved_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string;
          school_id?: string;
          data: Json;
          status?: string;
          created_by?: string;
          approved_by?: string;
          submitted_at?: string;
          approved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          school_id?: string;
          data?: Json;
          status?: string;
          created_by?: string;
          approved_by?: string;
          submitted_at?: string;
          approved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      data_history: {
        Row: {
          id: string;
          data_id?: string;
          data: Json;
          status: string;
          changed_by?: string;
          changed_at: string;
        };
        Insert: {
          id?: string;
          data_id?: string;
          data: Json;
          status: string;
          changed_by?: string;
          changed_at?: string;
        };
        Update: {
          id?: string;
          data_id?: string;
          data?: Json;
          status?: string;
          changed_by?: string;
          changed_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id?: string;
          title: string;
          body: string;
          notification_type: string;
          action_url?: string;
          data?: Json;
          is_read?: boolean;
          read_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          body: string;
          notification_type: string;
          action_url?: string;
          data?: Json;
          is_read?: boolean;
          read_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          notification_type?: string;
          action_url?: string;
          data?: Json;
          is_read?: boolean;
          read_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          table_name: string;
          record_id?: string;
          old_data?: Json;
          new_data?: Json;
          user_id?: string;
          created_at: string;
          component?: string;
          ip_address?: string;
          user_agent?: string;
          metadata?: Json;
          success?: boolean;
          duration_ms?: number;
        };
        Insert: {
          id?: string;
          action: string;
          table_name: string;
          record_id?: string;
          old_data?: Json;
          new_data?: Json;
          user_id?: string;
          created_at?: string;
          component?: string;
          ip_address?: string;
          user_agent?: string;
          metadata?: Json;
          success?: boolean;
          duration_ms?: number;
        };
        Update: {
          id?: string;
          action?: string;
          table_name?: string;
          record_id?: string;
          old_data?: Json;
          new_data?: Json;
          user_id?: string;
          created_at?: string;
          component?: string;
          ip_address?: string;
          user_agent?: string;
          metadata?: Json;
          success?: boolean;
          duration_ms?: number;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      get_school_types: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          name: string;
        }[];
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};
