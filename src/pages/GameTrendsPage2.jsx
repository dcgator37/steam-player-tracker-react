import { useState } from "react";

import PageHeader
  from "../components/PageHeader";

import ChartPanel
  from "../components/ChartPanel";

import SelectField
  from "../components/SelectField";

import StatCard
  from "../components/StatCard";


const gameOptions = [
  {
    value: "fivem",
    label: "FiveM"
  },
  {
    value: "gta5-enhanced",
    label: "Grand Theft Auto V Enhanced"
  },
  {
    value: "gta5-legacy",
    label: "Grand Theft Auto V Legacy"
  },
  {
    value: "rdr2",
    label: "Red Dead Redemption 2"
  },
  {
    value: "cod",
    label: "Call of Duty"
  },
  {
    value: "cyberpunk",
    label: "Cyberpunk 2077"
  },
  {
    value: "cs2",
    label: "Counter-Strike 2"
  },
  {
    value: "pubg",
    label: "PUBG"
  },
  {
    value: "rust",
    label: "Rust"
  },
  {
    value: "helldivers2",
    label: "Helldivers 2"
  }
];


const sampleOptions = [
  {
    value: "all",
    label: "All snapshots"
  },
  {
    value: "20:00",
    label: "8 PM daily"
  },
  {
    value: "18:00",
    label: "6 PM daily"
  },
  {
    value: "22:00",
    label: "10 PM daily"
  }
];


export default function GameTrendsPage() {

  const [game, setGame] =
    useState("fivem");

  const [sample, setSample] =
    useState("20:00");


  return (
    <>
      <PageHeader
        eyebrow="Game Trends"
        title="Individual Game Activity"
        description="
          Watch games that could plausibly
          experience player displacement
          around the GTA VI release.
        "
      />


      <div
        className="
          mb-6 grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          label="Current Players"
          value="—"
          detail="Latest captured snapshot"
        />

        <StatCard
          label="24H Peak"
          value="—"
          detail="Steam reported peak"
          accent="violet"
        />

        <StatCard
          label="30-Day Change"
          value="—"
          detail="Compared with baseline"
          accent="emerald"
        />

        <StatCard
          label="Current Rank"
          value="—"
          detail="Among tracked Top 100"
          accent="amber"
        />
      </div>


      <ChartPanel
        title="Concurrent Player History"
        description="
          Track the selected game's
          concurrent player count over time.
        "
        height="h-[440px]"
        controls={
          <>
            <SelectField
              label="Game"
              value={game}
              onChange={
                event =>
                  setGame(
                    event.target.value
                  )
              }
              options={gameOptions}
            />

            <SelectField
              label="Sampling"
              value={sample}
              onChange={
                event =>
                  setSample(
                    event.target.value
                  )
              }
              options={sampleOptions}
            />
          </>
        }
      />


      <div
        className="
          mt-6 grid gap-6
          xl:grid-cols-[1.4fr_.6fr]
        "
      >
        <ChartPanel
          title="Change From Baseline"
          description="
            Eventually compare each day's
            activity against the expected
            value for the same weekday
            and time.
          "
          height="h-[300px]"
        />

        <section
          className="
            glass-panel rounded-2xl
            border border-white/[0.07]
            p-5
          "
        >
          <div
            className="
              text-xs font-semibold
              uppercase
              tracking-[0.18em]
              text-cyan-400
            "
          >
            Research Notes
          </div>

          <h2
            className="
              mt-2 text-lg font-semibold
              text-white
            "
          >
            GTA VI impact window
          </h2>

          <p
            className="
              mt-3 text-sm
              leading-6 text-slate-500
            "
          >
            This space could eventually
            display the baseline average,
            launch-day deviation, percentage
            change, and statistical
            significance for the selected
            title.
          </p>

          <div
            className="
              mt-5 rounded-xl
              border border-violet-400/10
              bg-violet-400/[0.04]
              p-4
              text-sm text-violet-200
            "
          >
            Example: “FiveM activity was
            18.4% below its normal Thursday
            8 PM baseline.”
          </div>
        </section>
      </div>
    </>
  );
}