import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered fade-up for hero text
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

            // Animate the CTA button
            gsap.fromTo('.hero-cta',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 1.2,
                    clearProps: 'all'
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-center pb-24 px-8 md:px-16"
        >
            {/* Background Image & Overlay  */}
            {/* z-0 ensures it stays safely behind z-10 content without slipping behind the App wrapper */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/Brightened Brand Interior.png')" }}
            />
            {/* Legibility overlays */}
            <div className="absolute inset-0 z-0 bg-stone/80" />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-stone flex to-transparent opacity-90" />

            {/* Content - Left Aligned */}
            <div className="max-w-4xl text-charcoal relative z-10 mt-20">
                <span className="hero-text inline-block font-mono tracking-widest text-[#c58361] uppercase mb-4 text-sm font-bold">
                    Pharmacist-Led Wellness Ecosystem
                </span>
                <h1 className="flex flex-col gap-2 mb-6">
                    <span className="hero-text font-serif text-5xl md:text-7xl text-moss leading-tight">
                        Clinical Authority.
                    </span>
                    <span className="hero-text font-serif italic text-5xl md:text-7xl text-moss/80 leading-tight">
                        Science-Based Wellness.
                    </span>
                </h1>

                <p className="hero-text font-sans text-lg md:text-xl font-light tracking-wide max-w-2xl mb-12 text-charcoal/80 leading-relaxed">
                    Empowering women to rediscover confidence and vitality through clinical consultation, evidence-based skincare, and holistic weight management programs.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <button className="hero-cta magnetic-button bg-moss text-white px-8 py-4 rounded-full text-sm font-sans tracking-widest font-bold uppercase transition-all hover:bg-moss/90 shadow-lg">
                        Book Consultation
                    </button>
                    <button className="hero-cta magnetic-button border border-moss/30 bg-transparent text-moss px-8 py-4 rounded-full text-sm font-sans tracking-widest font-bold uppercase transition-all hover:bg-moss/5 hover:border-moss/50">
                        Explore Featured Stores
                    </button>
                </div>
            </div>
        </section>
    );
}
