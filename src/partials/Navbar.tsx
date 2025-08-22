'use client';

import { useCallback, useEffect, MouseEventHandler } from 'react';
import Link from 'next/link';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/store/auth';

const Navbar = () => {
    // hooks
    const user = useAuthStore(state => state.user);
    const setUser = useAuthStore(state => state.setUser);

    // callbacks
    const fetchUserCB = useCallback(async () => {
        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        setUser(user);
        // eslint-disable-next-line
    }, []);

    // effects
    useEffect(() => {
        fetchUserCB();
    }, [fetchUserCB]);

    // event handlers
    const handleUserLogout: MouseEventHandler<HTMLButtonElement> = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signOut();

        if (error) return notFound();

        setUser(null);

        return redirect('/login', RedirectType.replace);
    };

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="container mx-auto flex justify-between">
                <Link
                    href={user ? '/' : '/login'}
                    className="btn btn-ghost text-xl"
                >
                    MicroFeed
                </Link>

                {user && (
                    <button
                        type="button"
                        className="btn btn-primary text-md rounded-sm"
                        onClick={handleUserLogout}
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
