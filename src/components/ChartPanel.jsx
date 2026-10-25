export default function ChartPanel({
  title,
  description,
  controls,
  height = "h-[360px]",
  children
}) {
  return (
    <section
      className="
        glass-panel rounded-2xl
        border border-white/[0.07]
      "
    >
      <div
        className="
          flex flex-col gap-4
          border-b border-white/[0.06]
          p-5 sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              font-semibold text-white
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-1 text-sm
                text-slate-500
              "
            >
              {description}
            </p>
          )}
        </div>

        {controls && (
          <div
            className="
              flex flex-wrap
              items-end gap-3
            "
          >
            {controls}
          </div>
        )}
      </div>

      <div
        className={`
          chart-grid relative
          ${height}
          overflow-hidden
          rounded-b-2xl
          p-5
        `}
      >
        {children || (
          <ChartPlaceholder />
        )}
      </div>
    </section>
  );
}

function ChartPlaceholder() {
  return (
    <div
      className="
        flex h-full
        items-center justify-center
      "
    >
      <div className="text-center">
        <div
          className="
            mx-auto mb-4
            flex h-14 w-14
            items-center justify-center
            rounded-2xl
            border border-cyan-400/20
            bg-cyan-400/5
            text-xl text-cyan-300
          "
        >
          ↗
        </div>

        <div
          className="
            text-sm font-medium
            text-slate-300
          "
        >
          Recharts goes here
        </div>

        <div
          className="
            mt-1 text-xs
            text-slate-600
          "
        >
          Replace this content with your
          ResponsiveContainer.
        </div>
      </div>
    </div>
  );
}