import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";


function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}


export default function PlaytimeDistributionChart({
  data
}) {

  if (
    !data ||
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
        Playtime data unavailable.
      </div>
    );
  }


  return (

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <BarChart

        data={data}

        margin={{
          top: 15,
          right: 10,
          left: 0,
          bottom: 5
        }}
      >

        <CartesianGrid
          vertical={false}
          stroke="
            rgba(148, 163, 184, 0.08)
          "
          strokeDasharray="3 3"
        />


        <XAxis

          dataKey="label"

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
        />


        <YAxis

          allowDecimals={false}

          tickFormatter={
            formatNumber
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

          cursor={{
            fill:
              "rgba(255,255,255,.03)"
          }}

          formatter={
            value => [

              formatNumber(
                value
              ),

              "Games"
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


        <Bar

          dataKey="count"

          fill="#22d3ee"

          radius={[
            6,
            6,
            0,
            0
          ]}
        />

      </BarChart>

    </ResponsiveContainer>
  );
}