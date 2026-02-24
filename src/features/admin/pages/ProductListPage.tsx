import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, TrendingUp, LayoutGrid, List, Plus, Pencil, ToggleLeft, ToggleRight, Trash2, Settings2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { SearchFilter } from '../components/SearchFilter';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CategoryManager } from '../components/CategoryManager';
import { useToast } from '../components/Toast';
import type { AdminProduct, ProductStatus } from '../types';

const DEFAULT_CATEGORIES = ['All', 'Skincare', 'Makeup', 'Wellness', 'Hemp', 'Tools'];

const ProductListPage: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [products, setProducts] = useState<AdminProduct[]>(MOCK_PRODUCTS);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES.slice(1)); // Without "All"
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

    // Filtered products
    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
            return matchesSearch && matchesCat;
        });
    }, [products, search, categoryFilter]);

    const totalViews = products.reduce((s, p) => s + p.views, 0);
    const totalCarts = products.reduce((s, p) => s + p.addToCartCount, 0);
    const avgConversion = products.length > 0
        ? (products.reduce((s, p) => s + p.conversionRate, 0) / products.length).toFixed(1)
        : '0';

    const toggleStatus = (id: string) => {
        setProducts(prev => prev.map(p => {
            if (p.id !== id) return p;
            const nextStatus: Record<ProductStatus, ProductStatus> = {
                active: 'hidden',
                hidden: 'active',
                out_of_stock: 'active',
            };
            return { ...p, status: nextStatus[p.status] };
        }));
        toast('success', 'Product status updated');
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
        toast('success', `"${deleteTarget.name}" deleted`);
        setDeleteTarget(null);
    };

    const statusColors: Record<string, string> = {
        active: 'bg-moss/10 text-moss',
        hidden: 'bg-charcoal/5 text-charcoal/40',
        out_of_stock: 'bg-red-50 text-red-600',
    };

    const filterOptions = [
        { value: 'All', label: 'All Categories' },
        ...categories.map(c => ({ value: c, label: c })),
    ];

    const renderProductCard = (product: AdminProduct) => (
        <div
            key={product.id}
            className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
        >
            {/* Image + badge */}
            <Link to={`/admin/products/${product.id}`} className="block relative">
                <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusColors[product.status]}`}>
                    {product.status.replace('_', ' ')}
                </span>
            </Link>

            <div className="p-5">
                <Link to={`/admin/products/${product.id}`} className="block">
                    <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-charcoal/30 font-bold mb-1">{product.category}</p>
                    <h3 className="font-serif italic text-lg text-charcoal mb-1 group-hover:text-moss transition-colors">{product.name}</h3>
                    <p className="font-sans text-lg font-semibold text-charcoal">R{product.price.toLocaleString()}</p>
                </Link>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-charcoal/5 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-1 text-charcoal/40 mb-1">
                            <Eye size={11} />
                            <span className="text-[10px] font-sans font-bold uppercase">Views</span>
                        </div>
                        <span className="font-sans text-sm font-semibold text-charcoal">{product.views}</span>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 text-charcoal/40 mb-1">
                            <ShoppingCart size={11} />
                            <span className="text-[10px] font-sans font-bold uppercase">Carts</span>
                        </div>
                        <span className="font-sans text-sm font-semibold text-charcoal">{product.addToCartCount}</span>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 text-charcoal/40 mb-1">
                            <TrendingUp size={11} />
                            <span className="text-[10px] font-sans font-bold uppercase">Conv.</span>
                        </div>
                        <span className="font-sans text-sm font-semibold text-moss">{product.conversionRate}%</span>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="mt-3 pt-3 border-t border-charcoal/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={(e) => { e.preventDefault(); navigate(`/admin/products/${product.id}`); }}
                        className="flex items-center gap-1 text-xs font-sans text-charcoal/40 hover:text-moss transition-colors cursor-pointer"
                    >
                        <Pencil size={12} /> Edit
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); toggleStatus(product.id); }}
                        className="flex items-center gap-1 text-xs font-sans text-charcoal/40 hover:text-moss transition-colors cursor-pointer"
                    >
                        {product.status === 'active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {product.status === 'active' ? 'Hide' : 'Activate'}
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); setDeleteTarget(product); }}
                        className="flex items-center gap-1 text-xs font-sans text-charcoal/40 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProductRow = (product: AdminProduct) => (
        <div
            key={product.id}
            className="bg-white rounded-2xl border border-charcoal/5 p-4 flex items-center gap-5 hover:shadow-md transition-shadow duration-200 group"
        >
            <Link to={`/admin/products/${product.id}`} className="flex items-center gap-5 flex-1 min-w-0">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif italic text-base text-charcoal truncate">{product.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${statusColors[product.status]}`}>
                            {product.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-widest">{product.category} · R{product.price.toLocaleString()}</p>
                </div>
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm font-sans flex-shrink-0">
                <span className="flex items-center gap-1 text-charcoal/50"><Eye size={12} /> {product.views}</span>
                <span className="flex items-center gap-1 text-charcoal/50"><ShoppingCart size={12} /> {product.addToCartCount}</span>
                <span className="flex items-center gap-1 text-moss font-semibold"><TrendingUp size={12} /> {product.conversionRate}%</span>
            </div>
            {/* Row actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => toggleStatus(product.id)} className="p-2 text-charcoal/30 hover:text-moss transition-colors cursor-pointer" title="Toggle status">
                    {product.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => setDeleteTarget(product)} className="p-2 text-charcoal/30 hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-3 flex-1">
                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm font-sans flex-wrap">
                        <span className="text-charcoal/80 font-semibold">{products.length} products</span>
                        <span className="text-charcoal/20">·</span>
                        <span className="flex items-center gap-1 text-charcoal/40"><Eye size={12} /> {totalViews.toLocaleString()} views</span>
                        <span className="text-charcoal/20">·</span>
                        <span className="flex items-center gap-1 text-charcoal/40"><ShoppingCart size={12} /> {totalCarts} cart adds</span>
                        <span className="text-charcoal/20">·</span>
                        <span className="flex items-center gap-1 text-moss"><TrendingUp size={12} /> {avgConversion}% avg conv.</span>
                    </div>

                    {/* Search + filter */}
                    <SearchFilter
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search products..."
                        filterValue={categoryFilter}
                        onFilterChange={setCategoryFilter}
                        filterOptions={filterOptions}
                        filterLabel="Category"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCategoryManager(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-charcoal/10 text-sm font-sans text-charcoal/60 hover:border-moss/30 hover:text-moss transition-all cursor-pointer"
                        title="Manage categories"
                    >
                        <Settings2 size={14} />
                        Categories
                    </button>

                    <div className="flex items-center gap-1 border border-charcoal/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-moss text-white' : 'text-charcoal/30 hover:text-charcoal'}`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-moss text-white' : 'text-charcoal/30 hover:text-charcoal'}`}
                        >
                            <List size={14} />
                        </button>
                    </div>

                    <Link
                        to="/admin/products/new"
                        className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors cursor-pointer"
                    >
                        <Plus size={16} />
                        New Product
                    </Link>
                </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-charcoal/5 p-16 text-center">
                    <ShoppingCart size={40} className="mx-auto text-charcoal/10 mb-4" />
                    <p className="font-serif italic text-xl text-charcoal/40 mb-2">No products found</p>
                    <p className="text-sm font-sans text-charcoal/30">
                        {search || categoryFilter !== 'All' ? 'Try adjusting your search or filter.' : 'Add your first product to get started.'}
                    </p>
                </div>
            )}

            {/* Products */}
            {filtered.length > 0 && viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(renderProductCard)}
                </div>
            )}
            {filtered.length > 0 && viewMode === 'list' && (
                <div className="space-y-3">
                    {filtered.map(renderProductRow)}
                </div>
            )}

            {/* Category Manager */}
            <CategoryManager
                isOpen={showCategoryManager}
                onClose={() => setShowCategoryManager(false)}
                categories={categories}
                onCategoriesChange={setCategories}
            />

            {/* Delete confirmation */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default ProductListPage;
