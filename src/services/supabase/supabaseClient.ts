
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://wxkaasjwpavlwrpvsuia.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
// Production layihəsində ətraf mühit dəyişəni ilə təmin edin
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4MDc3MCwiZXhwIjoyMDU1OTU2NzcwfQ.uvbYZXX9X9MwwqhQQeKmkNcqNLZXGY1X0F2YYQpzOFo";

// Normal istifadəçi əməliyyatları üçün standart müştəri
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// RLS-i bypass etmək üçün xidmət roluna malik müştəri
// Yalnız admin/server əməliyyatları üçün istifadə edin!
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_SERVICE_ROLE_KEY, 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

// Monitoring middleware for debugging Supabase operations
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
});
