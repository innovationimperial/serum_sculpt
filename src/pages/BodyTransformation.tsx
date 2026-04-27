import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const PACKAGES = [
    {
        id: 'detox-slim',
        title: 'The Detox Slim Reset',
        subtitle: 'Entry Package – Lymphatic + Bloating + Inch Loss',
        bestFor: [
            'Water retention',
            'Menopausal bloating',
            'First-time clients'
        ],
        protocol: [
            'Lymphatic activation (manual or RF vacuum low setting)',
            'Ultrasonic Cavitation (20–30 mins)',
            'RF Vacuum Therapy (stimulate lymph + cellulite)',
            'Sauna Blanket (20–30 mins)',
            'Finish: Hydration + detox drops'
        ],
        duration: '60–75 mins',
        benefits: [
            'Immediate de-bloating',
            'Improved lymph drainage',
            'Kickstarts fat metabolism'
        ],
        packageDetails: '6 sessions (1–2x weekly)',
        pricing: { session: '$45 per session', total: '$240 for 6 sessions' },
        image: '/body-transformation-sculpt.png'
    },
    {
        id: 'sculpt-shrink',
        title: 'The Sculpt & Shrink Protocol',
        subtitle: 'Core Fat Loss + Body Contouring',
        bestFor: [
            'Belly fat, thighs, arms',
            'Clients wanting visible inch loss'
        ],
        protocol: [
            'Laser Lipo Pads (20–30 mins)',
            'Ultrasonic Cavitation (30 mins)',
            'RF Skin Tightening (target 42–45°C for collagen stimulation)',
            'Sauna Blanket (fat flushing phase)'
        ],
        duration: '75–90 mins',
        benefits: [
            'Fat cell shrinkage + breakdown',
            '2–6 cm reduction potential per session',
            'Skin tightening (prevents sagging)'
        ],
        packageDetails: '8 sessions',
        pricing: { session: '$70 per session', total: '$500 for 8 sessions' },
        image: '/wellness%20hero%20section.png' // re-use from programs
    },
    {
        id: 'cellulite-tightening',
        title: 'The Cellulite & Skin Tightening Therapy',
        subtitle: 'RF Vacuum + Collagen Boost',
        bestFor: [
            'Cellulite (especially menopausal)',
            'Loose skin after weight loss'
        ],
        protocol: [
            'RF Vacuum Therapy (deep cellulite + lymph drainage)',
            'RF Skin Tightening (collagen stimulation)',
            'Targeted sculpt massage',
            'Optional: LED or topical collagen serum'
        ],
        duration: '60–75 mins',
        benefits: [
            'Breaks fibrotic cellulite bands',
            'Boosts collagen + elastin',
            'Improves "orange peel" texture'
        ],
        packageDetails: '6–8 sessions',
        pricing: { session: '$60 per session', total: '$380 for 6 sessions' },
        image: '/body-transformation-sculpt.png'
    },
    {
        id: 'glp1',
        title: 'The GLP-1 Body Transformation Program',
        subtitle: 'Medical Weight Loss + Sculpting',
        bestFor: [
            'Significant fat loss',
            'Clients on Ozempic / Mounjaro',
            'Plateau breakers'
        ],
        protocol: [
            'Weekly GLP injection (done medically/pharmacy linked)',
            'Laser Lipo (fat release)',
            'Cavitation (fat breakdown)',
            'RF tightening',
            'Sauna blanket (fat flushing)',
            'Lymphatic drainage'
        ],
        duration: '90 mins weekly',
        benefits: [
            'Lose weight medically while sculpting your body in real time',
            'Ozempic, Mounjaro, or Retatrutide (highly recommended) options',
            'Nutrition + fasting guidance (16:8 optional)',
            'Supplement protocol (berberine, ACV, electrolytes)'
        ],
        packageDetails: '4 treatments/month',
        pricing: { session: 'Clinic Only (no meds): $120 per session | $400/month', total: 'With GLP Medication: $550 – $750/month (depending on dose & supply)' },
        image: '/body-transformation-glp.png'
    },
    {
        id: 'sports-recovery',
        title: 'Sports Recovery & Body Repair',
        subtitle: 'Unique Differentiator – HIGHLY recommended',
        bestFor: [
            'Athletes',
            'Gym clients',
            'Body pain, stiffness'
        ],
        protocol: [
            'RF Therapy (muscle relaxation + circulation)',
            'RF Vacuum (deep tissue + lymphatic flush)',
            'Optional Cavitation (for stubborn fat zones)',
            'Sauna blanket (recovery + detox)'
        ],
        duration: '60 mins',
        benefits: [
            'Reduces muscle tension',
            'Improves circulation',
            'Speeds recovery',
            'Boosts ATP (cellular energy)'
        ],
        packageDetails: '6 sessions',
        pricing: { session: '$50 per session', total: '$270 for 6 sessions' },
        image: '/body-transformation-hero.png'
    }
];

const ADD_ONS = [
    { name: 'Sauna Blanket only', price: '$15' },
    { name: 'Lymphatic Drainage only', price: '$20' },
    { name: 'Lipolysis (small area)', price: '$25' },
    { name: 'Skin tightening add-on', price: '$20' }
];

