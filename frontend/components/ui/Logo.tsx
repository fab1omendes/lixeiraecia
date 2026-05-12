export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className} justify-center`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Trash bin icon */}
        <rect x="12" y="16" width="24" height="26" rx="2" fill="#10B981" />
        <path
          d="M12 16C12 14.8954 12.8954 14 14 14H34C35.1046 14 36 14.8954 36 16V18H12V16Z"
          fill="#059669"
        />
        {/* Lid */}
        <rect x="10" y="12" width="28" height="3" rx="1.5" fill="#047857" />
        {/* Recycling symbol */}
        <g transform="translate(18, 24)">
          <path
            d="M6 0L8 3.5H4L6 0Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M2 7L0 3.5L4 3.5L2 7Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M10 7L12 3.5L8 3.5L10 7Z"
            fill="white"
            opacity="0.9"
          />
        </g>
        {/* Eco leaf accent */}
        <circle cx="38" cy="10" r="8" fill="#34D399" />
        <path
          d="M38 6C36 6 34 8 34 10C34 12 36 14 38 14C38 12 38 10 38 8C40 8 42 10 42 12C42 10 40 6 38 6Z"
          fill="#047857"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-bold text-2xl tracking-tight text-emerald-700">
          Lixeira & Cia
        </span>
        <span className="text-xs text-emerald-600 font-medium tracking-wide">
          Soluções em Gestão de Resíduos
        </span>
      </div>
    </div>
  );
}
