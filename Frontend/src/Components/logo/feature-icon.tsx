interface FeatureIconProps {
  type: "lightning" | "escalate" | "channels"
  className?: string
}

export function FeatureIcon({ type, className = "" }: FeatureIconProps) {
  const icons = {
    lightning: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M32 8L16 36H32L32 56L48 28H32L32 8Z" fill="#FF7B00" opacity="0.2" />
        <path d="M32 8L16 36H32L32 56L48 28H32L32 8Z" stroke="#FF7B00" strokeWidth="2" strokeLinejoin="round" />
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={24 + i * 2} cy={20 + i * 4} r="1" fill="#FF9F1C" />
        ))}
      </svg>
    ),
    escalate: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="32" cy="20" r="8" fill="#FF7B00" opacity="0.2" />
        <circle cx="32" cy="20" r="8" stroke="#FF7B00" strokeWidth="2" />
        <path d="M20 44C20 38 25 34 32 34C39 34 44 38 44 44V52H20V44Z" fill="#FF9F1C" opacity="0.2" />
        <path d="M20 44C20 38 25 34 32 34C39 34 44 38 44 44V52H20V44Z" stroke="#FF9F1C" strokeWidth="2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={22 + i * 4} y={36 + i} width="20" height="1" fill="#FF7B00" opacity="0.6" />
        ))}
      </svg>
    ),
    channels: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="12" y="12" width="40" height="28" rx="4" fill="#FF7B00" opacity="0.2" />
        <rect x="12" y="12" width="40" height="28" rx="4" stroke="#FF7B00" strokeWidth="2" />
        <path d="M20 48L32 40L44 48" stroke="#FF9F1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={16 + (i % 4) * 8} y={18 + Math.floor(i / 4) * 4} width="6" height="1" fill="#FF9F1C" />
        ))}
      </svg>
    ),
  }

  return icons[type]
}
