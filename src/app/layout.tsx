import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Navbar from '@/partials/Navbar';
import './globals.css';
import Footer from '@/partials/Footer';

const poppins = Poppins({
    weight: ['400', '700'],
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'IntegralHQ Micro feed app',
    description: 'Application developed by Jill Bhatt'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.className} min-h-lvh`}>
                <Navbar />

                {children}

                <Footer />
            </body>
        </html>
    );
}
