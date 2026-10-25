import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";


function shortName(
  name
) {

  if (!name) {
    return "Unknown";
  }


  return name.length > 20
    ? `${name.slice(0, 18)}…`
    : name;
}


function formatHours(
  value
) {

  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits:
        1
    }
  ).format(value);
}


export default function TopGamesChart({
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

        layout="vertical"

        margin={{
          top: 10,
          right: 20,
          bottom: 5,
          left: 10
        }}
      >

        <CartesianGrid

          horizontal={false}

          stroke="
            rgba(148, 163, 184, 0.08)
          "

          strokeDasharray="3 3"
        />


        <XAxis

          type="number"

          tickFormatter={
            value =>
              `${formatHours(value)}h`
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


        <YAxis

          type="category"

          dataKey="name"

          width={145}

          tickFormatter={
            shortName
          }

          tick={{
            fill:
              "#94a3b8",
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

              `${formatHours(value)} hours`,

              "Playtime"
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

          dataKey="playtimeHours"

          fill="#8b5cf6"

          radius={[
            0,
            6,
            6,
            0
          ]}
        />

      </BarChart>

    </ResponsiveContainer>
  );
}