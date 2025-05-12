import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please click the "Connect to Supabase" button in the top right to set up your database connection.');
}
console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'dashmanager' }
  }
});

// Helper to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    // First check if we have valid credentials
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Try to make a simple query to verify the connection
    const { data, error } = await supabase
      .from('people')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      // Handle specific Supabase errors
      if (error.code === 'PGRST301') {
        throw new Error('Database connection error: Invalid API key');
      } else if (error.code === '20014') {
        throw new Error('Database connection error: Invalid Supabase URL');
      } else {
        throw error;
      }
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.error('Network error while connecting to Supabase:', error);
        throw new Error('Unable to connect to the database. Please check your internet connection and try again.');
      }
      console.error('Supabase connection error:', error);
      throw error;
    }
    throw new Error('An unexpected error occurred while connecting to the database');
  }
};