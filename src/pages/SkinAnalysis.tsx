import { useState } from 'react';
import ScannerHero from '../features/ai-scanner/components/ScannerHero';
import PhotoUpload from '../features/ai-scanner/components/PhotoUpload';
import MakeupStudio from '../features/ai-scanner/components/MakeupStudio';

type ScannerState = 'home' | 'upload' | 'studio';

export default function SkinAnalysis() {
    const [currentState, setCurrentState] = useState<ScannerState>('home');
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

    const handlePhotoSelected = (file: File) => {
        setSelectedPhoto(file);
        setCurrentState('studio');
    };

    if (currentState === 'studio' && selectedPhoto) {
        return <MakeupStudio originalPhoto={selectedPhoto} onBack={() => setCurrentState('upload')} />;
    }

    if (currentState === 'upload') {
        return (
            <PhotoUpload
                onPhotoSelected={handlePhotoSelected}
                onBack={() => {
                    setCurrentState('home');
                    setSelectedPhoto(null);
                }}
            />
        );
    }

    return (
        <ScannerHero
            onUploadClick={() => setCurrentState('upload')}
            onCameraClick={() => setCurrentState('upload')}
        />
    );
}
