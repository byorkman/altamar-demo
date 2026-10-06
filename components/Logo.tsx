export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const ink = light ? "#FFFFFF" : "#13294B";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="Altamar">
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" aria-hidden="true">
        <circle cx="20" cy="17" r="8" fill="#C4572E" />
        <path d="M4 26c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M4 32c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span
        className="font-display text-[26px] font-semibold leading-none tracking-[0.18em]"
        style={{ color: ink }}
      >
        ALTAMAR
      </span>
    </span>
  );
}
