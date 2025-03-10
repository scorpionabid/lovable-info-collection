
// Try to use environment variables first, then fallback to the project ID from config.toml
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxkaasjwpavlwrpvsuia.supabase.co';
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM';

// Helper to check if we're in a development environment
export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};