const CLIENT_JOURNEY = [
    'Consultation + measurements',
    'Choose package',
    'Before photos',
    'Weekly tracking',
    'Upsell GLP if needed'
];

export default function BodyTransformation() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.bt-reveal',
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
            <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bt-reveal mb-8">
                <img
                    src="/body-transformation-hero.png"
                    alt="Body Transformation Hero"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-stone/30 mix-blend-multiply" />
            </div>

            <PageHeader
                id="BT-001"
                title="Signature Body Transformation Menu."
                subtitle="Medical-grade fat loss + body sculpting + lymphatic detox + skin rejuvenation"
                description="We don't just sell sessions. We sell transformations and packages with measurable results."
                withTopPadding={false}
            />

            {/* Packages Section */}
            <div className="pb-12 px-8 md:px-16 max-w-7xl mx-auto space-y-24">
                {PACKAGES.map((pkg, idx) => (
                    <div key={pkg.id} className={`bt-reveal grid md:grid-cols-2 gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-moss mb-3 uppercase tracking-tighter text-[11px] border-b border-stone/20 pb-2">Best For</h4>
                                        <ul className="space-y-2">
                                            {pkg.bestFor.map((item, i) => (
                                                <li key={i} className="text-charcoal/70 text-sm flex items-start gap-2">
                                                    <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-moss mb-3 uppercase tracking-tighter text-[11px] border-b border-stone/20 pb-2">Key Benefits</h4>
                                        <ul className="space-y-2">
                                            {pkg.benefits.map((item, i) => (
                                                <li key={i} className="text-charcoal/70 text-sm flex items-start gap-2">
                                                    <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-stone/10 p-6 rounded-3xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-moss uppercase tracking-tighter text-[11px]">Protocol ({pkg.duration})</h4>
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 text-charcoal/80 text-sm marker:text-clay marker:font-bold">
                                        {pkg.protocol.map((step, i) => (
                                            <li key={i} className="pl-2">{step}</li>
                                        ))}
                                    </ol>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-stone/20 pt-6">
                                    <div>
                                        <h4 className="font-bold text-moss mb-1 uppercase tracking-tighter text-[11px]">Package Structure</h4>
                                        <p className="text-charcoal font-serif italic text-lg">{pkg.packageDetails}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-clay font-bold text-sm">{pkg.pricing.session}</p>
                                        <p className="text-moss font-serif text-2xl md:text-3xl italic">{pkg.pricing.total}</p>
                                    </div>
                                </div>

                                <Link to="/contact" className="inline-flex items-center gap-4 text-moss hover:text-clay transition-colors group pt-2">
                                    <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Book This Transformation</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add-ons & Journey Section */}
            <div className="mt-16 bg-stone/20 py-16 md:py-24 px-8 md:px-16 bt-reveal">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                    {/* Add-ons */}
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-moss mb-8 italic">High-Profit Add-Ons</h2>
                        <div className="space-y-4">
                            {ADD_ONS.map((addon, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-stone/10 hover:border-clay/30 transition-colors">
                                    <span className="font-sans text-sm font-bold text-charcoal">{addon.name}</span>
                                    <span className="font-serif italic text-moss text-xl">{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Client Journey */}
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-moss mb-8 italic">The Client Journey</h2>
                        <div className="relative border-l border-clay/30 ml-4 space-y-8 pb-4">
                            {CLIENT_JOURNEY.map((step, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-clay ring-4 ring-white" />
                                    <span className="font-mono text-[10px] text-clay font-bold uppercase tracking-widest block mb-1">Step 0{i + 1}</span>
                                    <h4 className="font-serif text-xl text-charcoal italic">{step}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Clinic Edge CTA */}
            <div className="mt-16 mb-24 px-8 md:px-16 max-w-5xl mx-auto bt-reveal">
                <div className="bg-moss rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    
                    <h2 className="font-serif text-3xl md:text-5xl mb-8 relative z-10 italic">Your Clinic Edge</h2>
                    <p className="text-stone/80 text-sm md:text-base font-mono tracking-widest uppercase mb-12 relative z-10">
                        You are NOT just a beauty clinic.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10 mb-12">
                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                            <CheckCircle2 size={24} className="mx-auto mb-3 text-clay" />
                            <p className="font-bold text-sm uppercase tracking-wider">Pharmacist-Backed</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                            <CheckCircle2 size={24} className="mx-auto mb-3 text-clay" />
                            <p className="font-bold text-sm uppercase tracking-wider">Medical Weight Loss</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                            <CheckCircle2 size={24} className="mx-auto mb-3 text-clay" />
                            <p className="font-bold text-sm uppercase tracking-wider">Technology-Driven</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                            <CheckCircle2 size={24} className="mx-auto mb-3 text-clay" />
                            <p className="font-bold text-sm uppercase tracking-wider">Menopause-Focused</p>
                        </div>
                    </div>

                    <Link to="/contact" className="relative z-10 bg-white text-moss px-10 py-5 rounded-full uppercase tracking-[0.2em] font-bold text-xs shadow-xl hover:bg-stone transition-colors inline-block">
                        Start Your Transformation
                    </Link>
                </div>
            </div>
        </div>
    );
}
