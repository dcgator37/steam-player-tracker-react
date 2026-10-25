import {
  CartesianGrid,
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


const GTA_VI_RELEASE_TIMESTAMP =
  Date.parse(
    `${GTA_VI_RELEASE_DATE}T05:00:00Z`
  );


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


export default function GameRankTrendChart({
  points
}) {

  const data =
    points || [];


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
        No ranking data available.
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

          domain={[
            1,
            100
          ]}

          reversed

          width={45}

          tickFormatter={
            value =>
              `#${value}`
          }

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
            value => [

              value === null
                ? "Outside Top 100"
                : `#${value}`,

              "Steam Rank"
            ]
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


        {showGtaMarker && (

          <ReferenceLine

            x={
              GTA_VI_RELEASE_TIMESTAMP
            }

            stroke="#f59e0b"

            strokeDasharray="5 5"
          />

        )}


        <Line

          type="linear"

          dataKey="ranking"

          name="Steam Rank"

          stroke="#8b5cf6"

          strokeWidth={2}

          dot={false}

          connectNulls={false}

          isAnimationActive={false}
        />

      </LineChart>

    </ResponsiveContainer>
  );
}