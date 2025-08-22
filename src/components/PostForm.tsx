'use client';

import { FC, FormEvent, FormEventHandler, useEffect, useState } from 'react';
import { redirect, RedirectType } from 'next/navigation';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { TPost } from '@/lib/types/posts';
import { postContentSchema } from '@/lib/validations/posts';
import { PostsServices } from '@/services/posts';
import useAuthStore from '@/store/auth';
import { autogenerate } from '@/utils/functions/autogenerate';
import DeletePostButton from './DeletePostButton';

const PostForm: FC<{ purpose: 'create' | 'update'; toUpdatePost?: TPost }> = ({
    purpose,
    toUpdatePost
}) => {
    // states
    const [inputContent, setInputContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const authUser = useAuthStore(state => state.user);

    // effects
    useEffect(() => {
        if (!toUpdatePost || purpose !== 'update') return;

        setInputContent(toUpdatePost.content);
    }, [purpose, toUpdatePost]);

    // event handlers
    const handleFormSubmit: FormEventHandler = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError(null);

        if (!authUser) return;

        let createRes: PostgrestSingleResponse<TPost[]> | null = null;

        if (purpose === 'create') {
            try {
                const validatedPostInputs = postContentSchema.parse({
                    content: inputContent
                });

                const res = await PostsServices.createPost({
                    content: validatedPostInputs.content
                });

                if (typeof res === 'string') setError(res);

                if (typeof res === 'object') createRes = res;
            } catch (error: unknown) {
                if (error instanceof ZodError)
                    return setError(
                        error.issues.map(issue => issue.message).join(', ')
                    );

                return setError('Failed to create new post!');
            }

            if (createRes) {
                const { data, error, status } = createRes;

                if (status === 201 && !error && data.length === 1) {
                    return redirect('/', RedirectType.push);
                }

                if (error instanceof PostgrestError)
                    return setError(error.code.replaceAll('_', ' '));
            }
        }

        if (purpose === 'update' && toUpdatePost) {
            let updateRes: PostgrestSingleResponse<TPost[]> | null = null;

            try {
                const validatedPostInputs = postContentSchema.parse({
                    content: inputContent
                });

                const res = await PostsServices.updatePostByID(
                    toUpdatePost.id,
                    {
                        content: validatedPostInputs.content
                    }
                );

                if (typeof res === 'string') setError(res);

                if (typeof res === 'object') updateRes = res;
            } catch (error: unknown) {
                if (error instanceof ZodError)
                    return setError(
                        error.issues.map(issue => issue.message).join(', ')
                    );

                return setError('Failed to update post!');
            }

            if (updateRes) {
                const { data, error, status } = updateRes;

                if (status === 200 && !error && data.length === 1) {
                    return redirect('/', RedirectType.push);
                }

                if (error instanceof PostgrestError)
                    return setError(error.code.replaceAll('_', ' '));
            }
        }
    };

    return (
        <div>
            <form
                className="w-full lg:w-3/4 lg:mx-auto px-5 md:px-0"
                onSubmit={handleFormSubmit}
                autoComplete="off"
                noValidate
            >
                {error && (
                    <div role="alert" className="alert alert-error alert-soft">
                        <span>
                            {error ?? 'Error! Failed to create new post!'}
                        </span>
                    </div>
                )}

                <label className="floating-label my-5">
                    <span>Post content</span>
                    <textarea
                        className="textarea w-full"
                        placeholder="Post content"
                        rows={3}
                        value={inputContent}
                        onChange={e => setInputContent(e.target.value)}
                    ></textarea>
                </label>

                <div className="space-y-5 md:space-y-0 md:space-x-5">
                    <button
                        type="button"
                        className="btn text-white btn-md w-full md:max-w-60"
                        onClick={() => setInputContent(autogenerate())}
                    >
                        Autogenerate
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary btn-md w-full md:max-w-60"
                    >
                        {purpose.toUpperCase()}
                    </button>

                    {toUpdatePost && (
                        <DeletePostButton postID={toUpdatePost.id} />
                    )}
                </div>
            </form>
        </div>
    );
};

export default PostForm;
