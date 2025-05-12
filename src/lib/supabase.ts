import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation for Supabase credentials
if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please ensure VITE_SUPABASE_URL is set in your .env file');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Please ensure VITE_SUPABASE_ANON_KEY is set in your .env file');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL value');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test connection
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('people').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Successfully connected to Supabase');
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
};