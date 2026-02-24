import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKINCARE_PRODUCTS = [
    {
        id: 1,
        name: 'House of Langa Selection',
        category: 'PREMIUM CLINICAL COSMETICS',
        desc: 'Elevate your routine with our curated selection of House of Langa. Premium cosmetics aligned with our rigorous clinical standards.',
        bg: 'bg-stone',
        text: 'text-moss',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1500&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Hemp Recovery Concentrate',
        category: 'HEMP WELLNESS & SKINCARE',
        desc: 'Potent, science-backed hemp formulations selected to soothe inflammation and support your skin\'s natural recovery process.',
        bg: 'bg-[#d9e2d5]', // sage
        text: 'text-charcoal',
        // Minimalist, earthy hemp/botanical dropper aesthetic (Verified working link)
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1500&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Advanced Weight Wellness',
        category: 'HOLISTIC WELLNESS / NUTRITION',
        desc: 'Pharmacist-approved wellness and weight management solutions designed to safely and sustainably restore your vitality.',
        bg: 'bg-white',
        text: 'text-charcoal',
        // Premium, sustainable wellness jar/elixir aesthetic (no pills)
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1500&auto=format&fit=crop'
    }
];

export default function CuratedSkincare() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.skincare-card');

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
        <section id="skincare" ref={sectionRef} className="relative w-full bg-stone">
            {/* Introduction text */}
            <div className="absolute top-12 left-0 w-full z-50 px-8 text-center pointer-events-none">
                <h2 className="text-sm font-mono tracking-widest text-moss uppercase mix-blend-multiply opacity-80 mb-2 font-bold">Curated Clinical Skincare</h2>
                <p className="font-sans text-charcoal/70 text-sm max-w-md mx-auto">We stock select products that align with our clinical standards and skin philosophy.</p>
            </div>

            {SKINCARE_PRODUCTS.map((project, index) => (
                <div
                    key={project.id}
                    className={`skincare-card relative w-full h-[100dvh] flex flex-col items-center justify-center p-8 ${project.bg} ${project.text} overflow-hidden`}
                    style={{ zIndex: index }}
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-16">

                        {/* Visual Image / Animation side */}
                        <div className="flex-1 flex justify-center items-center">
                            <div className="relative w-64 h-80 md:w-96 md:h-[30rem] rounded-2xl overflow-hidden shadow-2xl border border-black/5 transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                                <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Content side */}
                        <div className="flex-1 text-center md:text-left">
                            <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-60 mb-6 block">
                                {project.category}
                            </span>
                            <h3 className="font-serif italic text-5xl md:text-7xl mb-6">
                                {project.name}
                            </h3>
                            <p className="font-sans font-light text-lg md:text-xl opacity-80 max-w-md leading-relaxed mb-10">
                                {project.desc}
                            </p>

                            <button className="magnetic-button border border-current px-8 py-3 rounded-full text-sm font-sans tracking-wide uppercase hover:bg-current hover:text-stone transition-colors mix-blend-normal">
                                Explore
                            </button>
                        </div>

                    </div>
                </div>
            ))}
        </section>
    );
}
