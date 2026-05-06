import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const PROGRAMS = [
    {
        id: 'core-program',
        title: 'METABOSCULT CORE PROGRAM (8 WEEKS)',
        subtitle: 'Essential Fat Loss + Sculpt',
        includes: [
            'Weekly peptide injections',
            '9-in-1 body sculpting treatment (targeted areas)',
            'Lymphatic drainage (basic)',
            'Sauna blanket detox session',
            'Weekly measurements & progress tracking',
            'Nutrition & intermittent fasting guidance'
        ],
        resultsFocus: [
            'Appetite control',
            'Gradual fat loss',
            'Reduced bloating',
            'Improved body shape'
        ],
        pricing: { full: '$500 – $600 (Full Program)', monthly: '$220 – $300 per month' },
        image: '/ts-core.png'
    },
    {
        id: 'deluxe-program',
        title: 'METABOSCULT DELUXE PROGRAM (10–12 WEEKS)',
        subtitle: 'Full Transformation + Sculpt + Tighten',
        includes: [
            'Advanced peptide protocol (escalation dosing)',
            '2x weekly sculpting sessions (initial phase)',
            'Full 9-in-1 combination treatments',
            'Intensive lymphatic drainage',
            'Sauna blanket detox (30–45 mins)',
            'Cellulite reduction therapy',
            'Skin tightening treatments',
            'Weekly measurements & progress tracking',
            'Progress photos & monitoring',
            'Nutrition & supplement guidance'
        ],
        resultsFocus: [
            'Noticeable fat loss',
            'Waistline reduction',
            'Firmer, tighter skin',
            'Reduced cellulite',
            'Visible body transformation'
        ],
        pricing: { full: '$750 – $1,000 (Full Program)', monthly: '$300 – $400 per month' },
        image: '/ts-deluxe.png'
    }
];

const ADD_ONS = [
    { name: 'Extra Sculpting Session', price: '$30 – $50' },
    { name: 'Lymphatic Drainage (Full)', price: '$25 – $40' },
    { name: 'Sauna Blanket Session', price: '$20 – $30' }
];

const BASELINE_TESTING = [
    'Blood glucose / HbA1c',
    'Liver & kidney function',
    'Lipid profile',
    'Thyroid function'
];

export default function TreatmentSchedule() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.ts-reveal',
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
            {/* Hero Image Section */}
            <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden ts-reveal mb-8">
                <img
                    src="/ts-hero.png"
                    alt="Treatment Schedule Hero"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-stone/30 mix-blend-multiply" />
            </div>

            <PageHeader
                id="TS-001"
                title="METABOSCULT PROGRAMS."
                subtitle="Medical Weight Loss Without GLP-1 Cost"
                description="This is a medically guided weight loss program using peptide-assisted metabolic support. Individual results may vary."
                withTopPadding={false}
            />

            {/* Programs Section */}
            <div className="pb-12 px-8 md:px-16 max-w-7xl mx-auto space-y-24">
                {PROGRAMS.map((pkg, idx) => (
                    <div key={pkg.id} className={`ts-reveal grid md:grid-cols-2 gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className={idx % 2 !== 0 ? 'md:order-2' : ''}>
                            <div className="aspect-[4/5] md:aspect-square bg-stone/20 rounded-[3rem] overflow-hidden relative shadow-lg">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-moss/60 to-transparent mix-blend-multiply opacity-50" />
                            </div>
                        </div>

                        <div className={idx % 2 !== 0 ? 'md:order-1' : ''}>
                            <h2 className="font-serif text-3xl md:text-5xl text-moss mb-3 italic leading-tight">{pkg.title}</h2>
                            <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-clay mb-8 font-bold">{pkg.subtitle}</p>

                            <div className="space-y-8">
                                <div className="bg-stone/10 p-6 rounded-3xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-moss uppercase tracking-tighter text-[11px]">Includes</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {pkg.includes.map((step, i) => (
                                            <li key={i} className="text-charcoal/80 text-sm flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-moss mb-3 uppercase tracking-tighter text-[11px] border-b border-stone/20 pb-2">Results Focus</h4>
                                    <ul className="space-y-2 pt-2">
                                        {pkg.resultsFocus.map((item, i) => (
                                            <li key={i} className="text-charcoal/70 text-sm flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-stone/20 pt-6">
                                    <div className="text-left">
                                        <p className="text-clay font-bold text-sm">Monthly Rate</p>
                                        <p className="text-moss font-serif text-2xl italic">{pkg.pricing.monthly}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-clay font-bold text-sm">Full Program Rate</p>
                                        <p className="text-moss font-serif text-2xl md:text-3xl italic">{pkg.pricing.full}</p>
                                    </div>
                                </div>

                                <Link to="/contact" className="inline-flex items-center gap-4 text-moss hover:text-clay transition-colors group pt-2">
                                    <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Book This Program</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add-ons & Medical Assessment Section */}
            <div className="mt-16 bg-stone/20 py-16 md:py-24 px-8 md:px-16 ts-reveal">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                    {/* Add-ons */}
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-moss mb-8 italic">⚙️ Add-On Treatments</h2>
                        <div className="space-y-4">
                            {ADD_ONS.map((addon, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-stone/10 hover:border-clay/30 transition-colors">
                                    <span className="font-sans text-sm font-bold text-charcoal">{addon.name}</span>
                                    <span className="font-serif italic text-moss text-xl">{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medical Assessment */}
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-moss mb-8 italic">🧪 Medical Assessment (Required)</h2>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone/10 space-y-6">
                            <p className="text-charcoal/80 text-sm">All clients must complete baseline testing prior to starting:</p>
                            <ul className="space-y-3">
                                {BASELINE_TESTING.map((test, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-charcoal font-medium">
                                        <div className="w-2 h-2 bg-clay rounded-full" />
                                        {test}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6 border-t border-stone/10 space-y-2">
                                <div className="flex items-center gap-2 text-moss font-bold text-sm uppercase tracking-wider">
                                    <CheckCircle2 size={18} /> Pharmacist-led program
                                </div>
                                <div className="flex items-center gap-2 text-moss font-bold text-sm uppercase tracking-wider">
                                    <CheckCircle2 size={18} /> Weekly monitoring for safety
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clinic Edge CTA */}
            <div className="mt-16 mb-24 px-8 md:px-16 max-w-5xl mx-auto ts-reveal">
                <div className="bg-moss rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    
                    <h2 className="font-serif text-3xl md:text-5xl mb-8 relative z-10 italic">✨ Start Your Transformation</h2>
                    <p className="text-stone/80 text-sm md:text-base font-mono tracking-widest uppercase mb-12 relative z-10">
                        Limited client slots available
                    </p>

                    <Link to="/contact" className="relative z-10 bg-white text-moss px-10 py-5 rounded-full uppercase tracking-[0.2em] font-bold text-xs shadow-xl hover:bg-stone transition-colors inline-block">
                        Book Now: 0772 203 844
                    </Link>
                </div>
            </div>
        </div>
    );
}
