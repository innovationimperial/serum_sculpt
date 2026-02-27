import { ClipboardCheck, Activity, HeartPulse } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import PageHeader from '../components/PageHeader';

const SERVICES_LIST = [
    {
        title: "Consultation Services",
        subtitle: "Clinical Assessment",
        icon: ClipboardCheck,
        for: "Women seeking a professional baseline for their skin and wellness journey.",
        includes: [
            "In-depth clinical health analysis",
            "Evidence-based skincare regimen design",
            "Pharmacist-led wellness recommendations",
            "Personalized health roadmap"
        ],
        outcomes: "A clear, medically-sound path to your wellness goals.",
        cta: "Book Assessment",
        link: "/contact"
    },
    {
        title: "Wellness Programs",
        subtitle: "Strategic Guidance",
        icon: Activity,
        for: "Individuals seeking structured pathways for weight and vitality management.",
        includes: [
            "Targeted metabolic support",
            "Sustainable weight management protocols",
            "Hormonal balance strategies",
            "Continuous monitoring"
        ],
        outcomes: "Restored energy, balanced systems, and sustainable results.",
        cta: "Explore Programs",
        link: "/programs"
    },
    {
        title: "Support Plans",
        subtitle: "Long-term Care",
        icon: HeartPulse,
        for: "Those who value continuous clinical guidance and adaptation.",
        includes: [
            "Priority clinical support",
            "Regular progress recalibration",
            "Specialized educational materials",
            "Quarterly skin health reviews"
        ],
        outcomes: "Maintained baseline and long-term vitality through clinical support.",
        cta: "View Plans",
        link: "/education"
    }
];

export default function ServicesPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.srv-card',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1.2,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            <PageHeader
                id="SYS-002"
                title="Clinical Ecosystem."
                subtitle="Service Architecture"
                description="A structured approach to physiological alignment through targeted consultation and support."
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SERVICES_LIST.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                            <div key={idx} className="srv-card bg-stone/10 p-10 rounded-[2.5rem] border border-stone/20 hover:border-moss/20 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                                <div className="w-14 h-14 bg-moss/10 rounded-2xl flex items-center justify-center text-moss mb-8">
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>
                                <p className="font-mono text-[10px] tracking-widest text-clay uppercase mb-2 font-bold">{service.subtitle}</p>
                                <h3 className="font-serif text-3xl text-charcoal mb-6">{service.title}</h3>

                                <div className="space-y-6 text-sm">
                                    <div>
                                        <h4 className="font-bold text-moss mb-1 uppercase tracking-tighter text-[11px]">Primary Focus</h4>
                                        <p className="text-charcoal/60 leading-relaxed">{service.for}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-moss mb-2 uppercase tracking-tighter text-[11px]">Includes</h4>
                                        <ul className="space-y-2 text-charcoal/70">
                                            {service.includes.map((item, i) => (
                                                <li key={i} className="flex gap-2 items-start">
                                                    <span className="w-1 h-1 rounded-full bg-moss mt-2" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-6 border-t border-stone/30">
                                        <p className="italic text-moss font-serif mb-8 text-base">"{service.outcomes}"</p>
                                        <Link to={service.link} className="block text-center w-full bg-moss text-white px-6 py-4 rounded-full uppercase tracking-widest text-[10px] font-bold shadow-lg hover:bg-charcoal transition-colors">
                                            {service.cta}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
