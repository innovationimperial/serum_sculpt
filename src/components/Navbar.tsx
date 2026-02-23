import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!navRef.current) return;

            gsap.to(navRef.current, {
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
                borderColor: isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                color: isScrolled ? '#2e4036' : '#ffffff',
                duration: 0.4,
                ease: 'power2.out',
            });

            // Update links text color smoothly
            gsap.to('.nav-link', {
                color: isScrolled ? '#1a1a1a' : '#ffffff',
                duration: 0.4,
                ease: 'power2.out',
            });
        }, navRef);

        return () => ctx.revert();
    }, [isScrolled]);

    return (
        <header className="fixed top-0 left-0 w-full flex justify-center z-50 pt-6 px-4 pointer-events-none">
            <nav
                ref={navRef}
                className="pointer-events-auto flex items-center justify-between w-full max-w-7xl px-8 py-4 rounded-[ambient] border border-transparent transition-all"
                style={{ borderRadius: 'var(--radius-std)', color: '#ffffff' }}
            >
                <div className="font-serif text-2xl tracking-wide uppercase italic">
                    Serum & Sculpt
                </div>

                <div className="hidden md:flex gap-8 font-sans text-sm tracking-wide">
                    <a href="#services" className="nav-link hover:opacity-70 transition-opacity">Consultation Services</a>
                    <a href="#programs" className="nav-link hover:opacity-70 transition-opacity">Wellness Programs</a>
                    <a href="#skincare" className="nav-link hover:opacity-70 transition-opacity">Curated Clinical Skincare</a>
                    <a href="#philosophy" className="nav-link hover:opacity-70 transition-opacity">Philosophy</a>
                </div>

                <button className="magnetic-button whitespace-nowrap bg-moss text-white px-6 py-3 rounded-full text-sm font-sans tracking-wide hover:bg-charcoal transition-colors">
                    Book Consultation
                </button>
            </nav>
        </header>
    );
}
