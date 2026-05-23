import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Heart, Sparkles, Sun, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const EXPERIENCES = [
    {
        id: 'bridal',
        title: 'Bridal Reset Experience',
        tagline: 'Glow, sculpt, and prepare for your big day.',
        description: 'Designed for brides who want to feel confident, radiant, and relaxed before the wedding.',
        includes: [
            'Wellness consultation',
            'Lymphatic drainage treatment',
            'Body sculpting session',
            'RF skin tightening',
            'Glow facial or LED therapy',
            'Infrared sauna blanket detox',
            'Bridal wellness lunch & refreshments',
            'Relaxation & breathwork session'
        ],
        perfectFor: ['Reducing bloating before the wedding', 'Enhancing skin glow', 'Stress relief and relaxation', 'Waist sculpting and tightening', 'Bridal party bonding'],
        optionalAddOns: ['Bridal party packages', 'GLP-1 wellness consultation', 'Cell-U-Go slimming wraps', 'IV wellness support', 'Professional makeup collaboration'],
        image: '/vitality_bridal.png',
        icon: <Sparkles className="w-6 h-6 text-clay" />
    },
    {
        id: 'girls-day',
        title: 'Girls Day Out & Wellness Social',
        tagline: 'Relax, reconnect, and recharge together.',
        description: 'A luxury wellness experience designed for friends, sisters, bridesmaids, colleagues, or social groups.',
        includes: [
            'Welcome detox drinks',
            'Group wellness setup',
            'Lymphatic drainage or relaxation massage',
            'Sauna blanket sessions',
            'Mini facials',
            'Stretching or mindfulness session',
            'Healthy wellness lunch platter',
            'Herbal tea station',
            'Photo-worthy luxury wellness setup'
        ],
        perfectFor: ['Birthdays', 'Bridal parties', 'Corporate wellness days', 'Friendship bonding', 'Self-care celebrations'],
        optionalAddOns: ['Matching robes', 'Grazing tables', 'Professional photography', 'Personalized wellness gifts', 'Sparkling beverage station'],
        image: '/vitality_group.png',
        icon: <Users className="w-6 h-6 text-clay" />
    },
    {
        id: 'mothers-day',
        title: 'Mother’s Day Restore Package',
        tagline: 'Celebrate the women who give so much.',
        description: 'A nurturing wellness day designed to restore tired minds and bodies.',
        includes: [
            'Aromatherapy welcome ritual',
            'Relaxation massage',
            'Detox sauna session',
            'Hydrating facial',
            'Herbal teas and wellness lunch',
            'Guided relaxation session',
            'Wellness gift pack'
        ],
        perfectFor: ['Mothers and daughters', 'Mature women', 'Menopause wellness support', 'Stress and burnout recovery'],
        optionalAddOns: ['Mother & daughter experiences', 'Hormonal wellness consultation', 'Body sculpting upgrades', 'Luxury skincare upgrades'],
        image: '/vitality_restore.png',
        icon: <Heart className="w-6 h-6 text-clay" />
    },
    {
        id: 'postnatal',
        title: 'Postnatal Reset Experience',
        tagline: 'Restore, recover, and reconnect with your body.',
        description: 'A gentle wellness experience focused on supporting women after childbirth. Postnatal treatments are tailored according to recovery stage and medical suitability.',
        includes: [
            'Postnatal wellness consultation',
            'Gentle lymphatic drainage',
            'Belly tightening & sculpt support',
            'Relaxation massage',
            'Sauna blanket therapy (where appropriate)',
            'Hydration & nourishment support',
            'Stretching and breathing session'
        ],
        perfectFor: ['Reducing swelling and bloating', 'Supporting circulation', 'Relaxation and emotional wellness', 'Body confidence restoration', 'Self-care and recovery'],
        optionalAddOns: ['Postnatal body sculpting packages', 'Nutrition guidance', 'Compression wrap support', 'Ongoing wellness memberships'],
        image: null,
        icon: <Sun className="w-6 h-6 text-clay" />
    }
];

