import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { rewriteStorageUrl } from '../../../lib/rewriteStorageUrl';

type ProductStatus = 'active' | 'hidden' | 'out_of_stock';
type StoreName = 'House of Langa' | 'Amway' | 'Hemp wellness' | 'Weight Wellness Store' | 'Serum & Sculpt Clinical Skincare';

const CATEGORIES = ['Skincare', 'Makeup', 'Wellness', 'Hemp Range', 'Tools'];
const STATUSES: ProductStatus[] = ['active', 'hidden', 'out_of_stock'];
const STORES: StoreName[] = ['House of Langa', 'Amway', 'Hemp wellness', 'Weight Wellness Store', 'Serum & Sculpt Clinical Skincare'];
const MAX_IMAGES = 3;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const ProductEditorPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isNew = !id;

    const existingProduct = useQuery(api.products.get, id ? { id: id as Id<"products"> } : "skip");
    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);
    const removeProduct = useMutation(api.products.remove);
    const generateUploadUrl = useMutation(api.products.generateUploadUrl);
    const getImageUrl = useMutation(api.products.getImageUrl);

    const [name, setName] = useState('');
    const [store, setStore] = useState<StoreName>('Serum & Sculpt Clinical Skincare');
    const [category, setCategory] = useState('Skincare');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [clinicalGuidance, setClinicalGuidance] = useState('');
    const [usage, setUsage] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [status, setStatus] = useState<ProductStatus>('active');
    const [showDelete, setShowDelete] = useState(false);
    const [saving, setSaving] = useState(false);

    // Image state: existing URLs from DB + new Files pending upload
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalImages = existingImages.length + pendingFiles.length;

    useEffect(() => {
        if (existingProduct) {
            setName(existingProduct.name);
            setStore(existingProduct.store as StoreName);
            setCategory(existingProduct.category);
            setPrice(existingProduct.price);
            setDescription(existingProduct.description);
            setClinicalGuidance(existingProduct.clinicalGuidance);
            setUsage(existingProduct.usage);
            setIngredients(existingProduct.ingredients.join(', '));
            setStatus(existingProduct.status);
            setExistingImages(existingProduct.images ?? []);
        }
    }, [existingProduct]);

    // Clean up preview URLs on unmount
    useEffect(() => {
        return () => {
            pendingPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [pendingPreviews]);

    const addFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(f => ACCEPTED_TYPES.includes(f.type));
        if (validFiles.length !== fileArray.length) {
            addToast('Only JPEG, PNG, WebP, and GIF images are accepted', 'error');
        }

        const remaining = MAX_IMAGES - totalImages;
        if (remaining <= 0) {
            addToast(`Maximum ${MAX_IMAGES} images allowed`, 'error');
            return;
        }

        const toAdd = validFiles.slice(0, remaining);
        if (validFiles.length > remaining) {
            addToast(`Only ${remaining} more image(s) allowed — extras were skipped`, 'error');
        }

        const newPreviews = toAdd.map(f => URL.createObjectURL(f));
        setPendingFiles(prev => [...prev, ...toAdd]);
        setPendingPreviews(prev => [...prev, ...newPreviews]);
    }, [totalImages, addToast]);

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removePendingImage = (index: number) => {
        URL.revokeObjectURL(pendingPreviews[index]);
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
        setPendingPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Drag event handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
            e.target.value = ''; // Reset so same file can be selected again
        }
    };

    const handleSave = async () => {
        // Validate required fields
        if (!name.trim()) {
            addToast('Product name is required', 'error');
            return;
        }
        if (price <= 0) {
            addToast('Price must be greater than zero', 'error');
            return;
        }
        if (!description.trim()) {
            addToast('Description is required', 'error');
            return;
        }
        if (existingImages.length === 0 && pendingFiles.length === 0) {
            addToast('At least one product image is required', 'error');
            return;
        }

        setSaving(true);
        try {
            // Upload any pending files to Convex storage and resolve to serving URLs
            const uploadedUrls: string[] = [];
            for (const file of pendingFiles) {
                const uploadUrl = rewriteStorageUrl(await generateUploadUrl());
                const result = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': file.type },
                    body: file,
                });
                if (!result.ok) {
                    throw new Error(`Upload failed for ${file.name}`);
                }
                const { storageId } = await result.json();
                // Resolve storage ID to a serving URL
                const rawServingUrl = await getImageUrl({ storageId });
                if (!rawServingUrl) {
                    throw new Error(`Failed to resolve URL for ${file.name}`);
                }
                uploadedUrls.push(rewriteStorageUrl(rawServingUrl));
            }

            const allImages = [...existingImages, ...uploadedUrls];
            const ingredientsArray = ingredients.split(',').map(i => i.trim()).filter(Boolean);

            if (isNew) {
                await createProduct({
                    name,
                    store,
                    category,
                    price,
                    description,
                    images: allImages,
                    clinicalGuidance: clinicalGuidance || '',
                    usage: usage || '',
                    ingredients: ingredientsArray,
                    status,
                });
                addToast('Product created successfully!', 'success');
            } else {
                await updateProduct({
                    id: id as Id<"products">,
                    name,
                    store,
                    category,
                    price,
                    description,
                    images: allImages,
                    clinicalGuidance: clinicalGuidance || '',
                    usage: usage || '',
                    ingredients: ingredientsArray,
                    status,
                });
                addToast('Product updated successfully!', 'success');
            }
            navigate('/admin/products');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save product';
            addToast(message, 'error');
            console.error('Save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            await removeProduct({ id: id as Id<"products"> });
            addToast('Product deleted', 'success');
            navigate('/admin/products');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete product';
            addToast(message, 'error');
        }
    };

    if (!isNew && existingProduct === undefined) {
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
                <Link to="/admin/products" className="flex items-center gap-2 text-sm text-charcoal/50 hover:text-moss transition-colors font-sans">
                    <ArrowLeft size={16} /> Back to Products
                </Link>
                <div className="flex gap-3">
                    {!isNew && (
                        <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-sm font-sans font-semibold text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                            <Trash2 size={14} /> Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={14} /> {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Product Details</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Product Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Store</label>
                        <select value={store} onChange={e => setStore(e.target.value as StoreName)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors appearance-none">
                            {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors appearance-none">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as ProductStatus)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors appearance-none">
                            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Price (ZAR)</label>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none" />
                </div>

                {/* Image Upload Zone */}
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">
                        Product Images ({totalImages}/{MAX_IMAGES})
                    </label>

                    {/* Image Previews */}
                    {totalImages > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {existingImages.map((url, i) => (
                                <div key={`existing-${i}`} className="relative group aspect-square rounded-xl overflow-hidden bg-charcoal/5 border border-charcoal/10">
                                    <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded-full font-sans">
                                        {i === 0 ? 'Main' : `#${i + 1}`}
                                    </div>
                                </div>
                            ))}
                            {pendingPreviews.map((url, i) => (
                                <div key={`pending-${i}`} className="relative group aspect-square rounded-xl overflow-hidden bg-charcoal/5 border border-charcoal/10">
                                    <img src={url} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removePendingImage(i)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-moss/80 text-white text-[10px] rounded-full font-sans">
                                        New
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Drop Zone */}
                    {totalImages < MAX_IMAGES && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                relative flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                                ${isDragOver
                                    ? 'border-moss bg-moss/10 scale-[1.01]'
                                    : 'border-charcoal/15 bg-charcoal/[0.02] hover:border-moss/40 hover:bg-moss/5'
                                }
                            `}
                        >
                            <div className={`p-3 rounded-full transition-colors ${isDragOver ? 'bg-moss/20 text-moss' : 'bg-charcoal/5 text-charcoal/30'}`}>
                                {isDragOver ? <Upload size={24} /> : <ImageIcon size={24} />}
                            </div>
                            <div className="text-center">
                                <p className="font-sans text-sm text-charcoal/60">
                                    {isDragOver ? (
                                        <span className="text-moss font-semibold">Drop images here</span>
                                    ) : (
                                        <>
                                            <span className="text-moss font-semibold">Click to browse</span> or drag images here
                                        </>
                                    )}
                                </p>
                                <p className="font-sans text-xs text-charcoal/35 mt-1">
                                    JPEG, PNG, WebP, or GIF • {MAX_IMAGES - totalImages} more allowed
                                </p>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Clinical */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Clinical Information</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Clinical Guidance</label>
                    <textarea value={clinicalGuidance} onChange={e => setClinicalGuidance(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Usage</label>
                    <textarea value={usage} onChange={e => setUsage(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Ingredients (comma-separated)</label>
                    <input type="text" value={ingredients} onChange={e => setIngredients(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                </div>
            </div>

            <ConfirmDialog isOpen={showDelete} title="Delete Product" message={`Are you sure you want to delete "${name}"?`} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} confirmLabel="Delete" variant="danger" />
        </div>
    );
};

export default ProductEditorPage;
