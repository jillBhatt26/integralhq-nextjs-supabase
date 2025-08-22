'use client';
import { FormEvent, FormEventHandler, useState } from 'react';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import {
    AuthTokenResponsePassword,
    isAuthApiError
} from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { AuthServices } from '@/services/auth';
import useAuthStore from '@/store/auth';
import { loginUserSchema } from '@/lib/validations/auth';

const LoginPage = () => {
    // states
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputPassword, setInputPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string | null>(null);

    const setUser = useAuthStore(state => state.setUser);

    // event handlers
    const handleLogin: FormEventHandler = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setLoginError(null);

        let loginUserRes: AuthTokenResponsePassword | null = null;

        try {
            const validatedLoginBody = loginUserSchema.parse({
                email: inputEmail,
                password: inputPassword
            });

            const res = await AuthServices.login({
                email: validatedLoginBody.email,
                password: validatedLoginBody.password
            });

            if (typeof res === 'string') return setLoginError(res);

            if (typeof res === 'object') loginUserRes = res;
        } catch (error: unknown) {
            if (error instanceof ZodError)
                return setLoginError(
                    error.issues.map(issue => issue.message).join(', ')
                );

            return setLoginError('Failed to login user!');
        }

        if (loginUserRes) {
            const { data, error } = loginUserRes;

            if (!error && data && data.user) {
                setUser(data.user);

                return redirect('/', RedirectType.replace);
            }

            if (isAuthApiError(error)) {
                return setLoginError(
                    (error.code && error.code.replaceAll('_', ' ')) ??
                        error.message ??
                        'User login failed!'
                );
            }
        }
    };

    return (
        <div className="container mx-auto my-10 lg:my-14">
            <h1 className="text-2xl text-center text-gray-300 mb-10">Login</h1>

            <form
                onSubmit={handleLogin}
                autoComplete="off"
                noValidate
                className="space-y-5 my-5 px-5 md:px-0 lg:max-w-1/2 xl:max-w-2/6 mx-auto"
            >
                {loginError && (
                    <div
                        role="alert"
                        className="alert alert-error text-gray-900"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{loginError}</span>
                    </div>
                )}

                <label className="floating-label" htmlFor="inputEmail">
                    <input
                        id="inputEmail"
                        type="email"
                        placeholder="Email"
                        className="input input-md w-full"
                        value={inputEmail}
                        onChange={e => setInputEmail(e.target.value)}
                    />
                    <span>Email</span>
                </label>

                <label className="floating-label" htmlFor="password">
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="input input-md w-full"
                        value={inputPassword}
                        onChange={e => setInputPassword(e.target.value)}
                    />
                    <span>Password</span>
                </label>

                <button type="submit" className="btn-primary btn btn-block">
                    Login
                </button>
            </form>

            <p className="text-center">
                Don&apos;t have an account yet?{' '}
                <Link href="/signup" className="text-primary font-medium">
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;
