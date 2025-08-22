'use client';
import Link from 'next/link';
import { TPost } from '@/lib/types/posts';
import { createClient } from '@/utils/supabase/client';
import {
    FormEvent,
    FormEventHandler,
    useCallback,
    useEffect,
    useState
} from 'react';
import useAuthStore from '@/store/auth';
import Loader from './Loader';
import { IoIosSearch } from 'react-icons/io';

const Posts = () => {
    // states
    const [posts, setPosts] = useState<TPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showMyPostsOnly, setShowMyPostsOnly] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // hooks
    const authUser = useAuthStore(state => state.user);

    // callbacks
    const fetchPostsCB = useCallback(async () => {
        if (!authUser) return;

        setLoading(true);

        const supabase = createClient();

        let res;

        if (showMyPostsOnly) {
            res = await supabase
                .from('posts')
                .select()
                .eq('author_id', authUser.id)
                .order('created_at', { ascending: false });
        } else {
            res = await supabase
                .from('posts')
                .select()
                .order('created_at', { ascending: false });
        }

        const { data, error, status } = res;

        if (status !== 200 && error)
            return setError(
                error.code.replaceAll('_', ' ') ?? 'Failed to fetch posts!'
            );

        if (status === 200 && data) setPosts(data);

        setLoading(false);
    }, [showMyPostsOnly, authUser]);

    // effects
    useEffect(() => {
        fetchPostsCB();
    }, [fetchPostsCB]);

    // event handlers
    const handleSearchPosts: FormEventHandler<HTMLFormElement> = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);

        const supabase = createClient();

        const { data, error, status } = await supabase
            .from('posts')
            .select()
            .ilike('content', `%${searchQuery}%`)
            .order('created_at', { ascending: false });

        if (status !== 200 && error)
            return setError(
                error.code.replaceAll('_', ' ') ?? 'Failed to fetch posts!'
            );

        if (status === 200 && data) setPosts(data);

        setLoading(false);
    };

    if (loading) return <Loader />;

    return (
        <div className="my-8 lg:my-14">
            {error && (
                <div role="alert" className="alert alert-error alert-soft">
                    <span>{error}</span>
                </div>
            )}

            <h1 className="text-2xl text-center text-gray-300">
                {showMyPostsOnly ? 'My' : 'All'} Posts
            </h1>

            <div className="my-5 px-5 flex flex-col md:flex-row space-y-5 md:space-y-0 justify-between space-x-5">
                {/* Filter */}
                <select
                    defaultValue={showMyPostsOnly ? 'my' : 'all'}
                    className="select w-full md:max-w-60"
                    onChange={e =>
                        setShowMyPostsOnly(
                            e.target.value.toLowerCase() === 'my'
                        )
                    }
                >
                    <option value="all">Show All Posts</option>
                    <option value="my">Show My Posts</option>
                </select>

                {/* Search Form */}
                <form
                    onSubmit={handleSearchPosts}
                    autoComplete="off"
                    noValidate
                    className="flex space-x-2 w-full lg:max-w-80"
                >
                    <label className="input w-full">
                        <svg
                            className="h-[1em] opacity-50"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            className="grow w-full"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </label>

                    <button className="btn btn-primary">
                        <IoIosSearch className="text-xl" />
                    </button>
                </form>
            </div>

            {posts.length > 0 ? (
                <>
                    <ul className="my-5">
                        {posts.map((post: TPost, idx: number) => (
                            <Link key={post.id ?? idx} href={`${post.id}`}>
                                <li className="px-5 py-2 border border-transparent hover:border hover:border-gray-500">
                                    <p className="text-lg text-gray-300">
                                        {post.content}
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        {new Date(
                                            post.created_at
                                        ).toLocaleString()}
                                    </p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </>
            ) : (
                <h3 className="text-center text-2xl mt-5">No posts found!</h3>
            )}
        </div>
    );
};

export default Posts;
