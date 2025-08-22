import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { loginUserSchema } from '@/lib/validations/auth';
import { createClient } from '@/utils/supabase/server';

export async function POST(
    request: NextRequest
): Promise<NextResponse<AuthTokenResponsePassword | string>> {
    try {
        const body = await request.json();

        const validatedLoginBody = loginUserSchema.parse(body);

        const supabase = await createClient();

        const res = await supabase.auth.signInWithPassword({
            email: validatedLoginBody.email,
            password: validatedLoginBody.password
        });

        return NextResponse.json(res);
    } catch (error: unknown) {
        if (error instanceof ZodError)
            return NextResponse.json(
                error.issues.map(issue => issue.message).join(', ')
            );

        return NextResponse.json('Failed to login user!');
    }
}
