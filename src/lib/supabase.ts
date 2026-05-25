import { createClient } from '@supabase/supabase-js';

// O usuário deverá configurar estas variáveis em um arquivo .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-aqui.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-anon-key-aqui';

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);
