import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClipboardList, HeartPulse, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_STEPS = [
    {
        title: 'Assess Your Goals',
        description: 'We begin with a detailed consultation to understand your health profile, priorities, and aesthetic concerns.',
        icon: ClipboardList,
    },
    {
        title: 'Build Your Plan',
        description: 'Your treatment pathway is tailored to your body, lifestyle, and stage of life so every recommendation feels relevant.',
        icon: HeartPulse,
    },
    {
        title: 'Support Your Results',
        description: 'We combine expert guidance, non-invasive treatments, and wellness protocols to help you sculpt, restore, and maintain confidence.',
        icon: Sparkles,
    }
];

export default function ConsultationJourney() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.consult-reveal',
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.16,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                    clearProps: 'all'
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-stone py-28 px-8 md:px-16">
            <div className="max-w-7xl mx-auto rounded-[3rem] bg-white border border-sage/25 shadow-[0_30px_90px_rgba(37,54,45,0.08)] overflow-hidden">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
                    <div className="consult-reveal p-10 md:p-16 lg:p-20 bg-gradient-to-br from-white via-stone/60 to-[#edf2ea]">
                        <p className="font-mono text-xs tracking-[0.28em] uppercase text-clay mb-5 font-bold">
                            Consultation First
                        </p>
                        <h2 className="font-serif text-4xl md:text-6xl text-moss leading-tight mb-6">
                            Your Transformation Starts With a Consultation
                        </h2>
                        <p className="text-charcoal/75 text-lg leading-relaxed mb-6 font-light max-w-2xl">
                            Every journey at Serum & Sculpt begins with a personalized consultation where we assess your goals, health profile, and treatment options.
                        </p>
                        <p className="text-charcoal/75 text-lg leading-relaxed mb-10 font-light max-w-2xl">
                            Together we create a custom plan to help you sculpt your body, restore balance, and regain confidence.
                        </p>
                        <Link
                            to="/contact"
                            className="magnetic-button inline-block bg-moss text-white px-8 py-4 rounded-full text-sm font-sans tracking-[0.2em] uppercase font-bold hover:bg-charcoal transition-colors"
                        >
                            Book Your Consultation
                        </Link>
                    </div>

                    <div className="p-10 md:p-16 bg-moss text-white flex flex-col justify-center gap-6">
                        {JOURNEY_STEPS.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.title} className="consult-reveal rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#d9e2d5]">
                                            <Icon size={22} strokeWidth={1.8} />
                                        </div>
                                        <h3 className="font-serif text-2xl text-white">{step.title}</h3>
                                    </div>
                                    <p className="text-white/75 leading-relaxed font-light">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
