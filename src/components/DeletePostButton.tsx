'use client';

import { PostsServices } from '@/services/posts';
import { PostgrestError } from '@supabase/supabase-js';
import { redirect, RedirectType } from 'next/navigation';
import { FC, MouseEventHandler, useState } from 'react';

const DeletePostButton: FC<{ postID: string }> = ({ postID }) => {
    // states

    const [error, setError] = useState<PostgrestError | null>(null);

    // event handlers
    const handleDeletePost: MouseEventHandler<HTMLButtonElement> = async () => {
        const { status, error } = await PostsServices.deletePostByID(postID);

        if (status === 204 && !error) {
            return redirect('/', RedirectType.replace);
        }

        if (error && status !== 204) return setError(error);
    };

    return (
        <>
            {error && (
                <div role="alert" className="alert alert-error alert-soft">
                    <span>
                        {error.message ?? 'Error! Failed to fetch todos!'}
                    </span>
                </div>
            )}

            <button
                type="button"
                className="btn btn-error text-white w-full md:max-w-60 md:mt-5 lg:mt-0"
                onClick={handleDeletePost}
            >
                Delete Post
            </button>
        </>
    );
};

export default DeletePostButton;
