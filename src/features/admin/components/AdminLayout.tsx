import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { ToastProvider } from './Toast';

const TITLE_MAP: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/blog': 'Blog Posts',
    '/admin/blog/new': 'New Blog Post',
    '/admin/products': 'Products',
    '/admin/products/new': 'New Product',
    '/admin/store': 'Store Settings',
    '/admin/consultations': 'Consultations',
    '/admin/programs': 'Programs',
    '/admin/programs/new': 'New Program',
};

export const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const title =
        TITLE_MAP[location.pathname] ||
        (location.pathname.startsWith('/admin/blog/') ? 'Edit Blog Post' : '') ||
        (location.pathname.startsWith('/admin/products/') ? 'Edit Product' : '') ||
        'Admin';

    return (
        <ToastProvider>
            <div className="min-h-screen bg-stone flex">
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                    <AdminTopbar title={title} onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                    <main className="flex-1 p-6 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
};

