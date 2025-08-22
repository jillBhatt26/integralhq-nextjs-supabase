import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/constants/env';

export function createClient() {
    return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
