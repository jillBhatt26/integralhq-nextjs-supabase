import { API_URL } from '@/constants/env';
import { TPost } from '@/lib/types/posts';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

class PostsServices {
    static BASE_URL = `${API_URL}/posts`;

    static createPost = async (body: {
        content: string;
    }): Promise<PostgrestSingleResponse<TPost[]> | string> => {
        try {
            const res = await fetch(this.BASE_URL, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };

    static updatePostByID = async (
        id: string,
        body: { content: string }
    ): Promise<PostgrestSingleResponse<TPost[]> | string> => {
        try {
            const res = await fetch(`${this.BASE_URL}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };

    static deletePostByID = async (
        id: string
    ): Promise<PostgrestSingleResponse<null>> => {
        try {
            const res = await fetch(`${this.BASE_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };
}

export { PostsServices };
