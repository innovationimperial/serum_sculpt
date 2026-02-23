import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="relative w-full bg-white min-h-screen font-sans text-charcoal selection:bg-moss selection:text-white">
            {/* Global Noise Overlay */}
            <div className="noise-bg" />

            <Navbar />

            <main>
                {children}
            </main>

            <Footer />
        </div>
    );
}
