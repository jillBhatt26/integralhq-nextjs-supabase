import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Navbar from '@/partials/Navbar';
import './globals.css';

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
            <body
                className={`${poppins.className} min-w-full min-h-screen overflow-y-auto`}
            >
                <Navbar />

                {children}
            </body>
        </html>
    );
}
