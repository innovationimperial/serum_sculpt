import { HeartPulse, Microscope, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CREDIBILITY_ITEMS = [
    {
        title: 'Pharmacy-Led Expertise',
        description: 'Our treatments are guided by clinical knowledge of metabolism, hormones, and wellness.',
        icon: ShieldCheck,
    },
    {
        title: 'Science-Backed Treatments',
        description: 'We use proven technologies and protocols designed to deliver safe, measurable results.',
        icon: Microscope,
    },
    {
        title: 'Personalised Care',
        description: 'Every treatment plan is tailored to your unique body, goals, and stage of life.',
        icon: UserRoundCheck,
    },
    {
        title: 'Menopause-Focused Wellness',
        description: 'We provide specialized support for women navigating the physical changes of midlife.',
        icon: HeartPulse,
    }
];

export default function Credibility() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.cred-item',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.18,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    },
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-white border-y border-stone/20">
            <div className="max-w-7xl mx-auto px-8 md:px-16">
                <div className="max-w-3xl mb-14">
                    <p className="cred-item font-mono tracking-[0.28em] text-clay uppercase text-xs mb-4 font-bold">
                        Why Choose Serum & Sculpt
                    </p>
                    <h2 className="cred-item font-serif text-4xl md:text-6xl text-moss mb-5">
                        Care rooted in science, tailored to real life.
                    </h2>
                    <p className="cred-item text-charcoal/70 text-lg leading-relaxed font-light">
                        We combine clinical insight with aesthetic precision so your treatment plan supports how you want to feel, function, and look.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {CREDIBILITY_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className="cred-item rounded-[2rem] border border-sage/20 bg-stone/40 p-8">
                                <div className="mb-6 inline-flex rounded-2xl bg-moss/10 p-3 text-moss">
                                    <Icon size={28} strokeWidth={1.6} />
                                </div>
                                <h3 className="font-serif text-2xl text-charcoal mb-3">{item.title}</h3>
                                <p className="text-charcoal/65 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
