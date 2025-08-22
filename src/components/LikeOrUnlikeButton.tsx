'use client';

import { FC, useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa6';
import { FaThumbsDown } from 'react-icons/fa';
import { PostsServices } from '@/services/posts';
import { redirect, RedirectType } from 'next/navigation';
import Loader from './Loader';

const LikeOrUnlikeButton: FC<{ hasLiked: boolean; postID: string }> = ({
    hasLiked,
    postID
}) => {
    // states
    const [newLikeStatus, setNewLikeStatus] = useState<boolean>(hasLiked);
    const [loading, setLoading] = useState<boolean>(false);

    // effects
    useEffect(() => {
        setNewLikeStatus(hasLiked);
    }, [hasLiked]);

    // event handlers
    const handlePostLikeOrUnlike = async () => {
        setLoading(true);

        if (newLikeStatus) {
            // unlike
            const res = await PostsServices.UnlikePost(postID);

            if (res.status === 204) {
                setNewLikeStatus(false);
                setLoading(false);
                return redirect(`/${postID}`, RedirectType.push);
            }
        } else {
            // like

            const res = await PostsServices.LikePost(postID);

            if (res.data && res.data.length === 1) {
                setNewLikeStatus(true);
                setLoading(false);
                return redirect(`/${postID}`, RedirectType.push);
            }
        }
    };

    return (
        <button
            type="button"
            className={`btn ${
                newLikeStatus ? 'btn-error' : 'btn-info'
            } text-white w-full md:max-w-60 space-x-2`}
            onClick={handlePostLikeOrUnlike}
            disabled={loading}
        >
            {loading ? (
                <Loader />
            ) : (
                <>
                    {newLikeStatus ? (
                        <FaThumbsDown className="text-2xl" />
                    ) : (
                        <FaThumbsUp className="text-2xl" />
                    )}
                    <span>{newLikeStatus ? 'Unlike' : 'Like'}</span>
                </>
            )}
        </button>
    );
};

export default LikeOrUnlikeButton;
