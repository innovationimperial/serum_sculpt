import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.hero-text',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out',
                    delay: 0.2,
                    clearProps: 'all'
                }
            );

            gsap.fromTo('.hero-cta',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 1.1,
                    clearProps: 'all'
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-start md:justify-center pt-28 pb-14 px-6 md:px-16 md:pb-24"
        >
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/Brightened Brand Interior.png')" }}
            />
            <div className="absolute inset-0 z-0 bg-stone/25 md:bg-stone/20" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone/80 via-stone/55 to-stone/70 md:hidden" />
            <div className="absolute inset-0 z-0 bg-gradient-to-r hidden md:block from-stone/95 via-stone/70 to-transparent" />

            <div className="max-w-4xl text-charcoal relative z-10 mt-2 md:mt-20 bg-white/58 backdrop-blur-[2px] rounded-[2rem] px-5 py-6 md:bg-transparent md:backdrop-blur-0 md:rounded-none md:px-0 md:py-0">
                <p className="hero-text mb-6 font-mono text-xs md:text-sm tracking-[0.28em] uppercase text-moss/70 font-bold">
                    Science-Led Wellness
                </p>

                <h1 className="flex flex-col gap-2 mb-8">
                    <span className="hero-text font-serif text-5xl md:text-7xl text-moss leading-tight">
                        Science-Led Wellness.
                    </span>
                    <span className="hero-text font-serif italic text-5xl md:text-7xl text-moss/80 leading-tight">
                        Beautifully Balanced.
                    </span>
                </h1>

                <p className="hero-text font-sans text-lg md:text-xl font-light tracking-wide max-w-3xl mb-6 text-charcoal/90 leading-relaxed">
                    At Serum & Sculpt, we combine pharmacy expertise, advanced aesthetic treatments, and evidence-based wellness protocols to help you look and feel your best at every stage of life.
                </p>

                <p className="hero-text font-sans text-base md:text-lg font-light tracking-wide max-w-3xl mb-8 md:mb-12 text-charcoal/85 leading-relaxed">
                    With a special focus on menopause, weight management, skin health, and metabolic wellness, our treatments are designed to support the body from the inside out.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    <Link to="/contact">
                        <button className="hero-cta magnetic-button bg-moss text-white px-8 py-4 rounded-full text-sm font-sans tracking-widest font-bold uppercase transition-all hover:bg-moss/90 shadow-lg w-full sm:w-auto">
                            Book Consultation
                        </button>
                    </Link>
                    <Link to="/services">
                        <button className="hero-cta magnetic-button border border-moss/50 bg-white/85 text-moss px-8 py-4 rounded-full text-sm font-sans tracking-widest font-bold uppercase transition-all hover:bg-moss/5 hover:border-moss/50 w-full sm:w-auto">
                            Explore Treatments
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
