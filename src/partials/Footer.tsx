const Footer = () => {
    return (
        <div className="footer py-10">
            <div className="container mx-auto px-5 md:px-0">
                <div className="w-full text-center text-white flex flex-col">
                    <p>
                        &copy; {new Date().getFullYear()}. MicroFeed App built
                        by{' '}
                        <a
                            href="https://www.linkedin.com/in/jill-bhatt"
                            target="_blank"
                            className="text-primary underline"
                        >
                            Jill Bhatt
                        </a>
                        .{' '}
                    </p>
                    <a
                        href="https://github.com/jillBhatt26/integralhq-nextjs-supabase"
                        target="_blank"
                        className="text-info mt-2 max-w-fit mx-auto"
                    >
                        GitHub Repo.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
