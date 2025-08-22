import { notFound, redirect, RedirectType } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

const PostDetailsPage = async ({
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
        .eq('id', postID);

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

                {status === 200 && data && !error && <p>{data[0].content}</p>}

                {data && data[0].author_id === user.id && (
                    <div className="flex justify-center">
                        <Link
                            href={`${data[0].id}/settings`}
                            className="btn btn-primary btn-md w-full md:max-w-60 mt-5"
                        >
                            Edit Post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetailsPage;
