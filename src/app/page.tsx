import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect, RedirectType } from 'next/navigation';

const HomePage = async () => {
    const supabase = await createClient();

    const {
        data: { user },
        error: authUserError
    } = await supabase.auth.getUser();

    // NOTE: This step is just to remove TypeScript null check. User auth check is already handled in middleware.
    if (!user || authUserError) return redirect('/login', RedirectType.replace);

    return (
        <div className="container mx-auto">
            <Link
                href="/create"
                className="w-full btn btn-primary max-w-40 flex justify-center mx-auto my-10 rounded-sm"
            >
                Create new post
            </Link>
        </div>
    );
};

export default HomePage;
