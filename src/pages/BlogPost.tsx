import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, Clock } from 'lucide-react';
import type { Id } from '../../convex/_generated/dataModel';

export default function BlogPost() {
    const { id } = useParams<{ id: string }>();

    const post = useQuery(api.blogPosts.get, id ? { id: id as Id<"blogPosts"> } : "skip");

    if (post === undefined) {
        return (
            <div className="min-h-screen bg-stone flex items-center justify-center">
                <div className="font-serif italic text-moss text-2xl animate-pulse">Loading article...</div>
            </div>
        );
    }

    if (post === null) {
        return (
            <div className="min-h-screen bg-stone pt-32 px-8 flex flex-col items-center">
                <h1 className="font-serif text-4xl text-charcoal mb-4">Article Not Found</h1>
                <p className="text-charcoal/60 mb-8">The structured clinical insight you are looking for does not exist or has been removed.</p>
                <Link to="/education" className="flex items-center gap-2 text-moss hover:bg-moss hover:text-white px-6 py-3 border border-moss rounded-full transition-all">
                    <ArrowLeft size={16} /> Return to Journals
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen relative">
            {/* Header Content */}
            <div className="pt-32 pb-16 px-8 max-w-4xl mx-auto flex flex-col items-center text-center">
                <Link to="/education" className="self-start flex items-center gap-2 text-charcoal/40 hover:text-moss text-xs font-mono uppercase tracking-widest font-bold mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Hub
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-moss font-bold px-3 py-1.5 bg-moss/5 rounded-full">
                        {post.category}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40 flex items-center gap-1.5">
                        <Clock size={12} /> {post.readTimeMin} min read
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40">
                        {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-8 leading-tight">
                    {post.title}
                </h1>

                <p className="text-xl md:text-2xl text-charcoal/60 font-serif italic max-w-2xl leading-relaxed">
                    {post.excerpt}
                </p>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="w-full max-w-6xl mx-auto px-8 mb-24">
                    <div className="aspect-video bg-stone rounded-[3rem] overflow-hidden border border-stone/10 shadow-sm relative group">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/5 rounded-[3rem] pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Article Content */}
            <div className="px-8 pb-32 max-w-3xl mx-auto">
                {/* Simulated markdown parsing / prose styling */}
                <article className="prose prose-stone lg:prose-lg max-w-none text-charcoal/80 prose-headings:font-serif prose-headings:font-normal prose-h2:text-4xl prose-h3:text-2xl prose-a:text-moss hover:prose-a:text-charcoal prose-img:rounded-3xl prose-blockquote:border-moss prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:text-charcoal/60 prose-strong:text-charcoal">
                    {post.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
                    ))}
                </article>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-charcoal/5 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="font-mono text-[9px] tracking-widest uppercase text-charcoal/40 bg-stone px-3 py-1.5 rounded-full border border-charcoal/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
