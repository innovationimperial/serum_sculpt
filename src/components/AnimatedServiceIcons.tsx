

export const ConsultationIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="clipboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8faf9" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="plantGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>

      <style>
        {`
          @keyframes bounceClipboard {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
          }
          @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(1.25); }
            30% { transform: scale(1); }
            45% { transform: scale(1.25); }
            60% { transform: scale(1); }
          }
          @keyframes plantGrow {
            0% { transform: scaleY(0.8) skewX(2deg); }
            50% { transform: scaleY(1.05) skewX(-2deg); }
            100% { transform: scaleY(0.8) skewX(2deg); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .anim-clipboard { 
            animation: bounceClipboard 4s ease-in-out infinite; 
            transform-origin: center;
          }
          .anim-heart {
            animation: heartBeat 2s infinite cubic-bezier(0.215, 0.610, 0.355, 1.000);
            transform-origin: center;
          }
          .anim-plant-left {
            animation: plantGrow 4s ease-in-out infinite alternate;
            transform-origin: bottom center;
          }
          .anim-plant-right {
            animation: plantGrow 4s ease-in-out infinite alternate-reverse;
            transform-origin: bottom center;
          }
          .anim-sparkle-1 { animation: twinkle 3s ease-in-out infinite 0.5s; }
          .anim-sparkle-2 { animation: twinkle 4s ease-in-out infinite 1.2s; }
          .anim-sparkle-3 { animation: twinkle 2.5s ease-in-out infinite 0.2s; }
        `}
      </style>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="100" cy="100" r="80" fill="#f0fdf4" opacity="0.6" />

    {/* Left Plant */}
    <g className="anim-plant-left" transform="translate(40, 140)">
      <path d="M0,0 Q-20,-30 -10,-60 Q5,-40 0,0" fill="url(#plantGrad)" />
      <path d="M0,-20 Q-25,-30 -30,-50 Q-10,-40 0,-20" fill="url(#plantGrad)" opacity="0.8" />
    </g>

    {/* Right Plant */}
    <g className="anim-plant-right" transform="translate(160, 140)">
      <path d="M0,0 Q20,-30 10,-60 Q-5,-40 0,0" fill="url(#plantGrad)" />
      <path d="M0,-20 Q25,-30 30,-50 Q10,-40 0,-20" fill="url(#plantGrad)" opacity="0.8" />
    </g>

    {/* Clipboard Group */}
    <g className="anim-clipboard">
      {/* Board */}
      <rect x="70" y="60" width="60" height="85" rx="8" fill="url(#clipboardGrad)" stroke="#475569" strokeWidth="4" />
      {/* Clip */}
      <path d="M85,50 L115,50 A5,5 0 0,1 120,55 L120,65 L80,65 L80,55 A5,5 0 0,1 85,50 Z" fill="#94a3b8" />
      <circle cx="100" cy="58" r="3" fill="#cbd5e1" />

      {/* Lines on clipboard */}
      <line x1="85" y1="85" x2="115" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <line x1="85" y1="100" x2="105" y2="100" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

      {/* Heart */}
      <g transform="translate(100, 120)" className="anim-heart">
        <path d="M0,-5 C-10,-15 -20,-5 -10,10 L0,20 L10,10 C20,-5 10,-15 0,-5 Z" fill="#f43f5e" />
      </g>

      {/* Happy face on clipboard */}
      <path d="M85,73 Q90,78 95,73" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="85" cy="73" r="1.5" fill="#475569" />
      <circle cx="95" cy="73" r="1.5" fill="#475569" />
    </g>

    {/* Sparkles */}
    <g fill="#10b981">
      <path className="anim-sparkle-1" d="M30,70 L34,80 L44,84 L34,88 L30,98 L26,88 L16,84 L26,80 Z" transform="scale(0.5) translate(30, 70)" />
      <path className="anim-sparkle-2" d="M160,50 L164,60 L174,64 L164,68 L160,78 L156,68 L146,64 L156,60 Z" transform="scale(0.6) translate(110, 30)" />
      <path className="anim-sparkle-3" d="M150,150 L152,156 L158,158 L152,160 L150,166 L148,160 L142,158 L148,156 Z" transform="scale(0.7) translate(60, 60)" />
    </g>
  </svg>
);

