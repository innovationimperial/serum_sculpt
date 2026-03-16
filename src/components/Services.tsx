import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICES_DATA = [
    {
        id: 1,
        title: 'Body Sculpting & Fat Reduction',
        image: '/body sculpting and weight reduction.png',
        desc: 'Non-invasive treatments designed to target stubborn fat, improve body contours, and support lymphatic drainage.',
        features: ['Stubborn Fat Targeting', 'Body Contouring Support', 'Lymphatic Drainage Focus'],
        link: '/services'
    },
    {
        id: 2,
        title: 'Skin Rejuvenation',
        image: '/skin rejuvation.png',
        desc: 'Advanced facial treatments that stimulate collagen, improve skin tone, and restore natural glow.',
        features: ['Collagen Support', 'Tone and Texture Renewal', 'Glow-Restoring Treatments'],
        link: '/services'
    },
    {
        id: 3,
        title: 'Medical Weight Management',
        image: '/medical wellness management.png',
        desc: 'Evidence-based weight loss programs designed to support metabolism, appetite regulation, and sustainable lifestyle change.',
        features: ['Metabolic Support', 'Appetite Regulation', 'Sustainable Change'],
        link: '/programs'
    },
    {
        id: 4,
        title: 'Menopause Wellness',
        image: '/menopause wellness.png',
        desc: 'Specialized protocols supporting women through hormonal transitions including weight gain, skin changes, fatigue, and metabolic shifts.',
        features: ['Hormonal Transition Support', 'Fatigue and Skin Concerns', 'Midlife Wellness Guidance'],
        link: '/programs'
    }
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(titleRef.current,
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );

            if (cardsRef.current) {
                gsap.fromTo(cardsRef.current.children,
                    { opacity: 0, y: 40 },
                    {
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 85%',
                        },
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1,
                        ease: 'power3.out',
                        clearProps: 'all'
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-8 md:px-16 bg-stone relative">
            <div className="max-w-7xl mx-auto">
                <div ref={titleRef} className="text-center mb-24 max-w-3xl mx-auto">
                    <p className="font-mono tracking-[0.28em] text-clay uppercase text-xs mb-4 font-bold">Signature Services</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-moss mb-6">
                        Treatments built around the way your body changes.
                    </h2>
                    <p className="font-sans font-light tracking-wide text-charcoal/80 leading-relaxed text-lg">
                        From contouring and skin renewal to weight management and menopause support, every service is selected to deliver meaningful results with clinical oversight.
                    </p>
                </div>

                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {SERVICES_DATA.map((service) => {
                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 border border-sage/20 group"
                            >
                                <div className="relative w-full h-64 overflow-hidden bg-stone/40">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-8 md:p-10 flex flex-col flex-1">
                                    <h3 className="font-serif text-3xl mb-4 text-charcoal group-hover:text-moss transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="font-sans text-charcoal/70 leading-relaxed mb-8 flex-grow">
                                        {service.desc}
                                    </p>
                                    <ul className="flex flex-col gap-3 w-full mb-8 pt-6 border-t border-sage/30">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="font-sans text-sm text-charcoal/60 tracking-wide">
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to={service.link}
                                        onClick={() => window.scrollTo(0, 0)}
                                        className="magnetic-button inline-block text-center border border-moss/20 text-moss px-8 py-3 rounded-full text-xs font-sans tracking-widest uppercase hover:bg-moss hover:text-white transition-colors w-full"
                                    >
                                        Explore Treatment
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
