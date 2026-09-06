import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://pprikcoyrnyaqewsmyvf.supabase.co';
const FALLBACK_ANON_KEY = 'sb_publishable_lQT6XgUkgZlDqw6IjN6AnQ_IB1MGT2j';

function resolveSupabaseUrl(): string {
    const rawUrl = import.meta.env.VITE_SUPABASE_URL;
    if (typeof rawUrl === 'string' && rawUrl.trim() && !rawUrl.includes('your_supabase')) {
        try {
            const parsed = new URL(rawUrl.trim());
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                return rawUrl.trim();
            }
        } catch {
            // Invalid URL format, fallback to working URL
        }
    }
    return FALLBACK_URL;
}

function resolveSupabaseAnonKey(): string {
    const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (typeof rawKey === 'string' && rawKey.trim() && !rawKey.includes('your_supabase')) {
        return rawKey.trim();
    }
    return FALLBACK_ANON_KEY;
}

export const supabase = createClient(resolveSupabaseUrl(), resolveSupabaseAnonKey());
