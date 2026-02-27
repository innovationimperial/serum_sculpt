import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, UploadCloud, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

type BlogCategory = 'Menopause' | 'Skin Health' | 'Weight Management' | 'Hormonal Wellness' | 'Skincare Education';
const CATEGORIES: BlogCategory[] = ['Menopause', 'Skin Health', 'Weight Management', 'Hormonal Wellness', 'Skincare Education'];

const BlogEditorPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const existingPost = useQuery(api.blogPosts.get, id ? { id: id as Id<"blogPosts"> } : "skip");
    const createPost = useMutation(api.blogPosts.create);
    const updatePost = useMutation(api.blogPosts.update);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getImageUrl = useMutation(api.files.getImageUrl);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<BlogCategory>('Menopause');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState<'published' | 'draft'>('draft');
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (existingPost) {
            setTitle(existingPost.title);
            setCategory(existingPost.category as BlogCategory);
            setExcerpt(existingPost.excerpt);
            setContent(existingPost.content);
            setFeaturedImage(existingPost.featuredImage);
            setTags(existingPost.tags.join(', '));
            setStatus(existingPost.status);
        }
    }, [existingPost]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            const { storageId } = await result.json();
            const url = await getImageUrl({ storageId });

            if (url) {
                setFeaturedImage(url);
            }
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSave = async () => {
        const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        if (isNew) {
            await createPost({
                title,
                category,
                excerpt,
                content,
                featuredImage,
                tags: tagsArray,
                status,
                publishedDate: status === 'published' ? new Date().toISOString().split('T')[0] : '',
                readTimeMin: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
            });
        } else {
            await updatePost({
                id: id as Id<"blogPosts">,
                title,
                category,
                excerpt,
                content,
                featuredImage,
                tags: tagsArray,
                status,
                publishedDate: status === 'published' ? new Date().toISOString().split('T')[0] : '',
                readTimeMin: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
            });
        }
        navigate('/admin/blog');
    };

    if (!isNew && existingPost === undefined) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/admin/blog" className="flex items-center gap-2 text-sm text-charcoal/50 hover:text-moss transition-colors font-sans">
                    <ArrowLeft size={16} /> Back to Posts
                </Link>
                <div className="flex gap-3">
                    <button onClick={() => { setStatus('draft'); handleSave(); }} disabled={isUploading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-charcoal/10 text-sm font-sans font-semibold text-charcoal/60 hover:border-charcoal/30 transition-colors cursor-pointer disabled:opacity-50">
                        <Eye size={14} /> Save Draft
                    </button>
                    <button onClick={() => { setStatus('published'); handleSave(); }} disabled={isUploading} className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors cursor-pointer disabled:opacity-50">
                        <Save size={14} /> {isNew ? 'Publish' : 'Update'}
                    </button>
                </div>
            </div>

            {/* Title */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." className="w-full font-serif italic text-3xl text-charcoal placeholder:text-charcoal/20 focus:outline-none" />
            </div>

            {/* Meta */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Post Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as BlogCategory)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors appearance-none">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Tags (comma-separated)</label>
                        <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4">Featured Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex justify-center items-center w-full px-4 py-8 rounded-xl border-2 border-dashed border-charcoal/10 font-sans text-sm text-charcoal/60 hover:bg-stone/30 hover:border-moss/40 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-moss" size={24} />
                                <span>Uploading image...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <UploadCloud size={24} className="text-charcoal/40" />
                                <span>Click to upload featured image</span>
                                <span className="text-xs text-charcoal/30">PNG, JPG, WEBP up to 5MB</span>
                            </div>
                        )}
                    </button>
                    {featuredImage && !isUploading && (
                        <div className="mt-4 relative group rounded-xl overflow-hidden border border-charcoal/10">
                            <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => setFeaturedImage('')}
                                    className="px-4 py-2 bg-white text-rose-500 rounded-lg text-sm font-semibold hover:bg-rose-50"
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Excerpt</label>
                    <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none" />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Content</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={16} placeholder="Write your article content..." className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none" />
            </div>
        </div>
    );
};

export default BlogEditorPage;
