import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    id?: string;
    className?: string;
}

export default function PageHeader({ title, subtitle, description, id, className = "" }: PageHeaderProps) {
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-reveal',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, headerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={headerRef} className={`relative pt-40 pb-24 overflow-hidden ${className}`}>
            {/* Background Motif */}
            <div className="absolute inset-0 -z-10 bg-stone/30 opacity-40" />
            <div className="absolute top-0 right-0 w-1/3 h-full -z-10 bg-moss/5 rounded-bl-[10rem]" />

            <div className="px-8 md:px-16 max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        {id && (
                            <p className="header-reveal font-mono text-[10px] tracking-[0.3em] uppercase text-clay font-bold mb-4">
                                Ref: {id}
                            </p>
                        )}
                        {subtitle && (
                            <p className="header-reveal font-mono tracking-widest text-moss/60 uppercase text-xs mb-4 font-bold">
                                {subtitle}
                            </p>
                        )}
                        <h1 className="header-reveal font-serif text-5xl md:text-8xl text-moss italic leading-[1.1]">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <div className="header-reveal max-w-sm md:mb-4">
                            <p className="text-charcoal/60 font-light leading-relaxed border-l border-moss/20 pl-6 py-2">
                                {description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
