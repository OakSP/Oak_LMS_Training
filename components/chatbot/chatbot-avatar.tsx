export function ChatbotAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Hair back */}
      <ellipse cx="50" cy="44" rx="34" ry="37" fill="#2C1A0E" />
      {/* Face */}
      <ellipse cx="50" cy="59" rx="27" ry="29" fill="#FDDBB4" />
      {/* Hair top */}
      <path d="M16 44 Q19 12 50 11 Q81 12 84 44 Q81 22 69 17 Q60 13 50 13 Q40 13 31 17 Q19 22 16 44Z" fill="#2C1A0E" />
      {/* Fringe */}
      <path d="M27 38 Q32 23 50 21 Q68 23 73 38 Q67 30 50 29 Q33 30 27 38Z" fill="#2C1A0E" />
      {/* Hair tails */}
      <path d="M23 57 Q17 76 23 88 Q20 71 27 61Z" fill="#2C1A0E" />
      <path d="M77 57 Q83 76 77 88 Q80 71 73 61Z" fill="#2C1A0E" />
      {/* Ear */}
      <ellipse cx="23" cy="60" rx="5" ry="6.5" fill="#F5C99A" />
      <ellipse cx="77" cy="60" rx="5" ry="6.5" fill="#F5C99A" />
      {/* Eyes white */}
      <ellipse cx="37" cy="56" rx="7.5" ry="8" fill="white" />
      <ellipse cx="63" cy="56" rx="7.5" ry="8" fill="white" />
      {/* Iris */}
      <ellipse cx="37" cy="57" rx="5.5" ry="6" fill="#5C3D1E" />
      <ellipse cx="63" cy="57" rx="5.5" ry="6" fill="#5C3D1E" />
      {/* Pupil */}
      <ellipse cx="37" cy="57.5" rx="3.2" ry="3.8" fill="#150A00" />
      <ellipse cx="63" cy="57.5" rx="3.2" ry="3.8" fill="#150A00" />
      {/* Eye shine large */}
      <circle cx="39.5" cy="55" r="2" fill="white" />
      <circle cx="65.5" cy="55" r="2" fill="white" />
      {/* Eye shine small */}
      <circle cx="36" cy="59" r="1" fill="rgba(255,255,255,0.5)" />
      <circle cx="62" cy="59" r="1" fill="rgba(255,255,255,0.5)" />
      {/* Top eyelash */}
      <path d="M30 49 Q34 45 38 48" stroke="#2C1A0E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M56 48 Q60 45 64 49" stroke="#2C1A0E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Eyebrows */}
      <path d="M29 47 Q37 42 45 46" stroke="#6B3F1A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M55 46 Q63 42 71 47" stroke="#6B3F1A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="25" cy="65" rx="8" ry="5" fill="#F9A8A8" opacity="0.55" />
      <ellipse cx="75" cy="65" rx="8" ry="5" fill="#F9A8A8" opacity="0.55" />
      {/* Nose */}
      <ellipse cx="50" cy="67" rx="2.8" ry="2" fill="#E8A870" opacity="0.55" />
      {/* Smile */}
      <path d="M41 74 Q50 83 59 74" fill="none" stroke="#C86060" strokeWidth="2.4" strokeLinecap="round" />
      {/* Lip gloss */}
      <path d="M43 74 Q50 79 57 74" fill="none" stroke="#EDA0A0" strokeWidth="1.2" strokeLinecap="round" />
      {/* Hair accessory left */}
      <circle cx="22" cy="37" r="6" fill="#B8763A" />
      <circle cx="22" cy="37" r="3.5" fill="#D89B5E" />
      <circle cx="22" cy="37" r="1.5" fill="#F0BF80" />
      {/* Hair accessory right */}
      <circle cx="78" cy="37" r="6" fill="#B8763A" />
      <circle cx="78" cy="37" r="3.5" fill="#D89B5E" />
      <circle cx="78" cy="37" r="1.5" fill="#F0BF80" />
    </svg>
  );
}
