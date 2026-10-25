const accentStyles = {
  cyan:
    "from-cyan-400/15 border-cyan-400/15",

  violet:
    "from-violet-500/15 border-violet-400/15",

  emerald:
    "from-emerald-400/15 border-emerald-400/15",

  amber:
    "from-amber-400/15 border-amber-400/15"
};

export default function StatCard({
  label,
  value,
  detail,
  accent = "cyan"
}) {
  return (
    <div
      className={`
        glass-panel relative overflow-hidden
        rounded-2xl border
        border-white/[0.07]
        p-5
        ${accentStyles[accent]}
      `}
    >
      <div
        className={`
          pointer-events-none
          absolute inset-x-0 top-0
          h-24 bg-gradient-to-b
          ${accentStyles[accent]}
          to-transparent opacity-50
        `}
      />

      <div className="relative">
        <div
          className="
            text-xs font-medium
            uppercase tracking-[0.15em]
            text-slate-500
          "
        >
          {label}
        </div>

        <div
          className="
            mt-3 text-3xl
            font-semibold tracking-tight
            text-white
          "
        >
          {value}
        </div>

        {detail && (
          <div
            className="
              mt-2 text-xs
              leading-5 text-slate-500
            "
          >
            {detail}
          </div>
        )}
      </div>
    </div>
  );
}