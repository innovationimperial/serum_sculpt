import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import PageHeader from '../components/PageHeader';

const MENOPAUSE_CHANGES = [
    'Stubborn weight gain',
    'Loss of muscle tone',
    'Fatigue and slower metabolism',
    'Skin thinning and dryness',
    'Hormonal imbalance'
];

const WELLNESS_APPROACH = [
    'Metabolic support',
    'Weight management strategies',
    'Body sculpting technologies',
    'Skin rejuvenation treatments',
    'Lifestyle and nutritional guidance'
];

const APPROACH_COLUMNS = [
    {
        heading: 'Clinical knowledge',
        description: 'Understanding metabolism, hormones, and physiology.',
    },
    {
        heading: 'Advanced technology',
        description: 'Non-invasive aesthetic treatments designed to enhance natural beauty.',
    },
    {
        heading: 'Personalised wellness strategies',
        description: 'Supporting sustainable weight management, skin health, and metabolic balance.',
    }
];

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.reveal',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.16,
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
            <div className="w-full h-[35vh] md:h-[45vh] relative overflow-hidden reveal mb-8">
                <img
                    src="/clinical%20authority%20servuces.png"
                    alt="Serum and Sculpt clinic interior"
                    className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
                />
                <div className="absolute inset-0 bg-stone/25 mix-blend-multiply" />
            </div>

            <PageHeader
                id="ABOUT-001"
                title="Where Science Meets Aesthetic Wellness"
                subtitle="Our Story"
                description="Serum & Sculpt was founded on the belief that true beauty begins with health, balance, and evidence-based care."
                withTopPadding={false}
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="reveal">
                        <div className="prose prose-lg max-w-none text-charcoal/80 font-light leading-relaxed">
                            <p className="mb-6">
                                Serum & Sculpt was founded on a simple belief: true beauty begins with health.
                            </p>
                            <p className="mb-6">
                                Unlike many aesthetic clinics, Serum & Sculpt is built on a foundation of pharmaceutical and clinical knowledge, bringing a deeper understanding of how the body works from metabolism and hormones to skin biology and weight regulation.
                            </p>
                            <p className="mb-0">
                                Our mission is to provide safe, science-led treatments that help people feel confident in their bodies while supporting long-term wellness.
                            </p>
                        </div>
                    </div>

                    <div className="reveal relative">
                        <div className="aspect-[3/4] bg-stone/30 rounded-[3rem] overflow-hidden relative shadow-2xl">
                            <div className="absolute inset-0 bg-moss/5" />
                            <img
                                src="/founders%20image%20.jpeg"
                                alt="Founder portrait"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-4 md:-left-8 bg-white p-8 rounded-3xl shadow-xl max-w-xs border border-stone/20">
                            <p className="font-serif italic text-moss text-lg mb-2">
                                "We look deeper than appearance so every treatment supports confidence, health, and lasting wellbeing."
                            </p>
                            <p className="font-serif text-charcoal/90 mt-2 font-medium">Clinical Pharmacist & Founder</p>
                            <p className="font-serif text-charcoal/90 font-medium">Pamela Gwatidzo</p>
                        </div>
                    </div>
                </div>

                <div className="mt-32 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
                    <div className="reveal rounded-[2.5rem] bg-stone p-8 md:p-10 border border-stone/30">
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-clay mb-5 font-bold">
                            A Special Focus on Menopause and Midlife Health
                        </p>
                        <p className="text-charcoal/75 leading-relaxed mb-8">
                            For many women, the years around menopause bring unexpected changes. At Serum & Sculpt, we recognize that these changes are biological, not simply lifestyle related.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {MENOPAUSE_CHANGES.map((item) => (
                                <div key={item} className="rounded-[1.5rem] bg-white px-5 py-5 border border-stone/20">
                                    <p className="text-charcoal/80 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reveal rounded-[2.5rem] bg-moss text-white p-8 md:p-10">
                        <h2 className="font-serif text-3xl md:text-5xl mb-5">
                            Integrated care for midlife transformation
                        </h2>
                        <p className="text-white/75 leading-relaxed mb-8">
                            Our menopause-focused wellness approach combines practical support with targeted treatments to help women navigate midlife with confidence, vitality, and renewed self-care.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {WELLNESS_APPROACH.map((item) => (
                                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5">
                                    <p className="text-white/90 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-32 border-t border-stone/20 pt-24">
                    <div className="max-w-3xl mb-12 reveal">
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-clay mb-4 font-bold">Our Approach</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-moss mb-5">
                            We believe lasting results come from treating the whole person.
                        </h2>
                        <p className="text-charcoal/70 text-lg leading-relaxed">
                            That means combining clinical insight, advanced technology, and personalised wellness strategies that support your body over time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {APPROACH_COLUMNS.map((item) => (
                            <div key={item.heading} className="reveal rounded-[2rem] border border-stone/20 p-8 bg-white shadow-sm">
                                <h3 className="font-serif text-2xl text-charcoal mb-4">{item.heading}</h3>
                                <p className="text-charcoal/65 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="reveal rounded-[3rem] bg-gradient-to-r from-[#edf2ea] to-stone px-8 py-10 md:px-12 md:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="max-w-3xl">
                            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-clay mb-4 font-bold">Our Vision</p>
                            <p className="text-charcoal/75 text-lg leading-relaxed">
                                Our vision is to become a leading wellness and aesthetic clinic supporting women through midlife transformation, helping them feel strong, confident, and empowered in their bodies. At Serum & Sculpt, we believe every stage of life deserves to be lived beautifully, confidently, and in good health.
                            </p>
                        </div>
                        <Link
                            to="/contact"
                            className="magnetic-button inline-block text-center bg-moss text-white px-8 py-4 rounded-full text-xs font-sans tracking-[0.2em] uppercase font-bold hover:bg-charcoal transition-colors whitespace-nowrap"
                        >
                            Book Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