export const WellnessIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#86efac" />
      </linearGradient>

      <style>
        {`
          @keyframes glowPulse {
            0%, 100% { transform: scale(0.95); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes plantSquash {
            0%, 100% { transform: scaleY(0.95) scaleX(1.05); }
            50% { transform: scaleY(1.05) scaleX(0.95); }
          }
          @keyframes leafSwayLeft {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-8deg); }
          }
          @keyframes leafSwayRight {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(10deg); }
          }
          @keyframes floatUp1 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(-20px, -60px) scale(0); opacity: 0; }
          }
          @keyframes floatUp2 {
            0% { transform: translate(0, 0) scale(1.2); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(25px, -70px) scale(0); opacity: 0; }
          }
          @keyframes floatUp3 {
            0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translate(-10px, -50px) scale(0); opacity: 0; }
          }

          .anim-glow {
            animation: glowPulse 4s ease-in-out infinite;
            transform-origin: center;
          }
          .anim-plant {
            animation: plantSquash 3s ease-in-out infinite;
            transform-origin: bottom center;
          }
          .anim-sway-l {
            animation: leafSwayLeft 4s ease-in-out infinite;
            transform-origin: bottom right;
          }
          .anim-sway-r {
            animation: leafSwayRight 4s ease-in-out infinite 0.5s;
            transform-origin: bottom left;
          }
          .particle-1 { animation: floatUp1 3s linear infinite; }
          .particle-2 { animation: floatUp2 4s linear infinite 1s; }
          .particle-3 { animation: floatUp3 2.5s linear infinite 0.5s; }
        `}
      </style>
    </defs>

    {/* Glowing Energy Circle */}
    <circle cx="100" cy="100" r="65" fill="url(#energyGrad)" className="anim-glow" />

    {/* Particles */}
    <g fill="#4ade80">
      <circle cx="90" cy="130" r="4" className="particle-1" />
      <circle cx="120" cy="140" r="5" className="particle-2" />
      <circle cx="80" cy="110" r="3" className="particle-3" />
    </g>

    {/* Growing Plant */}
    <g transform="translate(100, 160)" className="anim-plant">
      {/* Stem */}
      <path d="M-3,0 Q0,-40 5,-80 Q0,-80 -2,0 Z" fill="#15803d" />

      {/* Bottom Leaves */}
      <g className="anim-sway-l" transform="translate(0, -20)">
        <path d="M0,0 Q-30,-10 -40,-30 Q-10,-40 0,-10 Z" fill="url(#leafGrad)" />
        <path d="M-10,-10 L-30,-25" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <g className="anim-sway-r" transform="translate(2, -35)">
        <path d="M0,0 Q30,-10 45,-25 Q15,-40 0,-10 Z" fill="url(#leafGrad)" />
        <path d="M10,-10 L35,-20" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Top Leaves */}
      <g className="anim-sway-l" transform="translate(3, -60)">
        <path d="M0,0 Q-20,0 -25,-20 Q-5,-25 0,0 Z" fill="url(#leafGrad)" />
      </g>

      <g className="anim-sway-r" transform="translate(4, -75)">
        <path d="M0,0 Q15,0 20,-15 Q5,-20 0,0 Z" fill="url(#leafGrad)" />
      </g>
    </g>
  </svg>
);

