import { API_URL } from '@/constants/env';
import {
    AuthError,
    AuthResponse,
    AuthTokenResponsePassword,
    User
} from '@supabase/supabase-js';

class AuthServices {
    static BASE_URL: string = `${API_URL}/auth`;

    static check = async (): Promise<User | null> => {
        try {
            const res = await fetch(this.BASE_URL);

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };

    static login = async (body: {
        email: string;
        password: string;
    }): Promise<AuthTokenResponsePassword | string> => {
        try {
            const res = await fetch(`${this.BASE_URL}/login`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };

    static logout = async (): Promise<{
        error: AuthError | null;
    }> => {
        try {
            const res = await fetch(`${this.BASE_URL}/logout`, {
                method: 'POST'
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };

    static signup = async (body: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }): Promise<AuthResponse | string> => {
        try {
            const res = await fetch(`${this.BASE_URL}/signup`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await res.json();
        } catch (error: unknown) {
            throw error;
        }
    };
}

export { AuthServices };
