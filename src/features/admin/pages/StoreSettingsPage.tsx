import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, X, UploadCloud, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { rewriteStorageUrl } from '../../../lib/rewriteStorageUrl';

const StoreSettingsPage: React.FC = () => {
    const settings = useQuery(api.storeSettings.get);
    const updateSettings = useMutation(api.storeSettings.update);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getImageUrl = useMutation(api.files.getImageUrl);

    const [heroImage, setHeroImage] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [announcement, setAnnouncement] = useState('');
    const [brands, setBrands] = useState<{ id: string; name: string; logoUrl: string }[]>([]);
    const [newBrand, setNewBrand] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (settings) {
            setHeroImage(settings.heroImage);
            setTagline(settings.tagline);
            setDescription(settings.description);
            setAnnouncement(settings.announcementBanner);
            setBrands(settings.partnerBrands);
        }
    }, [settings]);

    const addBrand = () => {
        if (newBrand.trim()) {
            setBrands(prev => [...prev, { id: `pb${Date.now()}`, name: newBrand.trim(), logoUrl: '' }]);
            setNewBrand('');
        }
    };

    const removeBrand = (id: string) => {
        setBrands(prev => prev.filter(b => b.id !== id));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const postUrl = rewriteStorageUrl(await generateUploadUrl());
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            const { storageId } = await result.json();
            const url = await getImageUrl({ storageId });

            if (url) {
                setHeroImage(rewriteStorageUrl(url));
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
        await updateSettings({
            heroImage,
            tagline,
            description,
            announcementBanner: announcement,
            partnerBrands: brands,
        });
    };

    if (settings === undefined) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Save button */}
            <div className="flex justify-end">
                <button onClick={handleSave} disabled={isUploading} className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer disabled:opacity-50">
                    <Save size={14} />
                    Save Settings
                </button>
            </div>

            {/* Hero image */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Store Hero</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4">Hero Image</label>
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
                                <span>Click to upload hero image</span>
                                <span className="text-xs text-charcoal/30">PNG, JPG, WEBP up to 5MB</span>
                            </div>
                        )}
                    </button>
                    {heroImage && !isUploading && (
                        <div className="mt-4 relative group rounded-xl overflow-hidden border border-charcoal/10">
                            <img src={heroImage} alt="Store hero" className="w-full h-56 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => setHeroImage('')}
                                    className="px-4 py-2 bg-white text-rose-500 rounded-lg text-sm font-semibold hover:bg-rose-50"
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Store copy */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Store Copy</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Tagline</label>
                    <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-serif italic text-xl text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none" />
                </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Announcement Banner</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Banner Text</label>
                    <input type="text" value={announcement} onChange={e => setAnnouncement(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                    {announcement && (
                        <div className="mt-3 bg-moss/10 text-moss px-4 py-2.5 rounded-xl text-sm font-sans font-semibold text-center">
                            {announcement}
                        </div>
                    )}
                </div>
            </div>

            {/* Partner Brands */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Partner Brands</h3>
                <div className="space-y-2">
                    {brands.map(brand => (
                        <div key={brand.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-charcoal/5 group">
                            <span className="font-sans text-sm text-charcoal/80">{brand.name}</span>
                            <button onClick={() => removeBrand(brand.id)} className="text-charcoal/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input type="text" value={newBrand} onChange={e => setNewBrand(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBrand()} placeholder="Add new brand name..." className="flex-1 px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors" />
                    <button onClick={addBrand} className="px-4 py-3 rounded-xl bg-sage/50 text-moss hover:bg-moss hover:text-white transition-colors duration-200 cursor-pointer">
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreSettingsPage;
