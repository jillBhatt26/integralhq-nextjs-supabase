import { AuthResponse } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { signupUserSchema } from '@/lib/validations/auth';

export async function POST(
    request: NextRequest
): Promise<NextResponse<AuthResponse | string>> {
    try {
        const body = await request.json();

        const validatedSignupBody = signupUserSchema.parse(body);

        const supabase = await createClient();

        const res = await supabase.auth.signUp({
            email: validatedSignupBody.email,
            password: validatedSignupBody.password
        });

        await supabase
            .from('profiles')
            .insert([
                {
                    id: res.data.user!.id,
                    username: validatedSignupBody.username
                }
            ])
            .select();

        return NextResponse.json(res);
    } catch (error: unknown) {
        if (error instanceof ZodError)
            return NextResponse.json(
                error.issues.map(issue => issue.message).join(', ')
            );

        return NextResponse.json('Failed to signup user!');
    }
}
