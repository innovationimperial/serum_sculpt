import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { CartProvider } from './features/store/context/CartContext';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/Services'));
const Programs = lazy(() => import('./pages/Programs'));
const Shop = lazy(() => import('./pages/Shop'));
const Education = lazy(() => import('./pages/Education'));
const Contact = lazy(() => import('./pages/Contact'));

// Lazy load global modals
const CartDrawer = lazy(() => import('./features/store/components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const CheckoutModal = lazy(() => import('./features/store/components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));

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
        <Layout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/education" element={<Education />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <CartDrawer />
            <CheckoutModal />
          </Suspense>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;


