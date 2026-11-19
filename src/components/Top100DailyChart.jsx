import {
  useQuery
} from "@tanstack/react-query";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

import {
  fetchDailyTop100History
} from "../lib/api";

const GTA_VI_RELEASE_DATE =
  import.meta.env
    .VITE_GTA_VI_RELEASE_DATE ||
  "2026-11-19";


/*
 * Noon Eastern on release day.
 *
 * We're using the marker as a DATE marker,
 * not claiming the exact release hour.
 */
const GTA_VI_RELEASE_TIMESTAMP =
  Date.parse(
    `${GTA_VI_RELEASE_DATE}T00:00:00-05:00`
  );

const ONE_DAY =
  24 *
  60 *
  60 *
  1000;

  function addBaseline(points) {

  /*
   * Only use real observations occurring
   * BEFORE GTA VI's release.
   */
  const preReleasePoints =
    points.filter(
      point =>
        Number.isFinite(
          point.timestamp
        ) &&
        Number.isFinite(
          point.totalConcurrentPlayers
        ) &&
        point.timestamp <
          GTA_VI_RELEASE_TIMESTAMP
    );


  /*
   * We need at least one valid observation.
   */
  if (
    preReleasePoints.length === 0
  ) {

    return {
      points,
      baselineValue: null
    };
  }


  /*
   * Arithmetic mean of the selected
   * pre-release observations.
   */
  const baselineValue =
    Math.round(
      preReleasePoints.reduce(
        (sum, point) =>
          sum +
          point.totalConcurrentPlayers,
        0
      )
      /
      preReleasePoints.length
    );


  /*
   * Show the baseline only through
   * GTA VI's release date.
   */
  const baselinePoints =
    points.map(
      point => ({
        ...point,

        baselinePlayers:
          point.timestamp <=
          GTA_VI_RELEASE_TIMESTAMP
            ? baselineValue
            : null
      })
    );


  /*
   * Add a synthetic point exactly on
   * GTA VI's release date.
   *
   * This allows the horizontal baseline
   * to visually extend all the way to
   * the release marker even though there
   * may not be an actual observation at
   * exactly midnight.
   */
  const hasReleasePoint =
    baselinePoints.some(
      point =>
        point.timestamp ===
        GTA_VI_RELEASE_TIMESTAMP
    );


  if (!hasReleasePoint) {

    baselinePoints.push({
      timestamp:
        GTA_VI_RELEASE_TIMESTAMP,

      totalConcurrentPlayers:
        null,

      baselinePlayers:
        baselineValue,

      sampledAt:
        null,

      isBaselineEndpoint:
        true
    });
  }


  baselinePoints.sort(
    (a, b) =>
      a.timestamp -
      b.timestamp
  );


  return {
    points: baselinePoints,
    baselineValue
  };
}

function addTrendline(
  points
) {

  const valid =
    points.filter(
      point =>

        Number.isFinite(
          point.timestamp
        )

        &&

        Number.isFinite(
          point.totalConcurrentPlayers
        )
    );


  if (
    valid.length < 2
  ) {

    return points.map(
      point => ({

        ...point,

        trendPlayers:
          null
      })
    );
  }


  /*
   * Center X around the first observation.
   * This avoids doing regression against
   * enormous Unix timestamp numbers.
   */
  const firstTimestamp =
    valid[0]
      .timestamp;


  const regression =
    valid.map(
      point => ({

        x:
          (
            point.timestamp -
            firstTimestamp
          )
          /
          ONE_DAY,

        y:
          point
            .totalConcurrentPlayers
      })
    );


  const count =
    regression.length;


  const meanX =
    regression.reduce(
      (
        sum,
        point
      ) =>
        sum +
        point.x,
      0
    )
    /
    count;


  const meanY =
    regression.reduce(
      (
        sum,
        point
      ) =>
        sum +
        point.y,
      0
    )
    /
    count;


  let numerator =
    0;


  let denominator =
    0;


  for (
    const point
    of regression
  ) {

    numerator +=
      (
        point.x -
        meanX
      )
      *
      (
        point.y -
        meanY
      );


    denominator +=
      (
        point.x -
        meanX
      )
      ** 2;
  }


  const slope =
    denominator === 0
      ? 0
      : numerator /
        denominator;


  const intercept =
    meanY -
    slope *
    meanX;


  return points.map(
    point => {

      if (
        !Number.isFinite(
          point.timestamp
        )
      ) {

        return {

          ...point,

          trendPlayers:
            null
        };
      }


      const x =
        (
          point.timestamp -
          firstTimestamp
        )
        /
        ONE_DAY;


      return {

        ...point,

        trendPlayers:
          Math.round(
            intercept +
            slope *
            x
          )
      };
    }
  );
}


