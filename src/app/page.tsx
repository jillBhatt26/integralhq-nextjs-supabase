import Link from 'next/link';
import Posts from '@/components/Posts';

const HomePage = async () => {
    return (
        <div className="container mx-auto">
            <Link
                href="/create"
                className="w-full btn btn-primary max-w-40 flex justify-center mx-auto my-10 rounded-sm"
            >
                Create new post
            </Link>

            <Posts />
        </div>
    );
};

export default HomePage;
