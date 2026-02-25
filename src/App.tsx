import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { CartProvider } from './features/store/context/CartContext';

// Lazy load public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/Services'));
const Programs = lazy(() => import('./pages/Programs'));
const Shop = lazy(() => import('./pages/Shop'));
const Education = lazy(() => import('./pages/Education'));
const Contact = lazy(() => import('./pages/Contact'));
const SkinAnalysis = lazy(() => import('./pages/SkinAnalysis'));

// Lazy load global modals
const CartDrawer = lazy(() => import('./features/store/components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const CheckoutModal = lazy(() => import('./features/store/components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));

// Lazy load admin
const AdminLayout = lazy(() => import('./features/admin/components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import('./features/admin/pages/DashboardPage'));
const BlogListPage = lazy(() => import('./features/admin/pages/BlogListPage'));
const BlogEditorPage = lazy(() => import('./features/admin/pages/BlogEditorPage'));
const ProductListPage = lazy(() => import('./features/admin/pages/ProductListPage'));
const ProductEditorPage = lazy(() => import('./features/admin/pages/ProductEditorPage'));
const StoreSettingsPage = lazy(() => import('./features/admin/pages/StoreSettingsPage'));
const ConsultationsPage = lazy(() => import('./features/admin/pages/ConsultationsPage'));
const ProgramsPage = lazy(() => import('./features/admin/pages/ProgramsPage'));
const ProgramEditorPage = lazy(() => import('./features/admin/pages/ProgramEditorPage'));

// Simple loading fallback
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-stone">
    <div className="font-serif italic text-moss text-2xl animate-pulse">Serum & Sculpt...</div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/education" element={<Education />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/skin-analysis" element={<SkinAnalysis />} />
            </Route>

            {/* Admin portal — separate layout, no public Navbar/Footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/new" element={<BlogEditorPage />} />
              <Route path="blog/:id" element={<BlogEditorPage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/new" element={<ProductEditorPage />} />
              <Route path="products/:id" element={<ProductEditorPage />} />
              <Route path="store" element={<StoreSettingsPage />} />
              <Route path="consultations" element={<ConsultationsPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="programs/new" element={<ProgramEditorPage />} />
              <Route path="programs/:id" element={<ProgramEditorPage />} />
            </Route>
          </Routes>
          <CartDrawer />
          <CheckoutModal />
        </Suspense>
      </Router>
    </CartProvider>
  );
}

export default App;
