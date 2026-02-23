import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-white relative -mt-10 overflow-hidden z-20">

            {/* Target Programs Grid */}
            <section id="programs" className="max-w-7xl mx-auto px-4 md:px-16 py-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="flex flex-col gap-6 md:col-span-3 text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal italic">Signature Wellness Programs</h2>
                    <p className="font-sans text-charcoal/60 max-w-lg mx-auto">Targeted wellness journeys engineered for deep, restorative alignment.</p>
                </div>

                {/* Tier 1 */}
                <div className="border hover:border-moss/20 rounded-[var(--radius-std)] p-10 flex flex-col items-center text-center transition-colors">
                    <h3 className="font-serif text-2xl mb-4 text-moss">The Awakening</h3>
                    <p className="font-sans text-sm text-charcoal/60 mb-8 max-w-[200px]">Initial biological restoration and holistic nutrient balancing.</p>
                    <Link to="/programs" className="magnetic-button border border-charcoal/20 px-6 py-2 rounded-full font-sans uppercase tracking-widest text-[10px] font-bold mt-auto hover:bg-moss hover:text-white transition-colors">Discover</Link>
                </div>

                {/* Tier 2 (Highlighted) */}
                <div className="bg-moss text-stone rounded-[var(--radius-std)] p-10 flex flex-col items-center text-center shadow-xl relative transform md:-translate-y-4">
                    <div className="absolute -top-4 bg-clay px-4 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase text-white">Signature Journey</div>
                    <h3 className="font-serif text-3xl mb-4 text-white">The Vitality Retreat</h3>
                    <p className="font-sans text-sm text-stone/80 mb-8 max-w-[200px]">Subcellular optimization, energy system repair, and advanced holistic diagnostics.</p>
                    <Link to="/programs" className="magnetic-button bg-stone text-moss border-stone px-8 py-3 rounded-full font-sans uppercase tracking-widest text-[10px] font-bold mt-auto shadow-lg hover:bg-white transition-colors">Begin Your Journey</Link>
                </div>

                {/* Tier 3 */}
                <div className="border hover:border-moss/20 rounded-[var(--radius-std)] p-10 flex flex-col items-center text-center transition-colors">
                    <h3 className="font-serif text-2xl mb-4 text-moss">The Equilibrium</h3>
                    <p className="font-sans text-sm text-charcoal/60 mb-8 max-w-[200px]">Deep endocrine recalibration and natural cortisol modulation.</p>
                    <Link to="/programs" className="magnetic-button border border-charcoal/20 px-6 py-2 rounded-full font-sans uppercase tracking-widest text-[10px] font-bold mt-auto hover:bg-moss hover:text-white transition-colors">Discover</Link>
                </div>
            </section>

            {/* Main Footer Block */}
            <div className="bg-charcoal text-white rounded-t-[4rem] pt-32 pb-16 px-8 md:px-16 mt-16 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 font-sans">

                    <div className="md:col-span-2 flex flex-col justify-between">
                        <Link to="/" className="font-serif italic text-4xl mb-6 hover:opacity-80 transition-opacity">Serum & Sculpt</Link>
                        <p className="font-light text-white/80 text-sm max-w-sm mb-12 leading-relaxed">
                            A pharmacist-led clinical wellness authority empowering women through evidence-based care and holistic programs.
                        </p>
                        <div className="text-xs font-serif italic text-sage/80 mt-auto">
                            Pharmacist-Led Clinical Authority
                        </div>
                    </div>

                    <div>
                        <h4 className="font-mono text-xs text-sage tracking-widest uppercase mb-6">Explore</h4>
                        <ul className="flex flex-col gap-4 text-xs tracking-widest uppercase font-bold text-white/70">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Book Consultation</Link></li>
                            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Curated Skincare</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Our Pharmacist</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-xs text-sage tracking-widest uppercase mb-6">The Journal</h4>
                        <p className="text-xs text-white/70 mb-6 leading-relaxed">Insights on evidence-based wellness, skin health, and natural weight management.</p>
                        <div className="flex border-b border-white/20 pb-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 flex-grow"
                            />
                            <button className="text-clay text-[10px] tracking-widest uppercase font-mono font-bold hover:text-white transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto border-t border-white/10 mt-24 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light text-white/40 gap-4">
                    <span>&copy; {new Date().getFullYear()} Serum & Sculpt Wellness.</span>
                    <div className="flex gap-6">
                        <Link to="/contact" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/contact" className="hover:text-white">Terms of Experience</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}

