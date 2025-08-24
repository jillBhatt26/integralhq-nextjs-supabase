import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { UserResponse } from '@supabase/supabase-js';

export async function GET(): Promise<NextResponse<UserResponse>> {
    const supabase = await createClient();

    const res = await supabase.auth.getUser();

    return NextResponse.json(res);
}
