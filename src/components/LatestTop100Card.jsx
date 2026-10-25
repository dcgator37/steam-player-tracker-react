import {
  useQuery
} from "@tanstack/react-query";

import {
  fetchLatestSnapshotSummary
} from "../lib/api";


function formatCompactNumber(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "—";
  }


  return new Intl.NumberFormat(
    "en-US",
    {
      notation: "compact",
      maximumFractionDigits: 2
    }
  ).format(value);
}


function formatFullNumber(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "—";
  }


  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}


function formatSampleTime(
  timestamp
) {

  if (!timestamp) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",

      month:
        "short",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",

      timeZoneName:
        "short"
    }
  ).format(
    new Date(timestamp)
  );
}


function getAgeMinutes(
  timestamp
) {

  if (!timestamp) {
    return null;
  }


  const difference =
    Date.now() -
    new Date(timestamp)
      .getTime();


  return Math.max(
    0,
    Math.floor(
      difference /
      60000
    )
  );
}


function getFreshnessStatus(
  timestamp
) {

  const minutes =
    getAgeMinutes(timestamp);


  if (minutes === null) {

    return {
      label: "Unknown",
      dotClass:
        "bg-slate-500",
      textClass:
        "text-slate-500"
    };
  }


  /*
   * Your normal collection interval
   * is every 15 minutes.
   */
  if (minutes <= 20) {

    return {
      label: "Current",
      dotClass:
        "bg-emerald-400",
      textClass:
        "text-emerald-400"
    };
  }


  if (minutes <= 60) {

    return {
      label: "Delayed",
      dotClass:
        "bg-amber-400",
      textClass:
        "text-amber-400"
    };
  }


  return {
    label: "Stale",
    dotClass:
      "bg-red-400",
    textClass:
      "text-red-400"
  };
}


export default function LatestTop100Card() {

  const {
    data,
    isPending,
    isError
  } =
    useQuery({

      queryKey: [
        "steam",
        "snapshots",
        "latest-summary"
      ],

      queryFn:
        fetchLatestSnapshotSummary,

      /*
       * Check every minute.
       *
       * Your actual data still only changes
       * every ~15 minutes.
       */
      refetchInterval:
        60 * 1000,

      staleTime:
        30 * 1000
    });


  if (isPending) {

    return (

      <div
        className="
          glass-panel
          min-h-[190px]
          rounded-2xl
          border border-white/[0.07]
          p-5
        "
      >

        <div
          className="
            animate-pulse
          "
        >

          <div
            className="
              h-3 w-36
              rounded bg-slate-800
            "
          />

          <div
            className="
              mt-6 h-9 w-28
              rounded bg-slate-800
            "
          />

          <div
            className="
              mt-5 h-3 w-44
              rounded bg-slate-900
            "
          />

        </div>

      </div>
    );
  }


  if (isError) {

    return (

      <div
        className="
          glass-panel
          min-h-[190px]
          rounded-2xl
          border border-red-400/10
          p-5
        "
      >

        <div
          className="
            text-xs font-semibold
            uppercase
            tracking-[0.15em]
            text-slate-500
          "
        >
          Top 100 Snapshot
        </div>


        <div
          className="
            mt-6 text-sm
            text-red-400
          "
        >
          Snapshot unavailable
        </div>

      </div>
    );
  }


  const current =
    data.current;


  const change =
    data.change;


  const playerChange =
    change?.players;


  const percentChange =
    change?.percentage;


  const freshness =
    getFreshnessStatus(
      current.sampledAt
    );


  const isPositive =
    playerChange > 0;


  const isNegative =
    playerChange < 0;


  let changeColor =
    "text-slate-400";


  if (isPositive) {

    changeColor =
      "text-emerald-400";

  } else if (isNegative) {

    changeColor =
      "text-amber-400";
  }


  const changeSymbol =
    isPositive
      ? "↑"
      : isNegative
        ? "↓"
        : "—";


  return (

    <section
      className="
        glass-panel relative
        min-h-[190px]
        overflow-hidden
        rounded-2xl
        border border-cyan-400/15
        p-5
      "
    >

      {/* subtle top glow */}

      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-28
          bg-gradient-to-b
          from-cyan-400/[0.08]
          to-transparent
        "
      />


      <div
        className="
          relative
        "
      >

        <div
          className="
            flex items-start
            justify-between gap-3
          "
        >

          <div
            className="
              text-xs font-semibold
              uppercase
              tracking-[0.15em]
              text-slate-500
            "
          >
            Top 100 Snapshot
          </div>


          <div
            className={`
              flex items-center
              gap-2 text-[10px]
              font-semibold uppercase
              tracking-wider
              ${freshness.textClass}
            `}
          >

            <span
              className={`
                h-2 w-2
                rounded-full
                ${freshness.dotClass}
              `}
            />

            {freshness.label}

          </div>

        </div>


        <div
          className="
            mt-4
          "
        >

          <div
            className="
              text-3xl
              font-semibold
              tracking-tight
              text-white
              xl:text-4xl
            "
            title={
              formatFullNumber(
                current
                  .totalConcurrentPlayers
              )
            }
          >

            {formatCompactNumber(
              current
                .totalConcurrentPlayers
            )}

          </div>


          <div
            className="
              mt-1 text-xs
              text-slate-500
            "
          >

            {formatFullNumber(
              current
                .totalConcurrentPlayers
            )}

            {" "}

            concurrent players

          </div>

        </div>


        <div
          className="
            mt-4 flex
            flex-wrap items-center
            gap-x-2 gap-y-1
          "
        >

          {playerChange !== null && (

            <span
              className={`
                text-sm font-semibold
                ${changeColor}
              `}
            >

              {changeSymbol}

              {" "}

              {formatCompactNumber(
                Math.abs(
                  playerChange
                )
              )}

            </span>

          )}


          {percentChange !== null && (

            <span
              className={`
                text-xs font-medium
                ${changeColor}
              `}
            >

              (
              {isPositive
                ? "+"
                : isNegative
                  ? "-"
                  : ""}

              {Math.abs(
                percentChange
              ).toFixed(2)}

              %)

            </span>

          )}


          <span
            className="
              text-xs
              text-slate-600
            "
          >
            vs previous snapshot
          </span>

        </div>


        <div
          className="
            mt-5 flex
            items-end justify-between
            gap-4 border-t
            border-white/[0.06]
            pt-4
          "
        >

          <div>

            <div
              className="
                text-[10px]
                uppercase
                tracking-wider
                text-slate-600
              "
            >
              Sampled
            </div>


            <div
              className="
                mt-1 text-xs
                text-slate-400
              "
            >

              {formatSampleTime(
                current.sampledAt
              )}

            </div>

          </div>


          <div
            className="
              rounded-lg
              border border-white/[0.07]
              bg-white/[0.025]
              px-2.5 py-1.5
              text-[10px]
              font-medium
              text-slate-500
            "
          >

            {current.numberOfGames}
            {" / "}
            100 games

          </div>

        </div>

      </div>

    </section>
  );
}