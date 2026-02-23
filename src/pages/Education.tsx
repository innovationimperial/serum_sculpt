import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Heart, Activity, Sparkles, Shield } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const CATEGORIES = [
    {
        title: 'Menopause Support',
        icon: Heart,
        desc: 'Hormonal navigation and physiological adaptation strategies.'
    },
    {
        title: 'Skin Health',
        icon: Sparkles,
        desc: 'Evidence-based dermatology and clinical skincare science.'
    },
    {
        title: 'Weight Wellness',
        icon: Activity,
        desc: 'Metabolic efficiency and sustainable weight architecture.'
    },
    {
        title: 'Hormonal Alignment',
        icon: Shield,
        desc: 'Understanding biological rhythms and endocrine balance.'
    }
];

const RECENT_ARTICLES = [
    {
        title: "Biological Drift: Understanding Perimenopause",
        category: "Hormonal Alignment",
        readTime: "8 min read",
        excerpt: "Exploring the neuro-endocrine shifts that define the transition into menopause."
    },
    {
        title: "The Science of Clinical Curation",
        category: "Skin Health",
        readTime: "5 min read",
        excerpt: "Why we prioritize ingredient integrity and evidence over viral skincare trends."
    },
    {
        title: "Metabolic Resilience in Mature Skin",
        category: "Weight Wellness",
        readTime: "12 min read",
        excerpt: "How metabolic health directly influences dermal structural integrity."
    }
];

export default function Education() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.edu-reveal',
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
            <PageHeader
                id="EDU-005"
                title="Rediscover Wellness."
                subtitle="The Knowledge Hub"
                description="Clinical insights, skin education, and evidence-based strategies for your biological evolution."
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-32 edu-reveal">
                    {CATEGORIES.map((cat, i) => (
                        <div key={i} className="p-8 bg-stone/5 rounded-3xl border border-stone/10 hover:bg-moss/5 hover:border-moss/20 transition-all group cursor-pointer">
                            <div className="w-12 h-12 bg-moss/10 rounded-2xl flex items-center justify-center text-moss mb-6 group-hover:scale-110 transition-transform">
                                <cat.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-xl text-moss mb-3 italic">{cat.title}</h3>
                            <p className="text-charcoal/60 text-xs leading-relaxed">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="edu-reveal">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="font-serif text-4xl text-moss italic">Clinical Journals</h2>
                        <button className="font-mono text-[10px] tracking-widest uppercase font-bold text-clay hover:text-moss transition-colors">View All Entries</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {RECENT_ARTICLES.map((art, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/3] bg-stone/20 rounded-[2.5rem] mb-6 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-moss/5 group-hover:bg-moss/10 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center text-moss/20 font-serif italic text-xl">Journal Visual</div>
                                </div>
                                <div className="px-2">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="font-mono text-[9px] tracking-widest uppercase text-clay font-bold px-2 py-1 bg-clay/5 rounded-full">{art.category}</span>
                                        <span className="font-mono text-[9px] tracking-widest uppercase text-charcoal/40">{art.readTime}</span>
                                    </div>
                                    <h3 className="font-serif text-2xl text-charcoal mb-4 group-hover:text-moss transition-colors">{art.title}</h3>
                                    <p className="text-charcoal/60 text-sm leading-relaxed line-clamp-2">{art.excerpt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-32 p-8 md:p-16 bg-charcoal rounded-[3.5rem] text-white flex flex-col md:flex-row items-center gap-12 edu-reveal">
                    <div className="flex-grow">
                        <h2 className="font-serif text-3xl md:text-4xl mb-4 italic">The Clinical Newsletter</h2>
                        <p className="text-white/60 font-light max-w-md">Weekly distillations of evidence-based wellness, delivered directly to your inbox.</p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-moss transition-colors w-full sm:min-w-[300px] text-sm"
                        />
                        <button className="bg-moss px-8 py-4 rounded-full font-mono text-[10px] tracking-widest uppercase font-bold hover:bg-stone hover:text-moss transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
