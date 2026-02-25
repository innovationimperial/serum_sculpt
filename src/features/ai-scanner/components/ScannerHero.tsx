import { Camera, Upload, Sparkles } from 'lucide-react';

interface ScannerHeroProps {
    onUploadClick: () => void;
    onCameraClick: () => void;
}

export default function ScannerHero({ onUploadClick, onCameraClick }: ScannerHeroProps) {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-24 overflow-hidden">
            {/* Soft background wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-white to-stone" />
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-moss/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-clay/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm rounded-full border border-sage">
                    <Sparkles className="w-4 h-4 text-clay" />
                    <span className="text-xs font-sans font-bold tracking-[0.15em] uppercase text-moss">AI-Powered Analysis</span>
                </div>

                {/* Heading */}
                <div className="space-y-4">
                    <h1 className="font-serif italic text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.1]">
                        AI Skin <span className="text-moss">Analysis</span>
                    </h1>
                    <p className="text-lg md:text-xl text-charcoal/60 font-sans max-w-xl mx-auto leading-relaxed">
                        Upload your photo and virtually try on curated makeup shades — powered by AI for a personalised preview.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onUploadClick}
                        className="magnetic-button inline-flex items-center justify-center gap-3 bg-moss text-white px-8 py-4 rounded-full text-sm font-sans font-bold tracking-[0.15em] uppercase hover:bg-charcoal transition-colors cursor-pointer"
                    >
                        <Upload className="w-5 h-5" />
                        Upload Photo
                    </button>

                    <button
                        onClick={onCameraClick}
                        className="magnetic-button inline-flex items-center justify-center gap-3 bg-white text-moss border-2 border-moss/20 px-8 py-4 rounded-full text-sm font-sans font-bold tracking-[0.15em] uppercase hover:border-moss hover:bg-sage/20 transition-colors cursor-pointer"
                    >
                        <Camera className="w-5 h-5" />
                        Take Photo
                    </button>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                    {['Virtual Try-On', 'AI-Powered', 'Instant Preview'].map((label) => (
                        <div
                            key={label}
                            className="px-4 py-2 bg-sage/40 rounded-full text-xs font-sans font-bold tracking-[0.1em] uppercase text-moss/80"
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
