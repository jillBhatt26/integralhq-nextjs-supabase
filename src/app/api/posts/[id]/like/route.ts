import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { TLike } from '@/lib/types/likes';

export async function POST(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PostgrestSingleResponse<TLike[]>>> {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    const postID = (await params).id;

    const res = await supabase
        .from('likes')
        .insert([{ post_id: postID, user_id: user!.id }])
        .select();

    return NextResponse.json(res);
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
        .from('likes')
        .delete()
        .eq('post_id', postID)
        .eq('user_id', user!.id);

    return NextResponse.json(res);
}
