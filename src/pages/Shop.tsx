import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { StoreSection } from '../features/store/components/StoreSection';
import PageHeader from '../components/PageHeader';

export default function Shop() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.shop-reveal',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-stone">
            <PageHeader
                id="SKN-004"
                title="Clinical Skincare."
                subtitle="The Curated Selection"
                description="We prioritize clarity over trends. Every formula in this collection is science-backed and pharmacist-approved."
            />

            <div className="border-t border-stone/20 shop-reveal">
                <StoreSection />
            </div>

            <div className="py-24 px-8 md:px-16 max-w-7xl mx-auto border-t border-stone/20 shop-reveal">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-serif text-4xl text-moss mb-6 italic">Why our curation matters.</h2>
                        <p className="text-charcoal/70 leading-relaxed mb-8">
                            Every product we stock must meet rigorous clinical benchmarks for efficacy, safety, and evidence-based results. We don't follow beauty influencer trends; we follow physiological science.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Pharmacist-vetted ingredients",
                                "Evidence-based formulations",
                                "Clinical efficacy benchmarks",
                                "Sustainability & integrity"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-center font-mono text-[10px] tracking-widest uppercase text-moss font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-moss/5 rounded-[3rem] p-12 aspect-square flex flex-col justify-center border border-stone/30">
                        <h3 className="font-serif text-3xl text-moss mb-4 italic">Need Guidance?</h3>
                        <p className="text-charcoal/60 text-sm leading-relaxed mb-8">
                            Not sure which products are right for your specific biological profile? A clinical assessment provides the clarity you need.
                        </p>
                        <button className="bg-moss text-stone px-8 py-4 rounded-full uppercase tracking-widest text-[10px] font-bold shadow-lg hover:bg-charcoal transition-colors">
                            Book Product Consultation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
