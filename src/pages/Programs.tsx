import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const PROGRAMS_DATA = [
    {
        id: 'weight-wellness',
        title: 'Weight Wellness Method',
        tagline: 'Sustainable metabolic restoration.',
        problem: 'Traditional weight loss often ignores the complex hormonal landscape of mature women.',
        method: 'A pharmacist-governed approach combining metabolic support, nutritional science, and hormonal balancing.',
        outcomes: ['Sustained metabolic efficiency', 'Improved insulin sensitivity', 'Natural energy restoration'],
    },
    {
        id: 'metabolic-reset',
        title: 'Metabolic Reset',
        tagline: 'Cellular vitality and systemic balance.',
        problem: 'Chronic fatigue and systemic inflammation often stem from metabolic drift.',
        method: 'A science-backed intervention designed to recalibrate cellular energy systems and reduce systemic inflammation.',
        outcomes: ['Reducued systemic inflammation', 'Enhanced cognitive clarity', 'Optimized endocrine function'],
    }
];

const FAQS = [
    { q: "Are these programs medically supervised?", a: "Yes, all programs are governed by clinical pharmaceutical expertise." },
    { q: "How long are the programs?", a: "Most programs run for 8-12 weeks for sustainable biological adaptation." },
    { q: "Is a consultation required?", a: "Yes, a clinical assessment is necessary to ensure the program is safe and appropriate for you." }
];

export default function Programs() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.prog-reveal',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            <PageHeader
                id="PRG-003"
                title="Wellness Architectures."
                subtitle="Flagship Journeys"
                description="Structured, evidence-based journeys designed for deep physiological realignment and long-term vitality."
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                {PROGRAMS_DATA.map((prog, idx) => (
                    <div key={prog.id} className={`prog-reveal grid md:grid-cols-2 gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className={idx % 2 !== 0 ? 'md:order-2' : ''}>
                            <div className="aspect-[16/10] bg-stone/20 rounded-[3rem] overflow-hidden">
                                <div className="w-full h-full bg-moss/5 border border-stone/30 flex items-center justify-center text-moss/20 italic font-serif text-2xl">
                                    Program Visual
                                </div>
                            </div>
                        </div>

                        <div className={idx % 2 !== 0 ? 'md:order-1' : ''}>
                            <h2 className="font-serif text-4xl md:text-5xl text-moss mb-2 italic">{prog.title}</h2>
                            <p className="font-mono text-[10px] tracking-widest uppercase text-clay mb-8 font-bold">{prog.tagline}</p>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-moss mb-2 uppercase tracking-tighter text-[11px]">The Problem</h4>
                                    <p className="text-charcoal/70 leading-relaxed text-sm">{prog.problem}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-moss mb-2 uppercase tracking-tighter text-[11px]">The Method</h4>
                                    <p className="text-charcoal/70 leading-relaxed text-sm">{prog.method}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-moss mb-4 uppercase tracking-tighter text-[11px]">Biological Outcomes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {prog.outcomes.map((out, i) => (
                                            <span key={i} className="px-4 py-2 bg-moss/5 rounded-full text-[11px] text-moss/80 font-bold uppercase tracking-wider">{out}</span>
                                        ))}
                                    </div>
                                </div>
                                <button className="flex items-center gap-4 text-moss hover:text-clay transition-colors group pt-6">
                                    <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Apply for Program</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-48 pt-32 border-t border-stone/20 prog-reveal">
                <h2 className="font-serif text-4xl text-moss mb-12 italic text-center">Frequently Asked Inquiries</h2>
                <div className="max-w-2xl mx-auto space-y-4">
                    {FAQS.map((faq, i) => (
                        <details key={i} className="group bg-stone/5 rounded-2xl border border-stone/10 overflow-hidden cursor-pointer">
                            <summary className="flex items-center justify-between p-6 text-charcoal font-serif text-lg italic hover:text-moss transition-colors">
                                {faq.q}
                                <ChevronDown size={20} className="group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-6 pb-6 text-charcoal/60 text-sm leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>

            <div className="mt-32 bg-moss rounded-[3rem] p-8 md:p-16 text-center text-white prog-reveal shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-stone/5 mix-blend-overlay opacity-20" />
                <h2 className="font-serif text-4xl md:text-5xl mb-6 relative z-10 italic">Begin Your Alignment.</h2>
                <p className="text-stone/60 max-w-xl mx-auto mb-12 relative z-10 font-light">
                    Programs are subject to clinical availability. Book your initial assessment to determine eligibility and start your journey.
                </p>
                <button className="relative z-10 bg-white text-moss px-10 py-5 rounded-full uppercase tracking-[0.2em] font-bold text-xs shadow-xl hover:bg-stone transition-colors">
                    Secure Assessment Slot
                </button>
            </div>
        </div>
    );
}
