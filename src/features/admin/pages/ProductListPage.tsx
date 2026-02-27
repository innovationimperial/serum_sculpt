import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, TrendingUp, LayoutGrid, List, Plus, Pencil, ToggleLeft, ToggleRight, Trash2, Settings2 } from 'lucide-react';
import { SearchFilter } from '../components/SearchFilter';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

const DEFAULT_CATEGORIES = ['All', 'Skincare', 'Makeup', 'Wellness', 'Hemp Range', 'Tools'];

type ProductStatus = 'active' | 'hidden' | 'out_of_stock';

interface ProductRow {
    _id: Id<"products">;
    name: string;
    store: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    status: ProductStatus;
    views: number;
    addToCartCount: number;
    conversionRate: number;
}

const ProductListPage: React.FC = () => {
    const products = useQuery(api.products.list, {});
    const removeProduct = useMutation(api.products.remove);
    const toggleProductStatus = useMutation(api.products.toggleStatus);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);

    const filtered = useMemo(() => {
        if (!products) return [];
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesCat = filterCategory === 'All' || p.category === filterCategory;
            return matchesSearch && matchesCat;
        });
    }, [products, search, filterCategory]);

    if (!products) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading products...</div>
            </div>
        );
    }

    const toggleStatus = async (id: Id<"products">) => {
        await toggleProductStatus({ id });
        addToast('Status updated', 'success');
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await removeProduct({ id: deleteTarget._id });
        setDeleteTarget(null);
        addToast('Product deleted', 'success');
    };

    const statusLabel: Record<ProductStatus, string> = { active: 'Active', hidden: 'Hidden', out_of_stock: 'Out of Stock' };
    const statusColor: Record<ProductStatus, string> = {
        active: 'bg-moss/10 text-moss',
        hidden: 'bg-charcoal/5 text-charcoal/40',
        out_of_stock: 'bg-red-50 text-red-500',
    };

    const renderProductCard = (product: ProductRow) => (
        <div key={product._id} className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden group hover:shadow-lg hover:border-moss/20 transition-all duration-200">
            <div className="relative h-48 overflow-hidden">
                {(product.images ?? [])[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal/20 font-sans text-xs">No image</div>
                )}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[product.status]}`}>
                    {statusLabel[product.status]}
                </span>
            </div>
            <div className="p-5 space-y-3">
                <div>
                    <p className="text-[10px] font-mono text-clay uppercase tracking-wider font-bold">{product.store}</p>
                    <h3 className="font-serif italic text-lg text-charcoal mt-1">{product.name}</h3>
                </div>
                <div className="flex items-center justify-between text-sm font-sans">
                    <span className="font-bold text-charcoal">R{product.price.toLocaleString()}</span>
                    <span className="text-charcoal/40">{product.category}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-sans text-charcoal/40">
                    <span className="flex items-center gap-1"><Eye size={11} /> {product.views}</span>
                    <span className="flex items-center gap-1"><ShoppingCart size={11} /> {product.addToCartCount}</span>
                    <span className="flex items-center gap-1"><TrendingUp size={11} /> {product.conversionRate}%</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-charcoal/5">
                    <button onClick={() => navigate(`/admin/products/${product._id}`)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-sans font-semibold text-charcoal/60 hover:bg-moss/5 hover:text-moss transition-colors cursor-pointer">
                        <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => toggleStatus(product._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-sans font-semibold text-charcoal/60 hover:bg-moss/5 hover:text-moss transition-colors cursor-pointer">
                        {product.status === 'active' ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                        {product.status === 'active' ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => setDeleteTarget(product)} className="flex items-center justify-center p-2 rounded-lg text-charcoal/20 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProductRow = (product: ProductRow) => (
        <div key={product._id} className="flex items-center gap-4 bg-white rounded-xl border border-charcoal/5 p-4 hover:shadow-md hover:border-moss/20 transition-all duration-200 group">
            {(product.images ?? [])[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            ) : (
                <div className="w-14 h-14 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal/20 text-[8px]">No img</div>
            )}
            <div className="flex-1 min-w-0">
                <p className="font-serif italic text-charcoal truncate">{product.name}</p>
                <p className="text-[10px] font-mono text-clay uppercase tracking-wider font-bold">{product.store}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[product.status]}`}>{statusLabel[product.status]}</span>
            <span className="font-sans text-sm font-bold text-charcoal w-20 text-right">R{product.price.toLocaleString()}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => navigate(`/admin/products/${product._id}`)} className="p-2 rounded-lg hover:bg-moss/5 text-charcoal/40 hover:text-moss transition-colors cursor-pointer"><Pencil size={14} /></button>
                <button onClick={() => toggleStatus(product._id)} className="p-2 rounded-lg hover:bg-moss/5 text-charcoal/40 hover:text-moss transition-colors cursor-pointer">{product.status === 'active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}</button>
                <button onClick={() => setDeleteTarget(product)} className="p-2 rounded-lg hover:bg-red-50 text-charcoal/20 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header + controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <SearchFilter value={search} onChange={setSearch} placeholder="Search products..." categories={DEFAULT_CATEGORIES} activeCategory={filterCategory} onCategoryChange={setFilterCategory} />
                <div className="flex items-center gap-3">
                    <div className="flex rounded-lg border border-charcoal/10 overflow-hidden">
                        <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-moss/10 text-moss' : 'text-charcoal/30 hover:text-charcoal/60'} transition-colors cursor-pointer`}><LayoutGrid size={16} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-moss/10 text-moss' : 'text-charcoal/30 hover:text-charcoal/60'} transition-colors cursor-pointer`}><List size={16} /></button>
                    </div>
                    <Link to="/admin/store" className="p-2.5 rounded-xl border border-charcoal/10 text-charcoal/40 hover:text-moss hover:border-moss/30 transition-colors cursor-pointer"><Settings2 size={16} /></Link>
                    <Link to="/admin/products/new" className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer">
                        <Plus size={16} /> New Product
                    </Link>
                </div>
            </div>

            {/* Product grid / list */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(p => renderProductCard(p as unknown as ProductRow))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(p => renderProductRow(p as unknown as ProductRow))}
                </div>
            )}

            {filtered.length === 0 && (
                <div className="text-center py-16 text-charcoal/30 font-sans">No products found.</div>
            )}

            <ConfirmDialog isOpen={!!deleteTarget} title="Delete Product" message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmLabel="Delete" variant="danger" />
        </div>
    );
};

export default ProductListPage;
