import { AuthError } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(): Promise<
    NextResponse<{
        error: AuthError | null;
    }>
> {
    const supabase = await createClient();

    const res = await supabase.auth.signOut();

    return NextResponse.json(res);
}