function formatCompactNumber(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      notation: "compact",
      maximumFractionDigits: 1
    }
  ).format(value);
}


function formatFullNumber(value) {

  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}


/*
 * Avoid new Date("2026-09-19")
 * here because date-only strings can
 * shift depending on timezone.
 */
function dateFromParts(dateString) {

  const [
    year,
    month,
    day
  ] =
    dateString
      .split("-")
      .map(Number);


  return new Date(
    year,
    month - 1,
    day
  );
}


/* function formatShortDate(dateString) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric"
    }
  ).format(
    dateFromParts(
      dateString
    )
  );
} */

function formatShortDate(value) {
  const date =
    typeof value === "number"
      ? new Date(value)
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      timeZone:
        "America/New_York"
    }
  ).format(date);
}

function formatFullDate(value) {
  const date =
    typeof value === "number"
      ? new Date(value)
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone:
        "America/New_York"
    }
  ).format(date);
}


function formatLongDate(dateString) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  ).format(
    dateFromParts(
      dateString
    )
  );
}


function formatActualSampleTime(
  timestamp
) {

  if (!timestamp) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",

      hour:
        "numeric",

      minute:
        "2-digit",

      second:
        "2-digit",

      timeZoneName:
        "short"
    }
  ).format(
    new Date(timestamp)
  );
}


function SteamTooltip({
  active,
  payload,
  label
}) {

  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {

    return null;
  }


  const point =
    payload[0].payload;

    /*
   * Ignore anything that isn't an
   * actual player-count observation.
   */
  if (
    !Number.isFinite(
      point.totalConcurrentPlayers
    )
  ) {
    return null;
  }


  const previousChange =
    point.changeFromPreviousPercent;


  const baselineChange =
    point.changeFromBaselinePercent;


  return (

    <div
      className="
        min-w-56 rounded-xl
        border border-white/10
        bg-[#080d1a]/95
        p-4
        shadow-2xl
        shadow-black/40
        backdrop-blur-xl
      "
    >

      <div
        className="
          text-xs font-medium
          text-slate-500
        "
      >

        {formatFullDate(label)}

      </div>


      <div
        className="
          mt-2 text-xl
          font-semibold
          text-white
        "
      >

        {formatFullNumber(
          point.totalConcurrentPlayers
        )}

      </div>


      <div
        className="
          mt-1 text-xs
          text-cyan-400
        "
      >

        Top 100 concurrent players

      </div>

        {/* COMPARISONS */}

      <div
        className="
          mt-4 space-y-3
          border-t
          border-white/[0.06]
          pt-3
        "
      >

        {/* PRIOR OBSERVATION */}

        {Number.isFinite(
          previousChange
        ) && (

          <div>

            <div
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-wider
                text-slate-600
              "
            >

              vs. prior observation

            </div>


            <div
              className="
                mt-1 flex
                items-baseline
                justify-between
                gap-4
              "
            >

              <span
                className="
                  text-xs
                  text-slate-400
                "
              >

                {formatComparisonDate(
                  point.previousTimestamp
                )}

              </span>


              <span
                className={
                  previousChange < 0

                    ? `
                        text-sm
                        font-semibold
                        text-red-400
                      `

                    : previousChange > 0

                      ? `
                          text-sm
                          font-semibold
                          text-emerald-400
                        `

                      : `
                          text-sm
                          font-semibold
                          text-slate-300
                        `
                }
              >

                {previousChange < 0
                  ? "↓ "
                  : previousChange > 0
                    ? "↑ "
                    : ""}

                {formatPercentChange(
                  previousChange
                )}

              </span>

            </div>


            <div
              className="
                mt-1 text-[11px]
                text-slate-600
              "
            >

              Prior count:{" "}

              {formatFullNumber(
                point.previousPlayers
              )}

            </div>

          </div>

        )}


        {/* BASELINE */}

        {Number.isFinite(
          baselineChange
        ) && (

          <div>

            <div
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-wider
                text-slate-600
              "
            >

              vs. pre-release baseline

            </div>


            <div
              className="
                mt-1 flex
                items-baseline
                justify-between
                gap-4
              "
            >

              <span
                className="
                  text-xs
                  text-slate-400
                "
              >

                {formatCompactNumber(
                  point.baselineValue
                )}

              </span>


              <span
                className={
                  baselineChange < 0

                    ? `
                        text-sm
                        font-semibold
                        text-red-400
                      `

                    : baselineChange > 0

                      ? `
                          text-sm
                          font-semibold
                          text-emerald-400
                        `

                      : `
                          text-sm
                          font-semibold
                          text-slate-300
                        `
                }
              >

                {baselineChange < 0
                  ? "↓ "
                  : baselineChange > 0
                    ? "↑ "
                    : ""}

                {formatPercentChange(
                  baselineChange
                )}

              </span>

            </div>

          </div>

        )}

      </div>




      <div
        className="
          mt-3 border-t
          border-white/[0.06]
          pt-3 text-xs
          text-slate-500
        "
      >

        Actual sample:{" "}

        <span
          className="
            text-slate-300
          "
        >

          {formatActualSampleTime(
            point.sampledAt
          )}

        </span>

      </div>

    </div>
  );
}

function calculatePercentChange(
  current,
  previous
) {
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(previous) ||
    previous === 0
  ) {
    return null;
  }

  return (
    ((current - previous) / previous) *
    100
  );
}


