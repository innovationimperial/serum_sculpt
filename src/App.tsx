import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Philosophy from './components/Philosophy';
import CuratedSkincare from './components/CuratedSkincare';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative w-full bg-white min-h-screen font-sans text-charcoal selection:bg-moss selection:text-white">
      {/* Global Noise Overlay */}
      <div className="noise-bg" />

      <Navbar />

      <main>
        <Hero />
        <Services />
        <Philosophy />
        <CuratedSkincare />
      </main>

      <Footer />
    </div>
  );
}

export default App;
