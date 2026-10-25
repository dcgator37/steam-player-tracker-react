import { useState } from "react";

import { useDashboardSummary } from "../hooks/useDashboardSummary";

import PageHeader
  from "../components/PageHeader";

import StatCard
  from "../components/StatCard";

import ChartPanel
  from "../components/ChartPanel";

import SelectField
  from "../components/SelectField";

import ProfileSpotlightCard
  from "../components/ProfileSpotlightCard";

import Top100DailyChart from "../components/Top100DailyChart";

import LatestTop100Card from "../components/LatestTop100Card";

import LargestLibraryCard from "../components/LargestLibraryCard";

import MostPlaytimeCard
  from "../components/MostPlaytimeCard";

import HighestUnplayedCard
  from "../components/HighestUnplayedCard";

import { useProfileSpotlights } from "../hooks/useProfileSpotlights";

const timeOptions = [
  {
    value: "16:00",
    label: "4:00 PM ET"
  },
  {
    value: "18:00",
    label: "6:00 PM ET"
  },
  {
    value: "20:00",
    label: "8:00 PM ET"
  },
  {
    value: "20:15",
    label: "8:15 PM ET"
  },
  {
    value: "20:30",
    label: "8:30 PM ET"
  },
  {
    value: "20:45",
    label: "8:45 PM ET"
  },
  {
    value: "21:00",
    label: "9:00 PM ET"
  },
  {
    value: "21:15",
    label: "9:15 PM ET"
  },
  {
    value: "21:30",
    label: "9:30 PM ET"
  },
  {
    value: "21:45",
    label: "9:45 PM ET"
  },
  {
    value: "22:00",
    label: "10:00 PM ET"
  },
  {
    value: "00:00",
    label: "12:00 AM ET"
  }
];


const rangeOptions = [
  {
    value: "7",
    label: "7 days"
  },
  {
    value: "14",
    label: "14 days"
  },
  {
    value: "30",
    label: "30 days"
  },
  {
    value: "60",
    label: "60 days"
  },
   {
    value: "90",
    label: "90 days"
  },
  {
    value: "all",
    label: "All data"
  }
];

function formatTimeLabel(
  time
) {

  const [
    hourString,
    minute
  ] =
    time.split(":");


  const hour =
    Number(hourString);


  const period =
    hour >= 12
      ? "PM"
      : "AM";


  const displayHour =
    hour === 0
      ? 12
      : hour > 12
        ? hour - 12
        : hour;


  return (
    `${displayHour}:${minute} ${period} ET`
  );
}

function formatNumber(
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
      maximumFractionDigits: 1
    }
  ).format(value);
}


export default function DashboardPage() {

  const [time, setTime] =
    useState("20:00");

  const [range, setRange] =
    useState("30");

  const {
    data: summary,
    isPending: summaryPending,
    isError: summaryError
  } = useDashboardSummary();

  const {
  data: spotlights,
  isPending: spotlightsPending,
  isError: spotlightsError
} =
  useProfileSpotlights();


  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Steam Player Intelligence"
        description="
          Track Steam activity before,
          during, and after the release
          of Grand Theft Auto VI.
        "
      />


      <div
        className="
          mb-8 grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <LatestTop100Card />

        <StatCard
          label="Profiles Analyzed"
          value={
            summaryPending ? "-" : formatNumber(summary?.profilesAnalyzed)
          }
          detail="Profiles with usable playtime"
          accent="violet"
        />

        <StatCard
          label="Owned Games"
          value={
            summaryPending ? "-" : formatCompactNumber(summary?.ownedGames)
          }
          detail={`Across analyzed profiles. Average library size ${summaryPending ? "-" : formatNumber(summary?.avgLibrarySize)} games.`}
          accent="emerald"
        />

        <StatCard
          label="Unplayed Games"
          value={
            summaryPending ? "-" : formatCompactNumber(summary?.unplayedGames)
          }
          detail={`Zero recorded playtime. Unplayed percentage ${summaryPending ? "-" : formatNumber(summary?.unplayedPercentage)}%`}
          accent="amber"
        />
      </div>


      <ChartPanel

  title="Top 100 Steam Player Activity"

  description={
    `Combined concurrent players across the ` +
    `100 most-played Steam games, sampled ` +
    `near ${formatTimeLabel(time)} each day.`
  }

  height="h-[420px]"

  controls={
    <>

      <SelectField

        label="Daily sample"

        value={time}

        onChange={
          event =>
            setTime(
              event.target.value
            )
        }

        options={
          timeOptions
        }
      />


      <SelectField

        label="Range"

        value={range}

        onChange={
          event =>
            setRange(
              event.target.value
            )
        }

        options={
          rangeOptions
        }
      />

    </>
  }
>

  <Top100DailyChart
    time={time}
    days={range}
  />

</ChartPanel>


      <section className="mt-10">
        <div
          className="
            mb-5 flex items-end
            justify-between
          "
        >
          <div>
            <div
              className="
                text-xs font-semibold
                uppercase
                tracking-[0.2em]
                text-violet-400
              "
            >
              Profile dataset
            </div>

            <h2
              className="
                mt-1 text-2xl
                font-semibold text-white
              "
            >
              Interesting Players
            </h2>
          </div>

          <button
            className="
              text-sm text-slate-500
              transition
              hover:text-slate-200
            "
          >
            Refresh examples
          </button>
        </div>


        <div
          className="
            grid gap-4
            lg:grid-cols-3
          "
        >
            <LargestLibraryCard

              profile={
                spotlights
                  ?.largestLibrary
              }

              isLoading={
                spotlightsPending
              }

              isError={
                spotlightsError
              }

            />

            <MostPlaytimeCard

              profile={
                spotlights
                  ?.mostPlaytime
              }

              isLoading={
                spotlightsPending
              }

              isError={
                spotlightsError
              }

            />


            <HighestUnplayedCard

              profile={
                spotlights
                  ?.highestUnplayedPercentage
              }

              isLoading={
                spotlightsPending
              }

              isError={
                spotlightsError
              }

            />

          <ProfileSpotlightCard
            category="Biggest Backlog"
            title="Profile placeholder"
            metric="—% unplayed"
            description="
              Surface an interesting
              profile with a large
              percentage of untouched
              games.
            "
            accent="amber"
          />
        </div>
      </section>
    </>
  );
}