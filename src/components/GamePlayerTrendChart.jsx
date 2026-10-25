import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


const EASTERN =
  "America/New_York";


const GTA_VI_RELEASE_DATE =
  import.meta.env
    .VITE_GTA_VI_RELEASE_DATE ||
  "2026-11-19";


/*
 * November is EST, so midnight Eastern
 * is 05:00 UTC.
 */
const GTA_VI_RELEASE_TIMESTAMP =
  Date.parse(
    `${GTA_VI_RELEASE_DATE}T05:00:00Z`
  );


function formatCompact(
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
      notation:
        "compact",

      maximumFractionDigits:
        1
    }
  ).format(value);
}


function formatFull(
  value
) {

  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}


function formatAxisDate(
  timestamp
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      timeZone:
        EASTERN
    }
  ).format(
    new Date(timestamp)
  );
}


function formatTooltipDate(
  timestamp
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",

      timeZoneName:
        "short",

      timeZone:
        EASTERN
    }
  ).format(
    new Date(timestamp)
  );
}


function addSevenDayBaseline(
  points
) {

  const queue = [];

  let sum = 0;
  let count = 0;


  return points.map(
    point => {

      /*
       * Baseline uses PRIOR days only.
       */
      const baseline =
        count >= 3
          ? Math.round(
              sum /
              count
            )
          : null;


      const current =
        point.currentPlayers;


      queue.push(
        current
      );


      if (
        current !== null
      ) {

        sum +=
          current;

        count +=
          1;
      }


      if (
        queue.length > 7
      ) {

        const removed =
          queue.shift();


        if (
          removed !== null
        ) {

          sum -=
            removed;

          count -=
            1;
        }
      }


      return {

        ...point,

        baselinePlayers:
          baseline
      };
    }
  );
}


export default function GamePlayerTrendChart({

  points,
  sampling

}) {

  const data =
    sampling === "daily"
      ? addSevenDayBaseline(
          points || []
        )
      : points || [];


  if (
    data.length === 0
  ) {

    return (

      <div
        className="
          flex h-full
          items-center justify-center
          text-sm text-slate-600
        "
      >
        No player-count data available.
      </div>
    );
  }


  const minTimestamp =
    data[0]
      ?.timestamp;


  const maxTimestamp =
    data[
      data.length - 1
    ]?.timestamp;


  const showGtaMarker =
    GTA_VI_RELEASE_TIMESTAMP >=
      minTimestamp
    &&
    GTA_VI_RELEASE_TIMESTAMP <=
      maxTimestamp;


  return (

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <LineChart

        data={data}

        margin={{
          top: 16,
          right: 20,
          left: 4,
          bottom: 4
        }}
      >

        <CartesianGrid

          vertical={false}

          stroke="
            rgba(148,163,184,.08)
          "

          strokeDasharray="3 3"
        />


        <XAxis

          dataKey="timestamp"

          type="number"

          scale="time"

          domain={[
            "dataMin",
            "dataMax"
          ]}

          tickFormatter={
            formatAxisDate
          }

          tick={{
            fill:
              "#64748b",

            fontSize:
              11
          }}

          tickLine={false}

          axisLine={{
            stroke:
              "rgba(148,163,184,.12)"
          }}

          minTickGap={35}
        />


        <YAxis

          tickFormatter={
            formatCompact
          }

          width={55}

          tick={{
            fill:
              "#64748b",

            fontSize:
              11
          }}

          tickLine={false}

          axisLine={false}
        />


        <Tooltip

          labelFormatter={
            formatTooltipDate
          }

          formatter={
            (
              value,
              name
            ) => {

              if (
                value ===
                null
              ) {

                return [
                  "Outside Top 100",
                  name
                ];
              }


              return [

                formatFull(
                  value
                ),

                name ===
                "baselinePlayers"
                  ? "7-day baseline"
                  : "Concurrent players"
              ];
            }
          }

          contentStyle={{

            background:
              "#080d1a",

            border:
              "1px solid rgba(255,255,255,.1)",

            borderRadius:
              "12px"
          }}
        />


        <Legend />


        {showGtaMarker && (

          <ReferenceLine

            x={
              GTA_VI_RELEASE_TIMESTAMP
            }

            stroke="#f59e0b"

            strokeDasharray="5 5"

            label={{
              value:
                "GTA VI",

              position:
                "insideTopRight",

              fill:
                "#f59e0b",

              fontSize:
                11
            }}

          />

        )}


        <Line

          type="linear"

          dataKey="currentPlayers"

          name="Concurrent Players"

          stroke="#22d3ee"

          strokeWidth={2}

          dot={false}

          connectNulls={false}

          isAnimationActive={false}
        />


        {sampling ===
         "daily" && (

          <Line

            type="linear"

            dataKey="baselinePlayers"

            name="7-Day Baseline"

            stroke="#8b5cf6"

            strokeWidth={1.5}

            strokeDasharray="5 5"

            dot={false}

            connectNulls

            isAnimationActive={false}
          />

        )}

      </LineChart>

    </ResponsiveContainer>
  );
}