function formatPercentChange(
  value
) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  const absolute =
    Math.abs(value).toFixed(1);

  if (value > 0) {
    return `${absolute}% more`;
  }

  if (value < 0) {
    return `${absolute}% less`;
  }

  return "No change";
}


function formatComparisonDate(
  timestamp
) {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone:
        "America/New_York"
    }
  ).format(
    new Date(timestamp)
  );
}


export default function Top100DailyChart({
  time,
  days,
  weekday
}) {

  const {
    data,
    isPending,
    isError,
    error,
    isFetching
  } =
    useQuery({

      queryKey: [
        "steam",
        "top100",
        "daily",
        {
          time,
          days,
          weekday
        }
      ],

      queryFn: () =>
        fetchDailyTop100History({
          time,
          days,
          weekday
        }),

      staleTime:
        60 * 1000
    });


  if (isPending) {

    return (

      <div
        className="
          flex h-full
          items-center justify-center
        "
      >

        <div
          className="
            text-center
          "
        >

          <div
            className="
              mx-auto h-7 w-7
              animate-spin
              rounded-full
              border-2
              border-slate-700
              border-t-cyan-400
            "
          />

          <div
            className="
              mt-3 text-sm
              text-slate-500
            "
          >

            Loading Steam history...

          </div>

        </div>

      </div>
    );
  }


  if (isError) {

    return (

      <div
        className="
          flex h-full
          items-center justify-center
        "
      >

        <div
          className="
            max-w-md text-center
          "
        >

          <div
            className="
              text-sm font-medium
              text-red-400
            "
          >

            Could not load Steam history

          </div>


          <div
            className="
              mt-2 text-xs
              text-slate-600
            "
          >

            {error.message}

          </div>

        </div>

      </div>
    );
  }


  const chartData =
    data?.points ?? [];

  const preparedPoints =
  chartData.map(
    point => ({
      ...point,

      timestamp:
        new Date(
          point.targetTimestamp
        ).getTime(),

      totalConcurrentPlayers:
        point.totalConcurrentPlayers ===
        null
          ? null
          : Number(
              point.totalConcurrentPlayers
            )
    })
  );

  const baseChartPoints =
  chartData
    .map(
      point => {

        const dateValue =
          point.targetTimestamp ??
          point.sampledAt ??
          point.date;


        return {
          ...point,

          timestamp:
            new Date(
              dateValue
            ).getTime(),

          totalConcurrentPlayers:
            point.totalConcurrentPlayers ===
            null ||
            point.totalConcurrentPlayers ===
            undefined

              ? null

              : Number(
                  point.totalConcurrentPlayers
                )
        };
      }
    )
    .filter(
      point =>
        Number.isFinite(
          point.timestamp
        )
    );

    const preReleasePoints =
  baseChartPoints.filter(
    point =>
      point.timestamp <
        GTA_VI_RELEASE_TIMESTAMP
      &&
      Number.isFinite(
        point.totalConcurrentPlayers
      )
  );


const baselineValue =
  preReleasePoints.length > 0

    ? Math.round(
        preReleasePoints.reduce(
          (sum, point) =>
            sum +
            point.totalConcurrentPlayers,
          0
        )
        /
        preReleasePoints.length
      )

    : null;

    const firstTimestamp =
  baseChartPoints.length > 0

    ? Math.min(
        ...baseChartPoints.map(
          point =>
            point.timestamp
        )
      )

    : GTA_VI_RELEASE_TIMESTAMP;


const lastTimestamp =
  baseChartPoints.length > 0

    ? Math.max(
        ...baseChartPoints.map(
          point =>
            point.timestamp
        )
      )

    : GTA_VI_RELEASE_TIMESTAMP;


/*
 * This is CRITICAL right now.
 *
 * Since GTA VI has not released yet,
 * our actual data ends before Nov 19.
 *
 * We have to explicitly extend the
 * X-axis through Nov 19 or Recharts
 * cannot display the release line.
 */
const chartEndTimestamp =
  Math.max(
    lastTimestamp,
    GTA_VI_RELEASE_TIMESTAMP
  );

/* const {
  points: chartPoints,
  baselineValue
} =
  addBaseline(
    preparedPoints
  ); */

  /*   const chartPoints =
  addTrendline(

    chartData.map(
      point => ({

        ...point,

1
        *
         * targetTimestamp means the X-axis
         * remains correct even if the actual
         * collection occurred a few minutes
         * away from exactly 8 PM.
         *
        timestamp:
          new Date(
            point.targetTimestamp
          ).getTime(),


        totalConcurrentPlayers:
          point.totalConcurrentPlayers ===
          null
            ? null
            : Number(
                point.totalConcurrentPlayers
              )
      })
    )
  );
  */

const latestTimestamp =
  baseChartPoints[
    baseChartPoints.length - 1
  ]?.timestamp;


const chartMaxTimestamp =
  latestTimestamp

    ? Math.max(
        latestTimestamp,
        GTA_VI_RELEASE_TIMESTAMP
      )

    : GTA_VI_RELEASE_TIMESTAMP;

/*
 * Add comparison information to
 * each real observation.
 *
 * We remember the prior VALID observation.
 * This skips missing/null snapshots.
 */
let previousValidPoint =
  null;


const chartPoints =
  baseChartPoints.map(
    point => {

      const currentPlayers =
        point.totalConcurrentPlayers;


      let previousPlayers =
        null;

      let previousTimestamp =
        null;

      let changeFromPreviousPercent =
        null;


      if (
        Number.isFinite(
          currentPlayers
        )
      ) {

        if (
          previousValidPoint
        ) {

          previousPlayers =
            previousValidPoint
              .totalConcurrentPlayers;

          previousTimestamp =
            previousValidPoint
              .timestamp;

          changeFromPreviousPercent =
            calculatePercentChange(
              currentPlayers,
              previousPlayers
            );
        }


        /*
         * This becomes the comparison
         * point for the next observation.
         */
        previousValidPoint =
          point;
      }

      const changeFromBaselinePercent =
        Number.isFinite(
          currentPlayers
        ) &&
        Number.isFinite(
          baselineValue
        ) &&
        baselineValue !== 0

          ? calculatePercentChange(
              currentPlayers,
              baselineValue
            )

          : null;

          return {
        ...point,

        previousPlayers,

        previousTimestamp,

        changeFromPreviousPercent,

        baselineValue,

        changeFromBaselinePercent
      };
    }
  );




  if (
    chartData.length === 0
  ) {

    return (

      <div
        className="
          flex h-full
          items-center justify-center
          text-sm text-slate-600
        "
      >

        No snapshots were found
        for this time and range.

      </div>
    );
  }

  console.log({
  firstTimestamp:
    new Date(
      firstTimestamp
    ).toString(),

  lastTimestamp:
    new Date(
      lastTimestamp
    ).toString(),

  gtaRelease:
    new Date(
      GTA_VI_RELEASE_TIMESTAMP
    ).toString(),

  chartEnd:
    new Date(
      chartEndTimestamp
    ).toString(),

  baselineValue,

  chartPoints:
    chartPoints.length,

  preReleasePoints:
    preReleasePoints.length
});

  return (

    <div
      className="
        relative h-full w-full
      "
    >

      {isFetching && (

        <div
          className="
            absolute right-2 top-0
            z-10 rounded-full
            border border-cyan-400/10
            bg-cyan-400/[0.05]
            px-2.5 py-1
            text-[10px]
            font-medium
            uppercase
            tracking-wider
            text-cyan-400
          "
        >

          Updating

        </div>

      )}


      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart

          //data={chartData}
          data={chartPoints}

          margin={{
            top: 16,
            right: 18,
            left: 8,
            bottom: 4
          }}
        >

          <CartesianGrid
            stroke="
              rgba(148, 163, 184, 0.08)
            "

            strokeDasharray="3 3"

            vertical={false}
          />
          
          <XAxis

            //dataKey="date"
            dataKey="timestamp"
            //new
            type="number"
            scale="time"
            domain={[
              firstTimestamp,
              chartEndTimestamp
            ]}

            tickFormatter={
              formatShortDate
            }

            tick={{
              fill: "#64748b",
              fontSize: 11
            }}

            axisLine={{
              stroke:
                "rgba(148, 163, 184, .12)"
            }}

            tickLine={false}

            minTickGap={28}

            interval="preserveStartEnd"
          />


          <YAxis

            width={64}

            tickFormatter={
              formatCompactNumber
            }

            tick={{
              fill: "#64748b",
              fontSize: 11
            }}

            axisLine={false}

            tickLine={false}

            domain={[
              "auto",
              "auto"
            ]}
          />

          <Tooltip

            content={
              <SteamTooltip />
            }

            cursor={{

              stroke:
                "rgba(34, 211, 238, .25)",

              strokeWidth: 1,

              strokeDasharray:
                "4 4"
            }}
          />

          <Legend />


    {/* GTA VI RELEASE */}

    <ReferenceLine

      x={
        GTA_VI_RELEASE_TIMESTAMP
      }

      stroke="#f59e0b"

      strokeWidth={2}

      strokeDasharray="5 5"

      label={{

        value:
          "GTA VI • Nov 19",

        position:
          "insideTopRight",

        fill:
          "#f59e0b",

        fontSize:
          11
      }}

    />


          <Line

            type="monotone"

            dataKey="totalConcurrentPlayers"

            /*
             * If JSX complains about the
             * whitespace above, write this
             * instead:
             *
             * dataKey="totalConcurrentPlayers"
             */

            stroke="#22d3ee"

            strokeWidth={3}

            dot={false}

            activeDot={{
              r: 5,
              fill: "#22d3ee",
              stroke: "#07111d",
              strokeWidth: 3
            }}

            isAnimationActive={true}

            animationDuration={500}

            connectNulls={false}
          />

          {baselineValue !== null && (

  <ReferenceLine

    segment={[
      {
        x:
          firstTimestamp,

        y:
          baselineValue
      },

      {
        x:
          GTA_VI_RELEASE_TIMESTAMP,

        y:
          baselineValue
      }
    ]}

    stroke="#8b5cf6"

    strokeWidth={2}

    strokeDasharray="7 5"

    label={{
      value:
        `Baseline ${new Intl.NumberFormat(
          "en-US",
          {
            notation:
              "compact",

            maximumFractionDigits:
              2
          }
        ).format(
          baselineValue
        )}`,

      position:
        "insideTopLeft",

      fill:
        "#a78bfa",

      fontSize:
        11
    }}

  />

)}

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}