import { notFound, redirect, RedirectType } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { createClient } from '@/utils/supabase/server';

const PostSettingsPage = async ({
    params
}: {
    params: Promise<{ id: string }>;
}) => {
    const postID = (await params).id;

    const supabase = await createClient();

    const {
        data: { user },
        error: authUserError
    } = await supabase.auth.getUser();

    // NOTE: This step is just to remove TypeScript null check. User auth check is already handled in middleware.
    if (!user || authUserError) return redirect('/login', RedirectType.replace);

    const { status, data, error } = await supabase
        .from('posts')
        .select()
        .eq('id', postID)
        .eq('author_id', user!.id);

    if (data && data.length === 0) {
        return notFound();
    }

    return (
        <div className="container mx-auto my-8 lg:my-14 px-5 lg:px-0">
            <div>
                {status !== 200 && error && (
                    <div role="alert" className="alert alert-error alert-soft">
                        <span>
                            {error.message ?? 'Error! Failed to fetch post!'}
                        </span>
                    </div>
                )}

                {status === 200 && data && !error && (
                    <>
                        <PostForm purpose="update" toUpdatePost={data[0]} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PostSettingsPage;
