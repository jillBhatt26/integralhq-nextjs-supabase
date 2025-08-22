import Link from 'next/link';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="container mx-auto flex justify-between">
                <Link href={'/'} className="btn btn-ghost text-xl">
                    MicroFeed
                </Link>

                <button
                    type="button"
                    className="btn btn-primary text-md rounded-sm"
                    // onClick={handleUserLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