export const SupportIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="supportGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="flowerPetal" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#fb7185" />
      </linearGradient>
      <linearGradient id="flowerStem" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>

      <style>
        {`
          @keyframes breathePetals {
            0%, 100% { transform: scale(0.95); }
            50% { transform: scale(1.02); }
          }
          @keyframes swayStem {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(3deg); }
          }
          @keyframes swayLeavesL {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-5deg); }
          }
          @keyframes swayLeavesR {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
          }
          @keyframes floatSparkleFlower {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            50% { opacity: 1; transform: scale(1); }
            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
          }
          
          .anim-petals { animation: breathePetals 4s ease-in-out infinite; transform-origin: center 0px; }
          .anim-stem-group { animation: swayStem 5s ease-in-out infinite; transform-origin: center bottom; }
          .anim-leaf-l { animation: swayLeavesL 4s ease-in-out infinite; transform-origin: bottom right; }
          .anim-leaf-r { animation: swayLeavesR 4s ease-in-out infinite 0.5s; transform-origin: bottom left; }
          
          .sparkle-f1 { animation: floatSparkleFlower 6s ease-out infinite; --tx: -20px; --ty: -30px; }
          .sparkle-f2 { animation: floatSparkleFlower 5s ease-out infinite 1.5s; --tx: 25px; --ty: -20px; }
          .sparkle-f3 { animation: floatSparkleFlower 7s ease-out infinite 3s; --tx: -10px; --ty: -45px; }
        `}
      </style>
    </defs>

    {/* Background Consistent Glow Ring */}
    <circle cx="100" cy="100" r="70" fill="none" stroke="#f0fdf4" strokeWidth="15" />
    <circle cx="100" cy="100" r="60" fill="url(#supportGlow)" />

    {/* Ground / Soil patch */}
    <ellipse cx="100" cy="165" rx="35" ry="8" fill="#78350f" opacity="0.3" />

    <g transform="translate(100, 160) scale(0.8)">
      <g className="anim-stem-group">

        {/* Stem */}
        <path d="M0,0 Q5,-30 0,-60" fill="none" stroke="url(#flowerStem)" strokeWidth="6" strokeLinecap="round" />

        {/* Leaves */}
        <g className="anim-leaf-l" transform="translate(0, -20)">
          <path d="M0,0 Q-25,5 -30,-15 Q-10,-20 0,0 Z" fill="#4ade80" />
          <path d="M-5,-2 L-20,-10" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <g className="anim-leaf-r" transform="translate(1, -35)">
          <path d="M0,0 Q25,5 30,-15 Q10,-20 0,0 Z" fill="#4ade80" />
          <path d="M5,-2 L20,-10" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Intact Flower Head */}
        <g className="anim-petals" transform="translate(0, -60)">

          {/* Back Petals */}
          <ellipse cx="-15" cy="-15" rx="12" ry="24" fill="#e11d48" transform="rotate(-45)" />
          <ellipse cx="15" cy="-15" rx="12" ry="24" fill="#e11d48" transform="rotate(45)" />

          {/* Front Petals */}
          <g transform="translate(-8, 5) rotate(-20)">
            <path d="M0,0 C-15,-5 -25,-25 -20,-40 C-10,-45 10,-25 0,0 Z" fill="url(#flowerPetal)" />
          </g>

          <g transform="translate(8, 5) rotate(20)">
            <path d="M0,0 C15,-5 25,-25 20,-40 C10,-45 -10,-25 0,0 Z" fill="url(#flowerPetal)" />
          </g>

          <g transform="translate(0, 8)">
            <path d="M0,0 C-15,-10 -20,-40 0,-45 C20,-40 15,-10 0,0 Z" fill="#fca5a5" />
            {/* Inner petal detail */}
            <path d="M0,-5 L0,-35" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Center of the flower */}
          <circle cx="0" cy="0" r="10" fill="#fef08a" />
          <circle cx="0" cy="0" r="5" fill="#ca8a04" />

          {/* Magic Particles */}
          <g fill="#fca5a5">
            <circle cx="0" cy="-20" r="3" className="sparkle-f1" />
            <circle cx="0" cy="-15" r="4" className="sparkle-f2" />
            <circle cx="0" cy="-25" r="2.5" className="sparkle-f3" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
