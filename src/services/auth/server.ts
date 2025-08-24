'use server';

import { API_URL } from '@/constants/env';
import { AuthTokenResponsePassword, UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

class AuthServerServices {
    static BASE_URL: string = `${API_URL}/auth`;

    static check = async (): Promise<UserResponse> => {
        try {
            const res = await fetch(this.BASE_URL, {
                headers: {
                    Cookie: (await cookies()).toString()
                }
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };
}

export { AuthServerServices };
