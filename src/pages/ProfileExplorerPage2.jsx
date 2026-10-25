import { useState } from "react";

import PageHeader
  from "../components/PageHeader";

import StatCard
  from "../components/StatCard";

import ChartPanel
  from "../components/ChartPanel";


export default function ProfileExplorerPage() {

  const [search, setSearch] =
    useState("");


  function handleSubmit(event) {

    event.preventDefault();

    /*
     * You can plug your TanStack Query
     * or mutation logic in here.
     */
  }


  return (
    <>
      <PageHeader
        eyebrow="Profile Explorer"
        title="Analyze a Steam Library"
        description="
          Search by SteamID64 or persona
          name to inspect a player's game
          library and playtime behavior.
        "
      />


      <section
        className="
          glass-panel mb-8
          rounded-2xl border
          border-white/[0.07]
          p-5
        "
      >
        <form
          onSubmit={handleSubmit}
          className="
            flex flex-col gap-3
            sm:flex-row
          "
        >
          <input
            value={search}
            onChange={
              event =>
                setSearch(
                  event.target.value
                )
            }
            placeholder="
              SteamID64 or persona name
            "
            className="
              min-w-0 flex-1
              rounded-xl border
              border-white/10
              bg-slate-950/70
              px-4 py-3
              text-sm text-white
              outline-none
              placeholder:text-slate-600
              focus:border-cyan-400/50
              focus:ring-2
              focus:ring-cyan-400/10
            "
          />

          <button
            type="submit"
            className="
              rounded-xl
              bg-gradient-to-r
              from-cyan-400
              to-cyan-300
              px-6 py-3
              text-sm font-semibold
              text-slate-950
              shadow-lg
              shadow-cyan-500/10
              transition
              hover:brightness-110
            "
          >
            Analyze Profile
          </button>
        </form>
      </section>


      <section
        className="
          glass-panel mb-6
          rounded-2xl border
          border-white/[0.07]
          p-6
        "
      >
        <div
          className="
            flex flex-col
            justify-between gap-5
            sm:flex-row
            sm:items-center
          "
        >
          <div
            className="
              flex items-center gap-4
            "
          >
            <div
              className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-slate-700
                to-slate-900
                text-xl font-semibold
                text-slate-400
              "
            >
              ?
            </div>

            <div>
              <h2
                className="
                  text-xl font-semibold
                  text-white
                "
              >
                Search for a profile
              </h2>

              <p
                className="
                  mt-1 text-sm
                  text-slate-500
                "
              >
                Profile details will appear
                here.
              </p>
            </div>
          </div>

          <div
            className="
              rounded-full border
              border-white/10
              bg-white/[0.03]
              px-3 py-1.5
              text-xs text-slate-500
            "
          >
            Playtime status: —
          </div>
        </div>
      </section>


      <div
        className="
          mb-6 grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          label="Games Owned"
          value="—"
        />

        <StatCard
          label="Total Playtime"
          value="—"
          accent="violet"
        />

        <StatCard
          label="Median Playtime"
          value="—"
          accent="emerald"
        />

        <StatCard
          label="Never Played"
          value="—"
          accent="amber"
        />
      </div>


      <div
        className="
          grid gap-6
          xl:grid-cols-2
        "
      >
        <ChartPanel
          title="Library Playtime Distribution"
          description="
            Visualize games by playtime
            bucket.
          "
          height="h-[320px]"
        />

        <ChartPanel
          title="Played vs. Unplayed"
          description="
            A simple library composition
            visualization.
          "
          height="h-[320px]"
        />
      </div>


      <section
        className="
          glass-panel mt-6
          overflow-hidden rounded-2xl
          border border-white/[0.07]
        "
      >
        <div
          className="
            border-b border-white/[0.06]
            px-5 py-4
          "
        >
          <h2
            className="
              font-semibold text-white
            "
          >
            Game Library
          </h2>

          <p
            className="
              mt-1 text-sm
              text-slate-500
            "
          >
            You can later add sorting by
            playtime, title, and last played.
          </p>
        </div>

        <div
          className="
            py-16 text-center
            text-sm text-slate-600
          "
        >
          Game rows will appear here.
        </div>
      </section>
    </>
  );
}