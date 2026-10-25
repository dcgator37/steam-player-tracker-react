export default function PageHeader({
  eyebrow,
  title,
  description,
  actions
}) {
  return (
    <div
      className="
        mb-8 flex flex-col
        justify-between gap-5
        xl:flex-row
        xl:items-end
      "
    >
      <div>
        {eyebrow && (
          <div
            className="
              mb-2 text-xs font-semibold
              uppercase tracking-[0.24em]
              text-cyan-400
            "
          >
            {eyebrow}
          </div>
        )}

        <h1
          className="
            text-3xl font-semibold
            tracking-tight text-white
            sm:text-4xl
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mt-3 max-w-3xl
              text-sm leading-6
              text-slate-400
              sm:text-base
            "
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}