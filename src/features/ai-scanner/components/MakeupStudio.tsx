import { useState } from 'react';
import { ArrowLeft, Download, RotateCcw, Wand2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface MakeupStudioProps {
    originalPhoto: File;
    onBack: () => void;
}

interface MakeupShade {
    name: string;
    color: string;
    category: string;
}

const makeupShades: Record<string, MakeupShade[]> = {
    lipstick: [
        { name: 'Bare', color: '#C8A882', category: 'nudes' },
        { name: 'Beige', color: '#D4B896', category: 'nudes' },
        { name: 'Taupe', color: '#A0866B', category: 'nudes' },
        { name: 'Camel', color: '#B5956B', category: 'nudes' },
        { name: 'Mocha', color: '#8B6F47', category: 'nudes' },
        { name: 'Baby Pink', color: '#F8C8DC', category: 'pinks' },
        { name: 'Rose', color: '#E91E63', category: 'pinks' },
        { name: 'Fuchsia', color: '#FF1493', category: 'pinks' },
        { name: 'Hot Pink', color: '#FF69B4', category: 'pinks' },
        { name: 'Magenta', color: '#DA1C5A', category: 'pinks' },
        { name: 'Cherry', color: '#D2001C', category: 'reds' },
        { name: 'Crimson', color: '#DC143C', category: 'reds' },
        { name: 'Ruby', color: '#9B111E', category: 'reds' },
        { name: 'Burgundy', color: '#800020', category: 'reds' },
        { name: 'Wine', color: '#722F37', category: 'reds' },
        { name: 'Lavender', color: '#B19CD9', category: 'purples' },
        { name: 'Plum', color: '#673147', category: 'purples' },
        { name: 'Violet', color: '#8A2BE2', category: 'purples' },
        { name: 'Deep Purple', color: '#4B0082', category: 'purples' },
    ],
    eyeshadow: [
        { name: 'Champagne', color: '#F7E7CE', category: 'neutrals' },
        { name: 'Bronze', color: '#CD7F32', category: 'neutrals' },
        { name: 'Gold', color: '#FFD700', category: 'neutrals' },
        { name: 'Copper', color: '#B87333', category: 'neutrals' },
        { name: 'Brown', color: '#8B4513', category: 'neutrals' },
        { name: 'Charcoal', color: '#36454F', category: 'smokey' },
        { name: 'Graphite', color: '#41424C', category: 'smokey' },
        { name: 'Silver', color: '#C0C0C0', category: 'smokey' },
        { name: 'Black', color: '#1C1C1C', category: 'smokey' },
        { name: 'Blue', color: '#0066CC', category: 'colorful' },
        { name: 'Green', color: '#228B22', category: 'colorful' },
        { name: 'Purple', color: '#800080', category: 'colorful' },
        { name: 'Pink', color: '#FF69B4', category: 'colorful' },
        { name: 'Orange', color: '#FF8C00', category: 'colorful' },
    ],
    blush: [
        { name: 'Soft Pink', color: '#FFB6C1', category: 'pinks' },
        { name: 'Rose', color: '#E91E63', category: 'pinks' },
        { name: 'Dusty Pink', color: '#D19AB1', category: 'pinks' },
        { name: 'Bright Pink', color: '#FF1493', category: 'pinks' },
        { name: 'Apricot', color: '#FBCEB1', category: 'peaches' },
        { name: 'Peach', color: '#FFCBA4', category: 'peaches' },
        { name: 'Coral Peach', color: '#FF7F50', category: 'peaches' },
        { name: 'Berry', color: '#8E4585', category: 'berries' },
        { name: 'Plum', color: '#673147', category: 'berries' },
        { name: 'Wine', color: '#722F37', category: 'berries' },
    ],
};

const CATEGORIES = Object.keys(makeupShades);

export default function MakeupStudio({ originalPhoto, onBack }: MakeupStudioProps) {
    const [selectedCategory, setSelectedCategory] = useState('lipstick');
    const [selectedShades, setSelectedShades] = useState<Record<string, string>>({});
    const [intensity, setIntensity] = useState<Record<string, number>>({
        lipstick: 70,
        eyeshadow: 50,
        blush: 40,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleShadeSelect = (category: string, shade: MakeupShade) => {
        setSelectedShades((prev) => ({ ...prev, [category]: shade.name }));
    };

    const handleApplyMakeup = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error('VITE_GEMINI_API_KEY is not set. Please add it to your .env file and restart the dev server.');
            }

            const imageBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
                reader.readAsDataURL(originalPhoto);
            });

            const makeupPrompt = Object.entries(selectedShades)
                .map(([category, shade]) => `${intensity[category]}% intensity ${shade.toLowerCase()} ${category}`)
                .join(', ');

            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash-image',
                config: { responseModalities: ['IMAGE', 'TEXT'] },
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { inlineData: { data: imageBase64, mimeType: originalPhoto.type } },
                            {
                                text: `Apply makeup to this face: ${makeupPrompt}. Make the makeup look natural and professionally applied. Keep the lighting and background exactly the same.`,
                            },
                        ],
                    },
                ],
            });

            let foundImage = false;
            for await (const chunk of response) {
                if (!chunk.candidates?.[0]?.content?.parts) continue;
                for (const part of chunk.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setProcessedImage(`data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data || ''}`);
                        foundImage = true;
                        break;
                    }
                }
                if (foundImage) break;
            }

            if (!foundImage) {
                setError('The AI model did not return an image. Please try again with a different photo or shade selection.');
            }
        } catch (err) {
            console.error('Failed to apply makeup:', err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`Failed to process: ${message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'serum-sculpt-makeup-preview.jpg';
        link.click();
    };

    const groupedShades = (category: string) => {
        const shades = makeupShades[category] || [];
        return shades.reduce(
            (acc, shade) => {
                if (!acc[shade.category]) acc[shade.category] = [];
                acc[shade.category].push(shade);
                return acc;
            },
            {} as Record<string, MakeupShade[]>,
        );
    };

    const originalImageUrl = URL.createObjectURL(originalPhoto);

    return (
        <section className="min-h-screen bg-gradient-to-br from-sage/20 via-white to-stone px-4 py-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-moss text-sm font-sans font-bold uppercase tracking-widest hover:text-charcoal transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedShades({})}
                            className="magnetic-button inline-flex items-center gap-2 border-2 border-moss/20 text-moss px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest hover:border-moss transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset All
                        </button>

                        <button
                            onClick={handleApplyMakeup}
                            disabled={isProcessing || Object.keys(selectedShades).length === 0}
                            className="magnetic-button inline-flex items-center gap-2 bg-moss text-white px-6 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest hover:bg-charcoal transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Wand2 className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                            {isProcessing ? 'Applying...' : 'Apply Makeup'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* ─── Image Comparison ─── */}
                    <div className="space-y-6">
                        <h2 className="font-serif italic text-3xl text-charcoal">Your Look</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Original */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-sage/40">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-charcoal/50 mb-3 text-center">
                                    Original
                                </h3>
                                <div className="aspect-square rounded-xl overflow-hidden">
                                    <img src={originalImageUrl} alt="Original" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-sage/40">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-charcoal/50 mb-3 text-center">
                                    Preview
                                </h3>
                                <div className="aspect-square rounded-xl overflow-hidden bg-sage/10 flex items-center justify-center">
                                    {isProcessing ? (
                                        <div className="text-center space-y-2">
                                            <Wand2 className="w-8 h-8 animate-spin text-moss mx-auto" />
                                            <p className="text-xs text-charcoal/50 font-sans">Processing...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center space-y-2 px-4">
                                            <p className="text-xs text-red-600 font-sans font-bold">⚠ Error</p>
                                            <p className="text-xs text-charcoal/50 font-sans">{error}</p>
                                        </div>
                                    ) : processedImage ? (
                                        <img src={processedImage} alt="Preview with makeup" className="w-full h-full object-cover" />
                                    ) : (
                                        <p className="text-xs text-charcoal/40 font-sans text-center px-4">
                                            Select shades and apply makeup to see preview
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {processedImage && (
                            <button
                                onClick={handleDownload}
                                className="magnetic-button w-full inline-flex items-center justify-center gap-2 bg-clay text-white px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:bg-clay/80 transition-colors cursor-pointer"
                            >
                                <Download className="w-4 h-4" />
                                Download Result
                            </button>
                        )}
                    </div>

                    {/* ─── Makeup Controls ─── */}
                    <div className="space-y-6">
                        <h2 className="font-serif italic text-3xl text-charcoal">Choose Your Shades</h2>

                        {/* Tab Switcher */}
                        <div className="flex bg-sage/40 rounded-full p-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex-1 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all cursor-pointer ${selectedCategory === cat
                                        ? 'bg-moss text-white shadow-sm'
                                        : 'text-charcoal/60 hover:text-charcoal'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Shade Panel */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-sage/40 space-y-6">
                            {/* Intensity Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-xs font-sans font-bold uppercase tracking-widest text-charcoal/60">
                                        Intensity
                                    </label>
                                    <span className="text-xs font-sans font-bold text-moss">{intensity[selectedCategory]}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={10}
                                    value={intensity[selectedCategory]}
                                    onChange={(e) =>
                                        setIntensity((prev) => ({ ...prev, [selectedCategory]: Number(e.target.value) }))
                                    }
                                    className="w-full h-2 bg-sage rounded-full appearance-none cursor-pointer accent-moss"
                                />
                            </div>

                            {/* Shade Groups */}
                            {Object.entries(groupedShades(selectedCategory)).map(([groupName, shades]) => (
                                <div key={groupName}>
                                    <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-charcoal/50 mb-3 capitalize">
                                        {groupName}
                                    </h4>
                                    <div className="grid grid-cols-5 gap-3">
                                        {shades.map((shade) => (
                                            <button
                                                key={shade.name}
                                                onClick={() => handleShadeSelect(selectedCategory, shade)}
                                                className={`group relative aspect-square rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer ${selectedShades[selectedCategory] === shade.name
                                                    ? 'ring-2 ring-moss ring-offset-2'
                                                    : ''
                                                    }`}
                                                style={{ backgroundColor: shade.color }}
                                                title={shade.name}
                                            >
                                                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 rounded-xl transition-all duration-200" />
                                                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <div className="bg-charcoal text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-sans">
                                                        {shade.name}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected Shades Summary */}
                        {Object.keys(selectedShades).length > 0 && (
                            <div className="bg-sage/30 rounded-2xl p-4 border border-sage/40">
                                <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-moss mb-3">
                                    Selected Shades
                                </h4>
                                <div className="space-y-2">
                                    {Object.entries(selectedShades).map(([category, shade]) => (
                                        <div key={category} className="flex justify-between text-sm font-sans">
                                            <span className="capitalize font-bold text-charcoal">{category}:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-charcoal/60">{shade}</span>
                                                <span className="text-xs text-moss font-bold">({intensity[category]}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
