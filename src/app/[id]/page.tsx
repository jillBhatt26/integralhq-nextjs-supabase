import { notFound, redirect, RedirectType } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { FaThumbsUp } from 'react-icons/fa6';
import LikeOrUnlikeButton from '@/components/LikeOrUnlikeButton';

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

    const {
        status: postStatus,
        data: postData,
        error: postError
    } = await supabase.from('posts').select().eq('id', postID);

    if (!postData || postData.length === 0) {
        return notFound();
    }

    const {
        status: authorStatus,
        data: authorData,
        error: authorError
    } = await supabase
        .from('profiles')
        .select()
        .eq('id', postData[0].author_id);

    const { status: checkLikeStatus, data: checkLikeData } = await supabase
        .from('likes')
        .select()
        .eq('user_id', user.id)
        .eq('post_id', postData[0].id);

    const { count: likesCount, status: likesCountStatus } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true }) // 'head: true' returns only the count, not the data
        .eq('post_id', postData[0].id);

    return (
        <div className="container mx-auto my-8 lg:my-14 px-5 lg:px-0">
            <div>
                {postStatus === 200 && postData && !postError && (
                    <p>{postData[0].content}</p>
                )}

                {authorStatus === 200 && authorData && !authorError && (
                    <p className="text-md my-5">By {authorData[0].username}</p>
                )}

                {likesCountStatus === 200 && (
                    <p className="text-md my-5 flex space-x-2">
                        <span>
                            <FaThumbsUp />
                        </span>
                        <span>{likesCount} likes</span>
                    </p>
                )}

                <div className="flex flex-col md:flex-row space-y-5 md:space justify-center mt-5 space-x-5">
                    {postData && postData[0].author_id === user.id && (
                        <Link
                            href={`${postData[0].id}/settings`}
                            className="btn btn-primary btn-md w-full md:max-w-60"
                        >
                            Edit Post
                        </Link>
                    )}

                    <LikeOrUnlikeButton
                        hasLiked={
                            !!checkLikeData &&
                            checkLikeStatus === 200 &&
                            checkLikeData.length === 1 &&
                            checkLikeData[0].user_id === user.id &&
                            checkLikeData[0].post_id === postData[0].id
                        }
                        postID={postData[0].id}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;
