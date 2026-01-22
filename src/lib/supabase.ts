import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pprikcoyrnyaqewsmyvf.supabase.co';
const supabaseAnonKey = 'sb_publishable_lQT6XgUkgZlDqw6IjN6AnQ_IB1MGT2j';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
