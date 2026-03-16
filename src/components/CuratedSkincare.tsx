import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const SIGNATURE_PROGRAMS = [
    {
        id: 1,
        name: 'The Awakening',
        category: 'FOUNDATIONAL RESET',
        desc: 'A restorative starting point focused on biological support, gentle rebalancing, and the foundations of renewed wellness.',
        bg: 'bg-stone',
        text: 'text-moss',
        link: '/programs',
        label: 'Explore Program',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1500&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'The Vitality Retreat',
        category: 'SIGNATURE WELLNESS PROGRAM',
        desc: 'An advanced journey designed around deeper energy restoration, systems support, and a more comprehensive path to feeling like yourself again.',
        bg: 'bg-[#d9e2d5]',
        text: 'text-charcoal',
        link: '/contact',
        label: 'Book Consultation',
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1500&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'The Equilibrium',
        category: 'HORMONAL & METABOLIC BALANCE',
        desc: 'A targeted program supporting endocrine balance, stress recovery, and the long-term stability needed for sustainable wellbeing.',
        bg: 'bg-white',
        text: 'text-charcoal',
        link: '/programs',
        label: 'Explore Program',
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1500&auto=format&fit=crop'
    }
];

export default function CuratedSkincare() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.program-showcase-card');

            cards.forEach((card, index) => {
                if (index === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                    endTrigger: cards[cards.length - 1],
                    end: 'top top',
                    animation: gsap.to(card, {
                        scale: 0.95,
                        opacity: 0,
                        filter: 'blur(8px)',
                        ease: 'none',
                    }),
                    scrub: true,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="programs-showcase" ref={sectionRef} className="relative w-full bg-stone">
            {SIGNATURE_PROGRAMS.map((program, index) => (
                <div
                    key={program.id}
                    className={`program-showcase-card relative w-full min-h-[100dvh] md:h-[100dvh] flex flex-col items-center justify-center pt-24 pb-12 px-8 md:p-8 ${program.bg} ${program.text} md:overflow-hidden`}
                    style={{ zIndex: index }}
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-8 md:gap-16">
                        <div className="flex-1 flex justify-center items-center">
                            <div className="relative w-56 h-72 md:w-96 md:h-[30rem] rounded-2xl overflow-hidden shadow-2xl border border-black/5 transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                                <img src={program.image} alt={program.name} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-60 mb-6 block">
                                {program.category}
                            </span>
                            <p className="font-mono text-[10px] uppercase tracking-[0.32em] opacity-55 mb-4 font-bold">
                                Signature Wellness Programs
                            </p>
                            <h3 className="font-serif italic text-5xl md:text-7xl mb-6">
                                {program.name}
                            </h3>
                            <p className="font-sans font-light text-lg md:text-xl opacity-80 max-w-md leading-relaxed mb-10">
                                {program.desc}
                            </p>

                            <Link
                                to={program.link}
                                onClick={() => window.scrollTo(0, 0)}
                                className="magnetic-button inline-block text-center border border-current px-8 py-3 rounded-full text-sm font-sans tracking-wide uppercase hover:bg-current hover:text-stone transition-colors mix-blend-normal"
                            >
                                {program.label}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
