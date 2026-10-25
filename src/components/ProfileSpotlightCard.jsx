export default function ProfileSpotlightCard({
  category,
  title,
  metric,
  description,
  accent = "cyan"
}) {
  const colors = {
    cyan: "text-cyan-300 bg-cyan-400/10",
    violet:
      "text-violet-300 bg-violet-400/10",
    amber:
      "text-amber-300 bg-amber-400/10"
  };

  return (
    <article
      className="
        group glass-panel
        rounded-2xl border
        border-white/[0.07]
        p-5 transition
        hover:-translate-y-0.5
        hover:border-white/[0.13]
      "
    >
      <div
        className={`
          inline-flex rounded-full
          px-2.5 py-1
          text-[10px] font-semibold
          uppercase tracking-wider
          ${colors[accent]}
        `}
      >
        {category}
      </div>

      <h3
        className="
          mt-5 text-lg font-semibold
          text-white
        "
      >
        {title}
      </h3>

      <div
        className="
          mt-2 text-3xl
          font-semibold tracking-tight
          text-slate-100
        "
      >
        {metric}
      </div>

      <p
        className="
          mt-3 text-sm leading-6
          text-slate-500
        "
      >
        {description}
      </p>

      <button
        className="
          mt-5 text-xs font-medium
          text-cyan-400
          transition
          group-hover:text-cyan-300
        "
      >
        View profile →
      </button>
    </article>
  );
}