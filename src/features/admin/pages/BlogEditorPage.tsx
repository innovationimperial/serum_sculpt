import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '../data/mockData';
import type { BlogCategory, BlogStatus } from '../types';

const CATEGORIES: BlogCategory[] = ['Menopause', 'Skin Health', 'Weight Management', 'Hormonal Wellness', 'Skincare Education'];

const BlogEditorPage: React.FC = () => {
    const { id } = useParams();
    const existing = id ? MOCK_BLOG_POSTS.find(p => p.id === id) : null;

    const [title, setTitle] = useState(existing?.title || '');
    const [category, setCategory] = useState<BlogCategory>(existing?.category || 'Skin Health');
    const [excerpt, setExcerpt] = useState(existing?.excerpt || '');
    const [content, setContent] = useState(existing?.content || '');
    const [featuredImage, setFeaturedImage] = useState(existing?.featuredImage || '');
    const [tags, setTags] = useState(existing?.tags.join(', ') || '');
    const [status, setStatus] = useState<BlogStatus>(existing?.status || 'draft');
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Back + actions */}
            <div className="flex items-center justify-between">
                <Link
                    to="/admin/blog"
                    className="flex items-center gap-2 text-sm font-sans text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Posts
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-charcoal/10 text-sm font-sans text-charcoal/60 hover:border-moss/30 hover:text-moss transition-all duration-200 cursor-pointer"
                    >
                        <Eye size={14} />
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        onClick={() => setStatus('draft')}
                        className="px-4 py-2 rounded-xl border border-charcoal/10 text-sm font-sans text-charcoal/60 hover:border-charcoal/20 transition-all duration-200 cursor-pointer"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => setStatus('published')}
                        className="flex items-center gap-2 bg-moss text-white px-5 py-2 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer"
                    >
                        <Save size={14} />
                        Publish
                    </button>
                </div>
            </div>

            <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Editor form */}
                <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter blog post title..."
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-serif italic text-xl text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                        />
                    </div>

                    {/* Category + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as BlogCategory)}
                                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors bg-transparent cursor-pointer"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Status</label>
                            <div className={`px-4 py-3 rounded-xl text-sm font-sans font-semibold ${status === 'published' ? 'bg-moss/10 text-moss' : 'bg-charcoal/5 text-charcoal/40'
                                }`}>
                                {status === 'published' ? 'Published' : 'Draft'}
                            </div>
                        </div>
                    </div>

                    {/* Featured image */}
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Featured Image URL</label>
                        <input
                            type="text"
                            value={featuredImage}
                            onChange={e => setFeaturedImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                        />
                        {featuredImage && (
                            <img src={featuredImage} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl" />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Excerpt</label>
                        <textarea
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                            placeholder="A short summary of the post..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Content</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Write your article here..."
                            rows={12}
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none leading-relaxed"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="menopause, skincare, wellness"
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                        />
                    </div>
                </div>

                {/* Preview panel */}
                {showPreview && (
                    <div className="bg-white rounded-2xl border border-charcoal/5 p-6 overflow-hidden">
                        <p className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/30 mb-4">Preview</p>
                        {featuredImage && (
                            <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover rounded-xl mb-6" />
                        )}
                        <span className="inline-block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-moss mb-3">{category}</span>
                        <h1 className="font-serif italic text-3xl text-charcoal mb-4 leading-tight">{title || 'Untitled Post'}</h1>
                        <p className="font-sans text-charcoal/60 text-sm leading-relaxed mb-6">{excerpt || 'No excerpt provided.'}</p>
                        <div className="border-t border-charcoal/5 pt-6">
                            <p className="font-sans text-charcoal/80 text-sm leading-relaxed whitespace-pre-wrap">
                                {content || 'Start writing your content...'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogEditorPage;
