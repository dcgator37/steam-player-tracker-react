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
  Tooltip
} from "recharts";

import {
  fetchDailyTop100History
} from "../lib/api";


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


function formatShortDate(dateString) {

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

        {formatLongDate(label)}

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


export default function Top100DailyChart({
  time,
  days
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
          days
        }
      ],

      queryFn: () =>
        fetchDailyTop100History({
          time,
          days
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

          data={chartData}

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

            dataKey="date"

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

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}