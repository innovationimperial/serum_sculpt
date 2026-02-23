import { ShieldCheck, Award, Microscope } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Credibility() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cred-item', {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-white border-y border-stone/20">
            <div className="max-w-7xl mx-auto px-8 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="cred-item flex items-start gap-6">
                        <div className="mt-1 bg-moss/10 p-3 rounded-lg text-moss">
                            <ShieldCheck size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl text-charcoal mb-2">Pharmacist-Led</h3>
                            <p className="text-charcoal/60 text-sm leading-relaxed">
                                Every program and recommendation is governed by clinical pharmaceutical expertise and medical integrity.
                            </p>
                        </div>
                    </div>

                    <div className="cred-item flex items-start gap-6">
                        <div className="mt-1 bg-moss/10 p-3 rounded-lg text-moss">
                            <Microscope size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl text-charcoal mb-2">Evidence-Based</h3>
                            <p className="text-charcoal/60 text-sm leading-relaxed">
                                We rely on peer-reviewed science and proven clinical protocols rather than fleeting beauty trends.
                            </p>
                        </div>
                    </div>

                    <div className="cred-item flex items-start gap-6">
                        <div className="mt-1 bg-moss/10 p-3 rounded-lg text-moss">
                            <Award size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl text-charcoal mb-2">Clinical Responsibility</h3>
                            <p className="text-charcoal/60 text-sm leading-relaxed">
                                Our commitment is to your long-term health, ensuring safe and effective pathways to wellness.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
