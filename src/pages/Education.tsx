import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Heart, Activity, Sparkles, Shield, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';

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

export default function Education() {
    const containerRef = useRef<HTMLDivElement>(null);
    const posts = useQuery(api.blogPosts.list, { status: 'published' });

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
    }, [posts]);

    const featuredPost = posts?.[0]; // Assume most recent is the featured one
    const remainingPosts = posts?.slice(1) || [];

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            <PageHeader
                id="EDU-005"
                title="Rediscover Wellness."
                subtitle="The Knowledge Hub"
                description="Clinical insights, skin education, and evidence-based strategies for your biological evolution."
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                {/* Categories */}
                <div className="grid md:grid-cols-4 gap-8 mb-24 edu-reveal">
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

                {/* Loading State or Posts Area */}
                {!posts ? (
                    <div className="h-64 flex flex-col items-center justify-center text-charcoal/60 edu-reveal">
                        <div className="w-8 h-8 rounded-full border-2 border-moss border-t-transparent animate-spin mb-4" />
                        <p className="font-mono text-[10px] tracking-widest uppercase">Loading clinical journals...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-charcoal/60 bg-stone/10 rounded-[3rem] edu-reveal">
                        <p className="font-serif italic text-xl">No journals published yet.</p>
                    </div>
                ) : (
                    <div className="edu-reveal space-y-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-serif text-4xl text-moss italic">Latest Insights</h2>
                        </div>

                        {/* Featured Post */}
                        {featuredPost && (
                            <Link to={`/education/${featuredPost._id}`} className="block group">
                                <div className="grid md:grid-cols-2 gap-12 items-center bg-stone/10 rounded-[3rem] p-8 md:p-12 hover:bg-moss/5 transition-colors border border-transparent hover:border-moss/10">
                                    <div className="aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden relative">
                                        {featuredPost.featuredImage ? (
                                            <img src={featuredPost.featuredImage} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-stone flex items-center justify-center text-charcoal/20">
                                                <Sparkles size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="font-mono text-[9px] tracking-widest uppercase text-white font-bold px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full">
                                                Featured
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-moss font-bold px-3 py-1 bg-moss/10 rounded-full">{featuredPost.category}</span>
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40 flex items-center gap-1.5">
                                                <Clock size={12} /> {featuredPost.readTimeMin} min read
                                            </span>
                                        </div>
                                        <h3 className="font-serif text-4xl lg:text-5xl text-charcoal leading-tight group-hover:text-moss transition-colors">{featuredPost.title}</h3>
                                        <p className="text-charcoal/60 text-lg leading-relaxed line-clamp-3 font-serif italic">{featuredPost.excerpt}</p>
                                        <div className="pt-4 flex items-center text-moss font-mono text-[10px] tracking-widest uppercase font-bold group-hover:translate-x-2 transition-transform">
                                            Read Article <ArrowRight size={14} className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Remaining Posts Grid */}
                        {remainingPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-12 border-t border-charcoal/10">
                                {remainingPosts.map((post) => (
                                    <Link key={post._id} to={`/education/${post._id}`} className="group block">
                                        <div className="aspect-[4/3] bg-stone rounded-[2rem] mb-6 overflow-hidden relative">
                                            {post.featuredImage ? (
                                                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-stone/50 flex items-center justify-center text-charcoal/20">
                                                    <Heart size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-2">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="font-mono text-[9px] tracking-widest uppercase text-moss font-bold px-2 py-1 bg-moss/5 rounded-full">{post.category}</span>
                                                <span className="font-mono text-[9px] tracking-widest uppercase text-charcoal/40 flex items-center gap-1">
                                                    <Clock size={10} /> {post.readTimeMin} min
                                                </span>
                                            </div>
                                            <h3 className="font-serif text-2xl text-charcoal mb-3 group-hover:text-moss transition-colors leading-tight">{post.title}</h3>
                                            <p className="text-charcoal/60 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Newsletter CTA */}
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
                        <button className="bg-moss px-8 py-4 rounded-full font-mono text-[10px] tracking-widest uppercase font-bold hover:bg-stone hover:text-moss transition-colors truncate">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
