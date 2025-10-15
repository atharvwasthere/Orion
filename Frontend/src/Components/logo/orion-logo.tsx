export function OrionLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#FF7B00" opacity="0.2" />
          <circle cx="16" cy="16" r="10" fill="#FF7B00" />
          <circle cx="16" cy="16" r="6" fill="#FF9F1C" />
          <circle cx="16" cy="16" r="3" fill="#FFF3E4" />
        </svg>
      </div>
      <span className="font-display text-2xl font-bold tracking-tight">Orion</span>
    </div>
  )
}
