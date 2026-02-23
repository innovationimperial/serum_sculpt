import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import PageHeader from '../components/PageHeader';

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.reveal',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            <PageHeader
                id="DOC-001"
                title="Clinical Responsibility."
                subtitle="The Philosophy"
                description="Establishing clinical wellness authority through transparency, education, and pharmacist-led curation."
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="reveal">
                        <div className="prose prose-lg text-charcoal/80 font-light leading-relaxed">
                            <p className="mb-6">
                                Welcome to Serum & Sculpt. I am a clinical pharmacist with a mission to empower women to rediscover their wellness, confidence, and vitality through evidence-based guidance and holistic beauty.
                            </p>
                            <p className="mb-6">
                                My approach is built on the belief that products support the brand—they are not the brand. The primary authority here is clinical expertise and consultation, not retail.
                            </p>

                            <h2 className="font-serif text-3xl text-moss mt-12 mb-4 italic">Clarity over Trends</h2>
                            <p className="mb-6">
                                In a world of fleeting beauty trends, we prioritize long-term skin health and metabolic wellness. Every recommendation is science-backed and tailored to the unique biological needs of mature women.
                            </p>
                        </div>
                    </div>

                    <div className="reveal relative">
                        <div className="aspect-[3/4] bg-stone/30 rounded-[3rem] overflow-hidden relative shadow-2xl">
                            <div className="absolute inset-0 bg-moss/5" />
                            {/* Placeholder for Founder Imagery */}
                            <div className="w-full h-full flex items-center justify-center text-moss/20 font-serif italic text-2xl">
                                Founder Imagery
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl max-w-xs border border-stone/20">
                            <p className="font-serif italic text-moss text-lg mb-2">"True wellness is the intersection of clinical science and intentional self-care."</p>
                            <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40 font-bold">— Clinical Pharmacist & Founder</p>
                        </div>
                    </div>
                </div >

                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-stone/20 pt-24 reveal">
                    <div>
                        <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-clay mb-6 font-bold">The Mission</h4>
                        <p className="text-charcoal/70 text-sm leading-relaxed">Providing high-end clinical wellness solutions that blend pharmaceutical precision with holistic care.</p>
                    </div>
                    <div>
                        <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-clay mb-6 font-bold">The Values</h4>
                        <p className="text-charcoal/70 text-sm leading-relaxed">Clinical Integrity, Sustainable Wellness, Authenticity, and Simplified Science.</p>
                    </div>
                    <div>
                        <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-clay mb-6 font-bold">The Vision</h4>
                        <p className="text-charcoal/70 text-sm leading-relaxed">To be the primary wellness ecosystem for women seeking evidence-based vitality and medical-adjacent guidance.</p>
                    </div>
                </div>
            </div >
        </div >
    );
}
