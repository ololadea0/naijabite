export function MenuSectionHeader({ title, onBack }) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" />
        <polyline
          points="12 19 5 12 12 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {title}
    </button>
  );
}
