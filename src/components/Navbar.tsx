import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../features/store/context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { cartCount, openCart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!navRef.current) return;

            // In multi-page setup, we might want the navbar to be always opaque on certain pages 
            // or handle transparent-to-opaque transition specifically on Home.
            const shouldBeOpaque = isScrolled || location.pathname !== '/' || isMobileMenuOpen;

            gsap.to(navRef.current, {
                backgroundColor: shouldBeOpaque ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: shouldBeOpaque ? 'blur(12px)' : 'blur(0px)',
                borderColor: shouldBeOpaque ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                color: shouldBeOpaque ? '#2e4036' : '#ffffff', // moss
                duration: 0.4,
                ease: 'power2.out',
            });

            // Update links text color smoothly
            gsap.to('.nav-link', {
                color: shouldBeOpaque ? '#1a1a1a' : '#ffffff',
                duration: 0.4,
                ease: 'power2.out',
            });
        }, navRef);

        return () => ctx.revert();
    }, [isScrolled, location.pathname, isMobileMenuOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full flex justify-center z-[60] pt-6 px-4 pointer-events-none">
                <nav
                    ref={navRef}
                    className="pointer-events-auto flex items-center justify-between w-full max-w-7xl px-6 md:px-8 py-4 rounded-[ambient] transition-all border border-transparent"
                    style={{ borderRadius: 'var(--radius-std)' }}
                >
                    <Link to="/" className="font-serif text-xl md:text-2xl tracking-wide uppercase italic hover:opacity-80 transition-opacity whitespace-nowrap z-50">
                        Serum & Sculpt
                    </Link>

                    <div className="hidden lg:flex gap-6 font-sans text-[11px] tracking-[0.2em] uppercase font-bold">
                        <Link to="/about" className="nav-link hover:opacity-60 transition-opacity">About</Link>
                        <Link to="/services" className="nav-link hover:opacity-60 transition-opacity">Services</Link>
                        <Link to="/programs" className="nav-link hover:opacity-60 transition-opacity">Programs</Link>
                        <Link to="/shop" className="nav-link hover:opacity-60 transition-opacity">Curated Skincare</Link>
                        <Link to="/education" className="nav-link hover:opacity-60 transition-opacity">Education</Link>
                        <Link to="/contact" className="nav-link hover:opacity-60 transition-opacity">Contact</Link>
                    </div>

                    <div className="flex items-center gap-4 z-50">
                        <button onClick={openCart} className="relative p-2 text-current cursor-pointer hover:opacity-70 transition-opacity">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-moss text-stone text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <Link to="/contact" className="hidden lg:grid magnetic-button whitespace-nowrap bg-moss text-white px-6 py-3 rounded-full text-[10px] font-sans tracking-[0.2em] font-bold uppercase hover:bg-charcoal transition-colors">
                            Book Consultation
                        </Link>

                        <button
                            className="lg:hidden p-2 text-current cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-stone/95 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="flex flex-col items-center gap-8 font-serif text-3xl italic text-moss">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">Home</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">About</Link>
                    <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">Services</Link>
                    <Link to="/programs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">Programs</Link>
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">Curated Skincare</Link>
                    <Link to="/education" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">Education</Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-charcoal transition-colors">Contact</Link>
                </div>

                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-12 bg-charcoal text-white px-8 py-4 rounded-full text-[10px] font-sans tracking-[0.2em] font-bold uppercase hover:bg-moss transition-colors">
                    Book Consultation
                </Link>
            </div>
        </>
    );
}
