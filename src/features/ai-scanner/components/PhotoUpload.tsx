import { useState, useRef } from 'react';
import { Upload, Camera, X, RotateCcw, Check } from 'lucide-react';

interface PhotoUploadProps {
    onPhotoSelected: (file: File) => void;
    onBack: () => void;
}

export default function PhotoUpload({ onPhotoSelected, onBack }: PhotoUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files?.[0]) handleFile(files[0]);
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const startCamera = async () => {
        setCameraLoading(true);
        setCameraActive(true);
        setTimeout(async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => setCameraLoading(false);
                    if (videoRef.current.readyState >= 1) setCameraLoading(false);
                    videoRef.current.play().catch(console.error);
                } else {
                    setCameraLoading(false);
                    setCameraActive(false);
                }
            } catch {
                setCameraLoading(false);
                setCameraActive(false);
                alert('Camera access denied or not available.');
            }
        }, 100);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    handleFile(new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' }));
                    stopCamera();
                }
            }, 'image/jpeg', 0.9);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setCameraLoading(false);
    };

    const confirmPhoto = () => {
        if (!preview) return;
        fetch(preview)
            .then((res) => res.blob())
            .then((blob) => onPhotoSelected(new File([blob], 'uploaded-photo.jpg', { type: 'image/jpeg' })))
            .catch(console.error);
    };

    /* ─── Preview state ─── */
    if (preview) {
        return (
            <section className="min-h-screen flex items-center justify-center px-4 py-24">
                <div className="max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-[var(--radius-std)] p-8 space-y-6 border border-sage/40">
                    <div className="text-center">
                        <h2 className="font-serif italic text-3xl text-charcoal mb-2">Photo Preview</h2>
                        <p className="text-charcoal/50 font-sans text-sm">Check your photo before proceeding to the makeup studio</p>
                    </div>

                    <div className="rounded-2xl overflow-hidden">
                        <img src={preview} alt="Preview" className="w-full h-96 object-cover" />
                    </div>

                    {/* Tips */}
                    <div className="bg-sage/30 border border-sage rounded-xl p-4">
                        <h3 className="font-sans font-bold text-sm text-moss mb-2">Photo Guidelines</h3>
                        <ul className="text-xs text-charcoal/60 font-sans space-y-1">
                            <li>• Clear, uncluttered background</li>
                            <li>• Good lighting on your face</li>
                            <li>• Face clearly visible and centred</li>
                            <li>• Minimal shadows on face</li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setPreview(null)}
                            className="magnetic-button flex-1 inline-flex items-center justify-center gap-2 border-2 border-moss/20 text-moss px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:border-moss transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Retake
                        </button>
                        <button
                            onClick={confirmPhoto}
                            className="magnetic-button flex-1 inline-flex items-center justify-center gap-2 bg-moss text-white px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:bg-charcoal transition-colors cursor-pointer"
                        >
                            <Check className="w-4 h-4" />
                            Start Editing
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    /* ─── Camera state ─── */
    if (cameraActive) {
        return (
            <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-charcoal">
                <div className="relative max-w-2xl w-full">
                    {/* Guidelines overlay */}
                    <div className="absolute top-4 left-4 right-4 z-10">
                        <div className="bg-charcoal/80 backdrop-blur-sm rounded-xl p-4 text-white">
                            <h3 className="font-sans font-bold text-sm mb-2">Camera Guidelines</h3>
                            <ul className="text-xs opacity-80 space-y-1">
                                <li>• Position your face in the centre</li>
                                <li>• Ensure good lighting on your face</li>
                                <li>• Use a clean, simple background</li>
                                <li>• Keep the camera steady</li>
                            </ul>
                        </div>
                    </div>

                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl" />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                        <button
                            onClick={stopCamera}
                            className="inline-flex items-center gap-2 bg-charcoal/60 hover:bg-charcoal/80 text-white px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            onClick={capturePhoto}
                            className="inline-flex items-center gap-2 bg-moss text-white px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:bg-charcoal transition-colors cursor-pointer"
                        >
                            <Camera className="w-4 h-4" />
                            Capture
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    /* ─── Default: upload UI ─── */
    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-24">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <button
                        onClick={onBack}
                        className="text-moss text-sm font-sans font-bold uppercase tracking-widest hover:text-charcoal transition-colors cursor-pointer"
                    >
                        ← Back
                    </button>
                    <h2 className="font-serif italic text-4xl text-charcoal">Upload Your Photo</h2>
                    <p className="text-charcoal/50 font-sans">Choose a clear, well-lit photo of your face for the best results</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-[var(--radius-std)] p-8 border border-sage/40">
                    <input
                        id="photo-upload-input"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleFile(e.target.files[0]);
                            e.target.value = '';
                        }}
                        className="sr-only"
                    />
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive ? 'border-moss bg-sage/20' : 'border-sage hover:border-moss/50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >

                        <div className="space-y-6">
                            <div className="w-16 h-16 mx-auto bg-moss rounded-2xl flex items-center justify-center">
                                <Upload className="w-8 h-8 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-serif italic text-xl text-charcoal">
                                    {dragActive ? 'Drop your photo here' : 'Drag & drop your photo'}
                                </h3>
                                <p className="text-charcoal/50 text-sm font-sans">JPG, PNG, or WEBP up to 10MB</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <label
                                    htmlFor="photo-upload-input"
                                    className={`magnetic-button inline-flex items-center justify-center gap-2 bg-moss text-white px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:bg-charcoal transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploading ? 'Processing...' : 'Choose File'}
                                </label>

                                <button
                                    onClick={startCamera}
                                    disabled={cameraLoading}
                                    className="magnetic-button inline-flex items-center justify-center gap-2 border-2 border-moss/20 text-moss px-6 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:border-moss hover:bg-sage/20 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <Camera className="w-4 h-4" />
                                    {cameraLoading ? 'Starting Camera...' : 'Use Camera'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hints row */}
                <div className="grid grid-cols-3 gap-4 text-center text-xs text-charcoal/50 font-sans font-bold uppercase tracking-widest">
                    <div className="space-y-2">
                        <div className="w-8 h-8 bg-clay/30 rounded-lg mx-auto" />
                        <p>Clear lighting</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-8 h-8 bg-sage rounded-lg mx-auto" />
                        <p>Face visible</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-8 h-8 bg-moss/30 rounded-lg mx-auto" />
                        <p>High quality</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
