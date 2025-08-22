import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { TPost } from '@/lib/types/posts';
import { postContentSchema } from '@/lib/validations/posts';
import { ZodError } from 'zod';

export async function GET(): Promise<
    NextResponse<PostgrestSingleResponse<TPost[]>>
> {
    const supabase = await createClient();

    const res = await supabase.from('posts').select();

    return NextResponse.json(res);
}

export async function POST(
    request: NextRequest
): Promise<NextResponse<PostgrestSingleResponse<TPost[]> | ZodError | string>> {
    try {
        const body = await request.json();

        const validatedPostBody = postContentSchema.parse(body);

        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        const res = await supabase
            .from('posts')
            .insert([
                { content: validatedPostBody.content, author_id: user!.id }
            ])
            .select();

        return NextResponse.json(res);
    } catch (error: unknown) {
        if (error instanceof ZodError)
            return NextResponse.json(
                error.issues.map(issue => issue.message).join(', ')
            );

        return NextResponse.json('Failed to create new post!');
    }
}
