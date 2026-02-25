import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Mail, MessageCircle, MapPin, ChevronRight, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useRequireAuth } from '../hooks/useRequireAuth';

const CONTACT_CHANNELS = [
    {
        icon: Mail,
        label: 'Email Inquiries',
        value: 'pmgwatidzo@gmail.com',
        desc: 'For detailed clinical questions and administrative support.'
    },
    {
        icon: MessageCircle,
        label: 'WhatsApp Support',
        value: '+27 66 397 3818',
        desc: 'Direct communication for urgent wellness queries (ZAR Only).'
    },
    {
        icon: MapPin,
        label: 'Clinical Location',
        value: 'Ballito Hills Estate, Ballito',
        desc: 'In-person assessments available by scheduled appointment.'
    }
];

const FAQS = [
    {
        q: "How do clinical consultations work?",
        a: "Our consultations are deep-dive clinical assessments. We analyze your medical history, current physiological markers, and lifestyle factors to engineer a bespoke wellness architecture."
    },
    {
        q: "Do you offer international consultations?",
        a: "Yes, we support international clients via secure virtual platforms. Please note that clinical recommendations are subject to regional pharmaceutical regulations."
    },
    {
        q: "What brands are involved in the curated shop?",
        a: "We partner with evidence-based brands like House of Langa and Amway, alongside our own clinical formulations. Every product undergoes strict clinical vetting before being curated."
    }
];

export default function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { requireAuth } = useRequireAuth();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-reveal',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            <PageHeader
                id="CON-006"
                title="Clinical Portal."
                subtitle="Connect with Serum & Sculpt"
                description="Secure your consultation or reach out with specific wellness inquiries through our direct portal."
            />

            <div className="pb-24 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-24 mb-32">
                    <div className="space-y-12 contact-reveal">
                        {CONTACT_CHANNELS.map((ch, i) => (
                            <div key={i} className="flex gap-8 group">
                                <div className="w-16 h-16 bg-moss/5 rounded-2xl flex items-center justify-center text-moss group-hover:bg-moss group-hover:text-white transition-all cursor-default">
                                    <ch.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="font-mono text-[10px] tracking-widest uppercase text-clay font-bold mb-1">{ch.label}</h4>
                                    <p className="font-serif text-2xl text-charcoal mb-2 italic">{ch.value}</p>
                                    <p className="text-charcoal/60 text-xs leading-relaxed max-w-sm">{ch.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-stone/5 p-6 md:p-12 rounded-[3.5rem] border border-stone/10 contact-reveal">
                        <h2 className="font-serif text-3xl text-moss mb-8 italic">Administrative Inquiry</h2>
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); requireAuth(() => { /* Add submit logic later */ }); }}>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-white rounded-2xl border border-stone/20 focus:outline-none focus:border-moss transition-colors text-sm" />
                                <input type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-white rounded-2xl border border-stone/20 focus:outline-none focus:border-moss transition-colors text-sm" />
                            </div>
                            <select className="w-full px-6 py-4 bg-white rounded-2xl border border-stone/20 focus:outline-none focus:border-moss transition-colors text-sm text-charcoal/60 appearance-none">
                                <option>Purpose of Inquiry</option>
                                <option>Clinical Consultation</option>
                                <option>Program Application</option>
                                <option>Product Guidance</option>
                                <option>General Support</option>
                            </select>
                            <textarea rows={4} placeholder="How can we support your wellness today?" className="w-full px-6 py-4 bg-white rounded-2xl border border-stone/20 focus:outline-none focus:border-moss transition-colors text-sm"></textarea>
                            <button className="w-full bg-moss text-white py-4 rounded-2xl font-mono text-[10px] tracking-widest uppercase font-bold flex items-center justify-center gap-4 hover:bg-charcoal transition-colors">
                                Submit Inquiry <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div >

                <div className="grid md:grid-cols-2 gap-24 items-start contact-reveal">
                    <div>
                        <h2 className="font-serif text-4xl text-moss mb-8 italic">Common Disclosures</h2>
                        <div className="space-y-6">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="group cursor-help">
                                    <h4 className="flex items-center gap-4 font-serif text-lg text-charcoal mb-3 italic group-hover:text-moss transition-colors">
                                        <ChevronRight size={16} className="text-clay" />
                                        {faq.q}
                                    </h4>
                                    <p className="text-charcoal/60 text-sm leading-relaxed pl-8 border-l border-stone/20 ml-2">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-moss rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-stone/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <h2 className="font-serif text-3xl mb-4 italic">Direct Consultation.</h2>
                        <p className="text-stone/60 font-light mb-8 leading-relaxed">
                            For immediate clinical assessment scheduling, please use our simplified WhatsApp booking system.
                        </p>
                        <button onClick={() => requireAuth(() => { /* Add whatsapp redirect logic */ })} className="bg-white text-moss px-10 py-5 rounded-full font-mono text-[10px] tracking-widest uppercase font-bold hover:bg-stone transition-colors relative z-10">
                            WhatsApp Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
