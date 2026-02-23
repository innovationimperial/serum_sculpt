Role: Act as a World-Class Senior Creative Technologist, UX Designer, and Lead Frontend Engineer.
Objective: Architect a high-fidelity, cinematic "1:1 Pixel Perfect" landing page for Serum & Sculpt (Wellness Rediscovery).
Aesthetic Identity: "High-End Organic Tech" / "Clinical Boutique." The platform must bridge biological research lab precision with avant-garde luxury wellness, establishing a moody, tech-forward wellness authority for a pharmacist-led platform.

1. CORE DESIGN SYSTEM (STRICT)
Palette:
- Primary: Moss (#2E4036), Sage Green (#C8D6B9), Charcoal (#1A1A1A) for dark/moody sections.
- Accent: Clay (#CC5833), Minimal muted gold.
- Background: Warm White (#FFFFFF) for clinical clarity transitioning into dark/moody Charcoal/Moss for wellness depth.
- AVOID: Pink heavy tones, generic beauty influencer aesthetics.

Typography:
- Headings: Elegant Serif font for professional clinical authority (e.g., Cormorant Garamond - use Italic for biological/organic concepts).
- Body text: Clean, highly legible Sans-Serif (e.g., Plus Jakarta Sans, Outfit).
- Data: A clean Monospace font for clinical telemetry and dashboard interactions.

Visual Texture & Layout:
- Implement a global CSS Noise overlay (SVG turbulence at 0.05 opacity) to add organic, biological texture.
- Use a rounded-[2rem] to rounded-[3rem] radius system for all containers.
- The interface should feel like a premium clinical consultation environment—spacious but highly interactive and cyber-dashboard-like.

2. COMPONENT ARCHITECTURE & BEHAVIOR
A. NAVBAR (The Floating Island)
A fixed, pill-shaped container.
Morphing Logic: Transparent with white text at the hero top. Transitions into a white/60 glassmorphic blur with moss/charcoal text and a subtle border upon scrolling.
Links: Consultation Services, Wellness Programs, Curated Clinical Skincare, Philosophy.
Primary CTA: "Book Consultation" (prominent, magnetic feel).

B. HERO SECTION (Clinical Authority Meets Organic Tech)
Visuals: 100dvh height. Background image of a moody, deep aesthetic (e.g., macro biological textures, dark organic wellness motifs) with a heavy Moss-to-Black gradient overlay.
Layout: Content pushed to the bottom-left third to maintain a cinematic feel.
Typography: Large scale contrast establishing Pharmacist-Led Clinical Authority. (e.g., "Nature is the" in Bold Sans vs. "Algorithm." in Massive Serif Italic).
Animation: GSAP staggered fade-up for all text parts.
Primary CTA: "Book Consultation"

C. SERVICES & WELLNESS PROGRAMS (The Precision Micro-UI Dashboard)
Replace standard service cards with Interactive Functional Artifacts that promote tech-wellness authority.
Card 1 (Clinical Diagnostic Shuffler): 3 overlapping cards detailing Consultation, Weight Wellness, and Hormonal Support that cycle vertically using unshift(pop()) logic.
Card 2 (Wellness Telemetry Typewriter): A live text feed cycling through clinical evidence, pharmacist insights, and program outcomes with a blinking clay cursor.
Card 3 (Adaptive Regimen/Support Plan): A "Mock Cursor Protocol Scheduler" showing how personalized wellness programs are tracked on a weekly grid.

D. PHILOSOPHY (The Manifesto)
A high-contrast Charcoal section with a parallaxing organic texture establishing the "clarity over trends" and evidence-based approach.
Text Layout: Huge typography comparison using split-text GSAP reveals (e.g., "Standard beauty masks symptoms." vs. "Clinical wellness optimizes the system.").

E. CURATED CLINICAL SKINCARE (Sticky Stacking Archive)
Positioned as a highly curated recommendation section, not a standard shop.
Vertical stack of full-screen product highlight cards.
Stacking Interaction: Using GSAP ScrollTrigger, as a new card scrolls into view, the card underneath scales down, blurs, and fades.
Artifacts: Each curated product features a unique technical animation (e.g., a rotating double-helix gear for anti-aging serums, a pulsing EKG waveform for wellness supplements) alongside educational usage guidance.

F. MEMBERSHIP & FOOTER
Highlight flagship programs (e.g., Performance, Balance) in a premium tier grid. The central program should "pop" with a Moss background and Clay button.
Footer: Deep Charcoal, rounded-t-[4rem]. Include high-end utility links, a newsletter signup (education hub), and a "System Operational" status indicator with a pulsing green dot.

3. TECHNICAL REQUIREMENTS
Tech Stack: React 19, Tailwind CSS, GSAP 3 (with ScrollTrigger), Lucide React.
Animation Lifecycle: Use gsap.context() within useEffect for all animations to ensure clean mounting/unmounting.
Micro-Interactions: Buttons must have a "magnetic" feel (subtle scale-up on hover) and utilize overflow-hidden with a sliding background layer for color transitions.
Code Quality: No placeholders. Use real image URLs from Unsplash. Ensure the dashboard cards feel like highly functional clinical software, establishing the pharmacist's tech-wellness authority.
Execution Directive: "Do not build a generic cosmetic webshop; build a clinical wellness authority instrument. Every scroll should educate the user, build trust, and feel intentionally cinematic. The primary goal is capturing consultation bookings through a premium, cyber-dashboard, tech-forward experience."
