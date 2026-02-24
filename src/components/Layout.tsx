import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="relative w-full bg-white min-h-screen font-sans text-charcoal selection:bg-moss selection:text-white">
            {/* Global Noise Overlay */}
            <div className="noise-bg" />

            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
