import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
    const containerRef = useRef<HTMLElement>(null);
    const text1Ref = useRef<HTMLParagraphElement>(null);
    const text2Ref = useRef<HTMLParagraphElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax organic background
            gsap.to(bgRef.current, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Split text reveal simulation (using opacity stagger for lines/chars)
            gsap.fromTo(text1Ref.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 0.5,
                    y: 0,
                    duration: 1.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: text1Ref.current,
                        start: 'top 80%',
                    }
                }
            );

            gsap.fromTo(text2Ref.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    delay: 0.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: text1Ref.current,
                        start: 'top 80%',
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="philosophy"
            ref={containerRef}
            className="relative py-48 px-8 md:px-16 bg-moss text-white overflow-hidden flex flex-col items-center min-h-[80vh]"
        >
            {/* Background Parallax Texture */}
            <div
                ref={bgRef}
                className="absolute top-[-20%] left-0 w-full h-[140%] z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(58,79,65,0.7) 0%, transparent 80%), url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2670&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'overlay',
                }}
            />

            <div className="relative z-10 max-w-5xl w-full text-center flex flex-col gap-12 pt-16">
                <p className="text-sm font-mono tracking-widest text-[#d9e2d5] uppercase font-bold">Our Philosophy</p>

                <div className="font-serif italic text-4xl md:text-7xl leading-tight">
                    <p ref={text1Ref} className="text-white/70 mb-8 transition-opacity">
                        Clarity over trends.
                    </p>
                    <p ref={text2Ref} className="text-[#d9e2d5] text-4xl md:text-6xl pt-4">
                        Clinical expertise meets holistic wellness.
                    </p>
                </div>

                <div className="mt-16 text-center w-full flex justify-center">
                    <p className="max-w-xl font-sans text-white/90 leading-relaxed font-light tracking-wide text-sm md:text-base">
                        We believe in evidence-based wellness, where clinical responsibility meets holistic care. Our pharmacist-led platform empowers women with sustainable, science-backed solutions for lasting vitality.
                    </p>
                </div>
            </div>
        </section>
    );
}
