import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { MOCK_STORE_SETTINGS } from '../data/mockData';

const StoreSettingsPage: React.FC = () => {
    const [heroImage, setHeroImage] = useState(MOCK_STORE_SETTINGS.heroImage);
    const [tagline, setTagline] = useState(MOCK_STORE_SETTINGS.tagline);
    const [description, setDescription] = useState(MOCK_STORE_SETTINGS.description);
    const [announcement, setAnnouncement] = useState(MOCK_STORE_SETTINGS.announcementBanner);
    const [brands, setBrands] = useState(MOCK_STORE_SETTINGS.partnerBrands);
    const [newBrand, setNewBrand] = useState('');

    const addBrand = () => {
        if (newBrand.trim()) {
            setBrands(prev => [...prev, { id: `pb${Date.now()}`, name: newBrand.trim(), logoUrl: '' }]);
            setNewBrand('');
        }
    };

    const removeBrand = (id: string) => {
        setBrands(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Save button */}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer">
                    <Save size={14} />
                    Save Settings
                </button>
            </div>

            {/* Hero image */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Store Hero</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Hero Image URL</label>
                    <input
                        type="text"
                        value={heroImage}
                        onChange={e => setHeroImage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors"
                    />
                    {heroImage && <img src={heroImage} alt="Store hero" className="mt-3 w-full h-56 object-cover rounded-xl" />}
                </div>
            </div>

            {/* Store copy */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Store Copy</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Tagline</label>
                    <input
                        type="text"
                        value={tagline}
                        onChange={e => setTagline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-serif italic text-xl text-charcoal focus:outline-none focus:border-moss/40 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none"
                    />
                </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Announcement Banner</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Banner Text</label>
                    <input
                        type="text"
                        value={announcement}
                        onChange={e => setAnnouncement(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors"
                    />
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
                            <button
                                onClick={() => removeBrand(brand.id)}
                                className="text-charcoal/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newBrand}
                        onChange={e => setNewBrand(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addBrand()}
                        placeholder="Add new brand name..."
                        className="flex-1 px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                    />
                    <button
                        onClick={addBrand}
                        className="px-4 py-3 rounded-xl bg-sage/50 text-moss hover:bg-moss hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreSettingsPage;
