'use client';
import { FormEvent, FormEventHandler, useState } from 'react';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AuthResponse, isAuthApiError } from '@supabase/supabase-js';
import { AuthServices } from '@/services/auth';
import useAuthStore from '@/store/auth';
import { ZodError } from 'zod';
import { signupUserSchema } from '@/lib/validations/auth';
import Loader from '../loading';

const SignupPage = () => {
    // states
    const [inputUsername, setInputUsername] = useState<string>('');
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputPassword, setInputPassword] = useState<string>('');
    const [inputConfirmPassword, setInputConfirmPassword] =
        useState<string>('');
    const [signupError, setSignupError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // hooks
    const setUser = useAuthStore(state => state.setUser);

    // event handlers
    const handleSignup: FormEventHandler = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setSignupError(null);
        setLoading(true);

        let signupUserRes: AuthResponse | null = null;

        try {
            const validatedSignupInputs = signupUserSchema.parse({
                username: inputUsername,
                email: inputEmail,
                password: inputPassword,
                confirmPassword: inputConfirmPassword
            });

            const res = await AuthServices.signup(validatedSignupInputs);

            if (typeof res === 'string') return setSignupError(res);

            if (typeof res === 'object') signupUserRes = res;
        } catch (error: unknown) {
            if (error instanceof ZodError)
                return setSignupError(
                    error.issues.map(issue => issue.message).join(', ')
                );

            return setSignupError('Failed to signup user!');
        } finally {
            setLoading(false);
        }

        if (signupUserRes) {
            const { data, error } = signupUserRes;

            if (!error && data && data.user) {
                setUser(data.user);
                return redirect('/', RedirectType.replace);
            }

            if (isAuthApiError(error))
                return setSignupError(
                    (error.code && error.code.replaceAll('_', ' ')) ??
                        error.message ??
                        'User signup failed!'
                );
        }
    };

    return (
        <div className="container mx-auto my-10 lg:my-14">
            <h1 className="text-2xl text-center text-gray-300 mb-10">
                Sign Up
            </h1>

            <form
                onSubmit={handleSignup}
                autoComplete="off"
                noValidate
                className="space-y-5 my-5 px-5 md:px-0 lg:max-w-1/2 xl:max-w-2/6 mx-auto"
            >
                {signupError && (
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
                        <span>{signupError}</span>
                    </div>
                )}

                <label className="floating-label" htmlFor="inputUsername">
                    <input
                        id="inputUsername"
                        type="text"
                        placeholder="Username"
                        className="input input-md w-full"
                        value={inputUsername}
                        onChange={e => setInputUsername(e.target.value)}
                    />
                    <span>Username</span>
                </label>

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

                <label className="floating-label" htmlFor="confirmPassword">
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className="input input-md w-full"
                        value={inputConfirmPassword}
                        onChange={e => setInputConfirmPassword(e.target.value)}
                    />
                    <span>Confirm Password</span>
                </label>

                <button
                    type="submit"
                    className="btn-primary btn btn-block"
                    disabled={loading}
                >
                    {loading ? <Loader /> : <span>Sign Up</span>}
                </button>
            </form>

            <p className="text-center">
                Already a user?{' '}
                <Link href="/login" className="text-primary font-medium">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default SignupPage;
