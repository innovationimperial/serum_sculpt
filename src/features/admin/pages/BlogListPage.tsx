import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Clock, TrendingUp } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

interface BlogRow {
    _id: string;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    tags: string[];
    status: 'published' | 'draft';
    publishedDate: string;
    views: number;
    readTimeMin: number;
    engagement: number;
}

const BlogListPage: React.FC = () => {
    const posts = useQuery(api.blogPosts.list, {});

    if (!posts) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading posts...</div>
            </div>
        );
    }

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

    const columns = [
        {
            key: 'title' as keyof BlogRow,
            label: 'Title',
            sortable: true,
            render: (_: BlogRow[keyof BlogRow], row: BlogRow) => (
                <div className="flex items-center gap-3">
                    <img src={row.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-semibold text-charcoal truncate">{row.title}</p>
                        <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">{row.category}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'status' as keyof BlogRow,
            label: 'Status',
            sortable: true,
            width: '100px',
            render: (val: BlogRow[keyof BlogRow]) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${val === 'published'
                    ? 'bg-moss/10 text-moss'
                    : 'bg-charcoal/5 text-charcoal/40'
                    }`}>
                    {String(val)}
                </span>
            ),
        },
        {
            key: 'publishedDate' as keyof BlogRow,
            label: 'Date',
            sortable: true,
            width: '120px',
            render: (val: BlogRow[keyof BlogRow]) => (
                <span className="text-charcoal/50">{val ? String(val) : '—'}</span>
            ),
        },
        {
            key: 'views' as keyof BlogRow,
            label: 'Views',
            sortable: true,
            width: '80px',
            render: (val: BlogRow[keyof BlogRow]) => (
                <span className="flex items-center gap-1 text-charcoal/60">
                    <Eye size={12} />
                    {Number(val).toLocaleString()}
                </span>
            ),
        },
        {
            key: 'readTimeMin' as keyof BlogRow,
            label: 'Read',
            width: '80px',
            render: (val: BlogRow[keyof BlogRow]) => (
                <span className="flex items-center gap-1 text-charcoal/50">
                    <Clock size={12} />
                    {String(val)}m
                </span>
            ),
        },
        {
            key: 'engagement' as keyof BlogRow,
            label: 'Engage',
            sortable: true,
            width: '90px',
            render: (val: BlogRow[keyof BlogRow]) => {
                const num = Number(val);
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-charcoal/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-moss rounded-full transition-all"
                                style={{ width: `${num}%` }}
                            />
                        </div>
                        <span className="text-xs text-charcoal/50">{num}%</span>
                    </div>
                );
            },
        },
    ];

    // Map Convex docs to match DataTable expectations (id → _id)
    const tableData = posts.map(p => ({ ...p, id: p._id }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm font-sans">
                        <span className="text-charcoal/80 font-semibold">{publishedCount}</span>
                        <span className="text-charcoal/40">published</span>
                        <span className="text-charcoal/20 mx-1">·</span>
                        <span className="text-charcoal/80 font-semibold">{draftCount}</span>
                        <span className="text-charcoal/40">drafts</span>
                        <span className="text-charcoal/20 mx-1">·</span>
                        <span className="flex items-center gap-1 text-charcoal/40">
                            <TrendingUp size={12} className="text-moss" />
                            {totalViews.toLocaleString()} total views
                        </span>
                    </div>
                </div>
                <Link
                    to="/admin/blog/new"
                    className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer"
                >
                    <Plus size={16} />
                    New Post
                </Link>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={tableData as unknown as BlogRow[]}
                onRowClick={(row) => {
                    window.location.href = `/admin/blog/${(row as unknown as { _id: string })._id}`;
                }}
                emptyMessage="No blog posts yet. Start writing!"
            />
        </div>
    );
};

export default BlogListPage;
