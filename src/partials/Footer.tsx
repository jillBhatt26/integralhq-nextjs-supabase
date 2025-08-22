const Footer = () => {
    return (
        <div className="footer py-10">
            <div className="container mx-auto px-5 md:px-0">
                <p className="w-full text-center text-white">
                    &copy; {new Date().getFullYear()}. All Rights Reserved.
                    MicroFeed App built by{' '}
                    <a
                        href="https://www.linkedin.com/in/jill-bhatt"
                        target="_blank"
                        className="text-primary underline"
                    >
                        Jill Bhatt
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Footer;
