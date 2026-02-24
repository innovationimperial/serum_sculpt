import { FileHeart, Flower2, Leaf } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const SERVICES_DATA = [
    {
        id: 1,
        title: 'Consultation Services',
        icon: FileHeart,
        desc: 'Pharmacist-led clinical consultations to establish your baseline and design your personalized holistic wellness journey.',
        features: ['In-Depth Health Assessment', 'Clinical Guidance', 'Personalized Roadmap']
    },
    {
        id: 2,
        title: 'Wellness Programs',
        icon: Leaf,
        desc: 'Evidence-based, multi-week programs focusing on natural weight management, hormonal wellness, and cellular vitality for women.',
        features: ['Weight Management', 'Hormonal Wellness', 'Sustainable Vitality']
    },
    {
        id: 3,
        title: 'Support Plans',
        icon: Flower2,
        desc: 'Ongoing clinical guidance and education to ensure your sustained health and adapt to your evolving wellness needs.',
        features: ['Clinical Monitoring', 'Educational Resources', 'Priority Support']
    }
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate title
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                opacity: 0,
                y: 30,
                duration: 1,
                ease: "power3.out"
            });

            // Animate cards staggered
            if (cardsRef.current) {
                gsap.from(cardsRef.current.children, {
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 85%',
                    },
                    opacity: 0,
                    y: 40,
                    stagger: 0.15,
                    duration: 1,
                    ease: "power3.out"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-8 md:px-16 bg-stone relative">
            <div className="max-w-7xl mx-auto">
                <div ref={titleRef} className="text-center mb-24">
                    <p className="font-mono tracking-widest text-clay uppercase text-sm mb-4 font-bold">Our Expertise</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-moss mb-6">
                        Pharmacist-Led Care
                    </h2>
                    <p className="max-w-xl font-sans font-light tracking-wide text-charcoal/80 leading-relaxed mx-auto text-lg">
                        Bridging the gap between clinical science and holistic wellness to offer a structured, evidence-based approach to your optimal health.
                    </p>
                </div>

                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {SERVICES_DATA.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-sage/20 group"
                                style={{ transform: `translateY(${index % 2 !== 0 ? '2rem' : '0'})` }}
                            >
                                <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-8 text-moss group-hover:scale-110 group-hover:bg-sage/40 transition-all duration-500">
                                    <Icon className="w-8 h-8 font-light" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-3xl mb-4 text-charcoal group-hover:text-moss transition-colors">
                                    {service.title}
                                </h3>
                                <p className="font-sans text-charcoal/70 leading-relaxed mb-8 flex-grow">
                                    {service.desc}
                                </p>
                                <ul className="flex flex-col gap-3 w-full mb-8 pt-6 border-t border-sage/30">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="font-sans text-sm text-charcoal/60 tracking-wide">
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="magnetic-button border border-moss/20 text-moss px-8 py-3 rounded-full text-xs font-sans tracking-widest uppercase hover:bg-moss hover:text-white transition-colors w-full">
                                    Explore Plan
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
