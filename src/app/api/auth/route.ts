import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

export async function GET(): Promise<NextResponse<User | null>> {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    return NextResponse.json(user);
}
