import Hero from '../components/Hero';
import Credibility from '../components/Credibility';
import Services from '../components/Services';
import Philosophy from '../components/Philosophy';
import { StoreSection } from '../features/store/components/StoreSection';

export default function Home() {
    return (
        <>
            <Hero />
            <Credibility />
            <Services />
            <Philosophy />
            <StoreSection />
        </>
    );
}

