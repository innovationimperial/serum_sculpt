import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import type { ProductCategory, ProductStatus } from '../types';

const CATEGORIES: ProductCategory[] = ['Skincare', 'Makeup', 'Wellness', 'Hemp', 'Tools'];
const STATUSES: ProductStatus[] = ['active', 'hidden', 'out_of_stock'];

const ProductEditorPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const existing = id ? MOCK_PRODUCTS.find(p => p.id === id) : null;
    const isNew = !id;

    const [name, setName] = useState(existing?.name || '');
    const [category, setCategory] = useState<ProductCategory>(existing?.category || 'Skincare');
    const [price, setPrice] = useState(existing?.price?.toString() || '');
    const [description, setDescription] = useState(existing?.description || '');
    const [image, setImage] = useState(existing?.image || '');
    const [clinicalGuidance, setClinicalGuidance] = useState(existing?.clinicalGuidance || '');
    const [usage, setUsage] = useState(existing?.usage || '');
    const [ingredients, setIngredients] = useState(existing?.ingredients?.join(', ') || '');
    const [status, setStatus] = useState<ProductStatus>(existing?.status || 'active');
    const [showDelete, setShowDelete] = useState(false);

    const statusColors: Record<string, string> = {
        active: 'bg-moss/10 text-moss border-moss/20',
        hidden: 'bg-charcoal/5 text-charcoal/40 border-charcoal/10',
        out_of_stock: 'bg-red-50 text-red-600 border-red-200',
    };

    const handleSave = () => {
        if (!name.trim()) {
            toast('error', 'Product name is required');
            return;
        }
        if (!price || isNaN(Number(price))) {
            toast('error', 'Valid price is required');
            return;
        }
        toast('success', isNew ? 'Product created successfully!' : 'Product updated successfully!');
        // In real app: API call, then navigate
        setTimeout(() => navigate('/admin/products'), 500);
    };

    const handleDelete = () => {
        toast('success', `"${name}" has been deleted`);
        setShowDelete(false);
        setTimeout(() => navigate('/admin/products'), 500);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <Link
                    to="/admin/products"
                    className="flex items-center gap-2 text-sm font-sans text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
                <div className="flex items-center gap-3">
                    {!isNew && (
                        <button
                            onClick={() => setShowDelete(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-sans text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer"
                    >
                        <Save size={14} />
                        {isNew ? 'Create Product' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-charcoal/5 p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Product Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter product name..."
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-serif italic text-xl text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Image URL</label>
                        <input
                            type="text"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                        />
                        {image && <img src={image} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-xl" />}
                    </div>

                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Product description..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Clinical Guidance</label>
                        <textarea
                            value={clinicalGuidance}
                            onChange={e => setClinicalGuidance(e.target.value)}
                            placeholder="Why we recommend this clinically..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Usage Instructions</label>
                        <textarea
                            value={usage}
                            onChange={e => setUsage(e.target.value)}
                            placeholder="How to use this product..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Ingredients (comma-separated)</label>
                        <input
                            type="text"
                            value={ingredients}
                            onChange={e => setIngredients(e.target.value)}
                            placeholder="Retinol, Hyaluronic Acid, Niacinamide"
                            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                        />
                    </div>
                </div>

                {/* Side panel */}
                <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Price (ZAR) *</label>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-lg font-semibold text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as ProductCategory)}
                                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors bg-transparent cursor-pointer"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Status</label>
                            <div className="space-y-2">
                                {STATUSES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-semibold transition-all duration-200 capitalize cursor-pointer ${status === s ? statusColors[s] : 'border-charcoal/5 text-charcoal/30 hover:border-charcoal/10'
                                            }`}
                                    >
                                        {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats (read-only, only in edit mode) */}
                    {existing && (
                        <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                            <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4">Performance</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-sans text-charcoal/50">Views</span>
                                    <span className="text-sm font-sans font-semibold text-charcoal">{existing.views}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-sans text-charcoal/50">Cart Adds</span>
                                    <span className="text-sm font-sans font-semibold text-charcoal">{existing.addToCartCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-sans text-charcoal/50">Conversion</span>
                                    <span className="text-sm font-sans font-semibold text-moss">{existing.conversionRate}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete dialog */}
            <ConfirmDialog
                isOpen={showDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${name}"? This cannot be undone.`}
                confirmLabel="Delete Product"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
            />
        </div>
    );
};

export default ProductEditorPage;
