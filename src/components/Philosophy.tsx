import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PHILOSOPHY_POINTS = [
    'Stubborn weight gain',
    'Menopausal body changes',
    'Fatigue and metabolic slowdown',
    'Skin aging and loss of firmness',
    'Hormonal shifts affecting confidence and wellbeing'
];

export default function Philosophy() {
    const containerRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
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

            gsap.fromTo('.philosophy-reveal',
                { opacity: 0, y: 36 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                    },
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="philosophy"
            ref={containerRef}
            className="relative py-32 px-8 md:px-16 bg-moss text-white overflow-hidden"
        >
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

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-[1fr_0.9fr] gap-14 lg:gap-20 items-start">
                    <div>
                        <p className="philosophy-reveal text-sm font-mono tracking-[0.28em] text-[#d9e2d5] uppercase font-bold mb-5">
                            Our Philosophy
                        </p>
                        <h2 className="philosophy-reveal font-serif italic text-4xl md:text-6xl leading-tight mb-6">
                            Beauty is not just about appearance. It is about health, balance, and confidence.
                        </h2>
                        <p className="philosophy-reveal max-w-2xl font-sans text-white/85 leading-relaxed font-light text-lg mb-6">
                            Founded by a pharmacist with a deep understanding of metabolism, hormones, and wellness, our clinic takes a science-first approach to aesthetic and body treatments.
                        </p>
                        <p className="philosophy-reveal max-w-2xl font-sans text-white/70 leading-relaxed font-light text-lg">
                            Our treatments combine advanced non-invasive technologies, targeted wellness protocols, and expert guidance to deliver safe and sustainable results.
                        </p>
                    </div>

                    <div className="philosophy-reveal rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10">
                        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#d9e2d5] mb-6 font-bold">
                            We Specialize In Helping Women Experiencing
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {PHILOSOPHY_POINTS.map((point) => (
                                <div key={point} className="rounded-[1.5rem] border border-white/10 bg-black/10 px-5 py-5">
                                    <p className="text-white/90 leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
