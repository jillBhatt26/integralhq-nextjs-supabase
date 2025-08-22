import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { TPost } from '@/lib/types/posts';
import { ZodError } from 'zod';
import { postContentSchema } from '@/lib/validations/posts';

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PostgrestSingleResponse<TPost[]>>> {
    const postID = (await params).id;

    const supabase = await createClient();

    const res = await supabase.from('posts').select().eq('id', postID);

    return NextResponse.json(res);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PostgrestSingleResponse<TPost[]> | string>> {
    try {
        const body = await request.json();

        const validatedUpdatePostBody = postContentSchema.parse(body);

        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        const postID = (await params).id;

        const res = await supabase
            .from('posts')
            .update({ content: validatedUpdatePostBody.content })
            .eq('id', postID)
            .eq('author_id', user!.id)
            .select();

        return NextResponse.json(res);
    } catch (error: unknown) {
        if (error instanceof ZodError)
            return NextResponse.json(
                error.issues.map(issue => issue.message).join(', ')
            );

        return NextResponse.json('Failed to update post!');
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PostgrestSingleResponse<null>>> {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();
    const postID = (await params).id;

    const res = await supabase
        .from('posts')
        .delete()
        .eq('id', postID)
        .eq('author_id', user!.id);

    return NextResponse.json(res);
}