export default function VitalityRetreat() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.vit-reveal',
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
            <div className="w-full h-[45vh] md:h-[55vh] relative overflow-hidden vit-reveal mb-8">
                <img
                    src="/vitality_hero.png"
                    alt="Vitality Reset Day"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-stone/30 mix-blend-multiply" />
            </div>

            <PageHeader
                id="VIT-001"
                title="Vitality Reset Day."
                subtitle="Luxury Wellness Experiences by Serum and Sculpt"
                description="“Feel lighter, brighter, sculpted, and restored — in just one day.”"
                withTopPadding={false}
            />

            <div className="max-w-4xl mx-auto px-8 md:px-16 text-center vit-reveal mb-24">
                <p className="text-charcoal/80 leading-relaxed md:text-lg mb-6">
                    Vitality Reset Day is a curated wellness experience designed for women who want to reconnect with themselves through relaxation, body treatments, metabolic wellness, and intentional self-care.
                </p>
                <p className="text-charcoal/80 leading-relaxed md:text-lg">
                    Blending wellness, aesthetics, detox, sculpting, and restorative therapies, our day experiences are perfect for celebrations, recovery, bonding, and personal transformation.
                </p>
            </div>

            <div className="pb-12 px-8 md:px-16 max-w-7xl mx-auto">
                <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-16 italic text-center vit-reveal">Our Signature Experiences</h2>

                {EXPERIENCES.map((exp, idx) => (
                    <div key={exp.id} className={`vit-reveal flex flex-col md:flex-row gap-16 mb-24 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        {exp.image && (
                            <div className="md:w-1/2">
                                <div className="aspect-[4/5] bg-stone/20 rounded-[3rem] overflow-hidden sticky top-32">
                                    <img
                                        src={exp.image}
                                        alt={exp.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className={`${exp.image ? 'md:w-1/2' : 'w-full md:max-w-3xl mx-auto'} flex flex-col justify-center`}>
                            <div className="flex items-center gap-4 mb-4">
                                {exp.icon}
                                <h3 className="font-serif text-3xl md:text-4xl text-moss italic">{exp.title}</h3>
                            </div>
                            <p className="font-mono text-xs tracking-widest uppercase text-clay mb-8 font-bold">"{exp.tagline}"</p>
                            <p className="text-charcoal/80 mb-10 leading-relaxed">{exp.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-moss mb-4 uppercase tracking-tighter text-[11px]">Includes</h4>
                                    <ul className="space-y-2">
                                        {exp.includes.map((item, i) => (
                                            <li key={i} className="text-charcoal/70 text-sm flex items-start gap-2">
                                                <span className="text-clay mt-1">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-moss mb-4 uppercase tracking-tighter text-[11px]">Ideal For</h4>
                                    <ul className="space-y-2 mb-6">
                                        {exp.perfectFor.map((item, i) => (
                                            <li key={i} className="text-charcoal/70 text-sm flex items-start gap-2">
                                                <span className="text-moss mt-1">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <h4 className="font-bold text-moss mb-4 uppercase tracking-tighter text-[11px]">Optional Add-Ons</h4>
                                    <ul className="space-y-2">
                                        {exp.optionalAddOns.map((item, i) => (
                                            <li key={i} className="text-charcoal/70 text-sm flex items-start gap-2">
                                                <span className="text-stone-400 mt-1">+</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-stone/20 py-24 px-8 md:px-16 vit-reveal">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6 italic">The Vitality Reset Experience Includes</h2>
                        <p className="text-charcoal/60 text-sm mb-8 uppercase tracking-widest font-bold">Depending on package selection</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            {[
                                'Wellness consultation', 'Body sculpting treatments', 'Lymphatic drainage', 'Sauna blanket detox',
                                'RF skin tightening', 'Glow facial treatments', 'Relaxation therapies', 'Detox refreshments',
                                'Wellness meals & herbal teas', 'Mindfulness & breathwork', 'Take-home wellness guidance'
                            ].map((item, i) => (
                                <li key={i} className="text-charcoal/80 text-sm flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-clay" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-xl">
                        <h2 className="font-serif text-3xl text-moss mb-8 italic">Why Clients Love It</h2>
                        <ul className="space-y-6">
                            {[
                                'Luxury wellness experience without overnight travel',
                                'Ideal for busy women',
                                'Combines beauty, wellness, and restoration',
                                'Visible body and skin benefits',
                                'Relaxing and social atmosphere',
                                'Perfect for groups or individual self-care'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4" xl-key={i}>
                                    <div className="w-6 h-6 rounded-full bg-moss/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-moss text-xs font-bold">✓</span>
                                    </div>
                                    <span className="text-charcoal/80 text-sm leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-24 mb-24 max-w-4xl mx-auto bg-moss rounded-[3rem] p-10 md:p-16 text-center text-white vit-reveal shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-stone/5 mix-blend-overlay opacity-20" />
                <h2 className="font-serif text-4xl md:text-5xl mb-6 relative z-10 italic">Book Your Reset Day</h2>
                <p className="text-stone/80 max-w-xl mx-auto mb-10 relative z-10 font-light leading-relaxed">
                    Whether you are preparing for your wedding, celebrating with friends, recovering after motherhood, or simply needing time to reset — Vitality Reset Day is designed to help you feel your absolute best.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 relative z-10">
                    <button className="bg-white text-moss px-10 py-5 rounded-full uppercase tracking-[0.2em] font-bold text-xs shadow-xl hover:bg-stone transition-colors w-full md:w-auto">
                        Book Advance Slot
                    </button>
                    <button className="bg-transparent border border-white/30 text-white px-10 py-5 rounded-full uppercase tracking-[0.2em] font-bold text-xs hover:bg-white/10 transition-colors w-full md:w-auto">
                        Custom Group Package
                    </button>
                </div>

                <div className="border-t border-white/20 pt-8 relative z-10">
                    <p className="text-xs tracking-widest uppercase font-mono text-stone-300">Location</p>
                    <p className="font-serif text-lg mt-2 italic">Serum and Sculpt</p>
                    <p className="text-stone/70 text-sm">29 Bath Rd, Avondale</p>
                </div>
            </div>
        </div>
    );
}
