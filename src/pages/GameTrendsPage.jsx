import {
  useEffect,
  useState
} from "react";

import {
  useQuery
} from "@tanstack/react-query";

import {
  useSearchParams
} from "react-router-dom";


import PageHeader
  from "../components/PageHeader";

import StatCard
  from "../components/StatCard";

import ChartPanel
  from "../components/ChartPanel";

import GamePlayerTrendChart
  from "../components/GamePlayerTrendChart";

import GameRankTrendChart
  from "../components/GameRankTrendChart";


import {
  fetchGameTrend,
  searchTrackedGames
} from "../lib/api";


function useDebouncedValue(
  value,
  delay = 300
) {

  const [
    debounced,
    setDebounced
  ] =
    useState(value);


  useEffect(
    () => {

      const timeout =
        setTimeout(
          () => {

            setDebounced(
              value
            );

          },
          delay
        );


      return () =>
        clearTimeout(
          timeout
        );

    },
    [
      value,
      delay
    ]
  );


  return debounced;
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


function formatDateTime(
  value
) {

  if (!value) {

    return "No snapshot";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",

      timeZoneName:
        "short",

      timeZone:
        "America/New_York"
    }
  ).format(
    new Date(value)
  );
}


function signedCompact(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "—";
  }


  const prefix =
    value > 0
      ? "+"
      : "";


  return `${prefix}${formatCompact(
    value
  )}`;
}


export default function GameTrendsPage() {

  const [
    searchParams,
    setSearchParams
  ] =
    useSearchParams();


  const selectedAppId =
    searchParams.get(
      "appid"
    ) || "";


  const [
    search,
    setSearch
  ] =
    useState("");


  const [
    searchOpen,
    setSearchOpen
  ] =
    useState(false);


  const debouncedSearch =
    useDebouncedValue(
      search
    );


  const [
    days,
    setDays
  ] =
    useState("30");


  const [
    sampling,
    setSampling
  ] =
    useState(
      "daily"
    );


  const [
    time,
    setTime
  ] =
    useState(
      "20:00"
    );


  const searchQuery =
    useQuery({

      queryKey: [
        "steam",
        "game-search",
        debouncedSearch
      ],

      queryFn: () =>
        searchTrackedGames(
          debouncedSearch
        ),

      enabled:
        debouncedSearch
          .trim()
          .length > 0,

      staleTime:
        60 * 1000
    });


  const trendQuery =
    useQuery({

      queryKey: [
        "steam",
        "game-trend",
        {
          appid:
            selectedAppId,

          days,

          sampling,

          time:
            sampling ===
            "daily"
              ? time
              : null
        }
      ],

      queryFn: () =>
        fetchGameTrend({

          appid:
            selectedAppId,

          days,

          sampling,

          time
        }),

      enabled:
        Boolean(
          selectedAppId
        ),

      staleTime:
        2 * 60 * 1000,

      refetchOnWindowFocus:
        false
    });


  useEffect(
    () => {

      if (
        trendQuery.data?.game &&
        !search
      ) {

        setSearch(
          trendQuery
            .data
            .game
            .name ||
          String(
            trendQuery
              .data
              .game
              .appid
          )
        );
      }

    },
    [
      trendQuery.data,
      search
    ]
  );


  function selectGame(
    game
  ) {

    setSearch(
      game.name ||
      String(
        game.appid
      )
    );


    setSearchOpen(
      false
    );


    setSearchParams({
      appid:
        String(
          game.appid
        )
    });
  }


  function handleSearchSubmit(
    event
  ) {

    event.preventDefault();


    const value =
      search.trim();


    if (!value) {
      return;
    }


    /*
     * Direct AppID entry.
     */
    if (
      /^\d+$/.test(
        value
      )
    ) {

      setSearchOpen(
        false
      );


      setSearchParams({
        appid:
          value
      });

      return;
    }


    /*
     * Enter selects best matching result.
     */
    const first =
      searchQuery
        .data
        ?.games
        ?.[0];


    if (first) {

      selectGame(
        first
      );
    }
  }


  const data =
    trendQuery.data;


  const summary =
    data?.summary;


  const rangeLabel =
    days === "all"
      ? "All collected data"
      : `${days}-day range`;


  return (
    <>

      <PageHeader

        eyebrow="Game Trends"

        title="Steam Player Trends"

        description="
          Explore concurrent-player and
          Top-100 ranking history for
          individual Steam games.
        "

      />


      {/* SEARCH + CONTROLS */}

      <section
        className="
          glass-panel mb-6
          rounded-2xl
          border border-white/[0.07]
          p-5
        "
      >

        <div
          className="
            grid gap-4
            xl:grid-cols-[1.6fr_.7fr_.9fr_.8fr]
          "
        >

          <div
            className="relative"
          >

            <div
              className="
                mb-2 text-[10px]
                font-medium uppercase
                tracking-[0.15em]
                text-slate-500
              "
            >
              Game
            </div>


            <form
              onSubmit={
                handleSearchSubmit
              }
            >

              <input

                value={
                  search
                }

                onChange={
                  event => {

                    setSearch(
                      event.target.value
                    );

                    setSearchOpen(
                      true
                    );
                  }
                }

                onFocus={
                  () =>
                    setSearchOpen(
                      true
                    )
                }

                placeholder="
                  Search title or AppID...
                "

                className="
                  w-full rounded-xl
                  border border-white/10
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

            </form>


            {searchOpen &&
             search.trim() &&
             searchQuery
               .data
               ?.games
               ?.length > 0 && (

              <div
                className="
                  absolute left-0 right-0
                  top-full z-30 mt-2
                  max-h-80
                  overflow-y-auto
                  rounded-xl border
                  border-white/10
                  bg-[#080d1a]
                  shadow-2xl
                "
              >

                {searchQuery
                  .data
                  .games
                  .map(
                    game => (

                      <button

                        key={
                          game.appid
                        }

                        type="button"

                        onClick={
                          () =>
                            selectGame(
                              game
                            )
                        }

                        className="
                          flex w-full
                          items-center
                          justify-between
                          gap-4
                          border-b
                          border-white/[0.05]
                          px-4 py-3
                          text-left
                          transition
                          last:border-0
                          hover:bg-white/[0.04]
                        "
                      >

                        <div
                          className="
                            min-w-0
                          "
                        >

                          <div
                            className="
                              truncate
                              text-sm
                              font-medium
                              text-slate-200
                            "
                          >
                            {game.name ||
                             `App ${game.appid}`}
                          </div>


                          <div
                            className="
                              mt-0.5
                              font-mono
                              text-[10px]
                              text-slate-600
                            "
                          >
                            AppID {game.appid}
                          </div>

                        </div>


                        <div
                          className="
                            text-xs
                            text-slate-600
                          "
                        >
                          Select
                        </div>

                      </button>

                    )
                  )}

              </div>

            )}

          </div>


          <label>

            <div
              className="
                mb-2 text-[10px]
                font-medium uppercase
                tracking-[0.15em]
                text-slate-500
              "
            >
              Range
            </div>


            <select

              value={
                days
              }

              onChange={
                event =>
                  setDays(
                    event.target.value
                  )
              }

              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-950
                px-4 py-3
                text-sm text-slate-300
                outline-none
              "
            >

              <option value="7">
                7 days
              </option>

              <option value="14">
                14 days
              </option>

              <option value="30">
                30 days
              </option>

              <option value="60">
                60 days
              </option>

              <option value="90">
                90 days
              </option>

              <option value="180">
                180 days
              </option>

              <option value="all">
                All data
              </option>

            </select>

          </label>


          <label>

            <div
              className="
                mb-2 text-[10px]
                font-medium uppercase
                tracking-[0.15em]
                text-slate-500
              "
            >
              Sampling
            </div>


            <select

              value={
                sampling
              }

              onChange={
                event =>
                  setSampling(
                    event.target.value
                  )
              }

              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-950
                px-4 py-3
                text-sm text-slate-300
                outline-none
              "
            >

              <option value="daily">
                Daily snapshot
              </option>

              <option value="all">
                Every 15 minutes
              </option>

            </select>

          </label>


          <label>

            <div
              className="
                mb-2 text-[10px]
                font-medium uppercase
                tracking-[0.15em]
                text-slate-500
              "
            >
              Daily Time
            </div>


            <select

              value={
                time
              }

              disabled={
                sampling !==
                "daily"
              }

              onChange={
                event =>
                  setTime(
                    event.target.value
                  )
              }

              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-950
                px-4 py-3
                text-sm text-slate-300
                outline-none
                disabled:cursor-not-allowed
                disabled:opacity-35
              "
            >

              <option value="16:00">
                4:00 PM ET
              </option>

              <option value="18:00">
                6:00 PM ET
              </option>

              <option value="20:00">
                8:00 PM ET
              </option>

              <option value="22:00">
                10:00 PM ET
              </option>

              <option value="00:00">
                12:00 AM ET
              </option>

            </select>

          </label>

        </div>

      </section>


      {!selectedAppId && (

        <section
          className="
            glass-panel
            rounded-2xl
            border border-white/[0.07]
            py-24 text-center
          "
        >

          <div
            className="
              text-lg font-medium
              text-slate-300
            "
          >
            Select a tracked game
          </div>


          <p
            className="
              mx-auto mt-2
              max-w-md
              text-sm leading-6
              text-slate-600
            "
          >
            Search for a Steam game above
            to view its concurrent-player
            and ranking history.
          </p>

        </section>

      )}


      {selectedAppId &&
       trendQuery.isPending && (

        <div
          className="
            py-24 text-center
            text-sm text-slate-500
          "
        >
          Loading game trend data...
        </div>

      )}


      {trendQuery.isError && (

        <div
          className="
            rounded-2xl border
            border-red-400/10
            bg-red-400/[0.04]
            p-6
            text-red-400
          "
        >
          {trendQuery
            .error
            ?.message ||
            "Could not load game trend data."}
        </div>

      )}


      {data && (

        <>

          {/* GAME HEADER */}

          <section
            className="
              glass-panel mb-6
              rounded-2xl
              border border-white/[0.07]
              p-5
            "
          >

            <div
              className="
                flex flex-col
                justify-between gap-4
                sm:flex-row
                sm:items-center
              "
            >

              <div>

                <div
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-cyan-400
                  "
                >
                  Steam AppID{" "}
                  {data.game.appid}
                </div>


                <h2
                  className="
                    mt-1 text-2xl
                    font-semibold
                    text-white
                  "
                >
                  {data.game.name}
                </h2>


                <div
                  className="
                    mt-2 text-xs
                    text-slate-500
                  "
                >
                  {sampling ===
                   "daily"
                    ? `Daily sample near ${time} Eastern`
                    : "Every stored 15-minute snapshot"}
                  {" • "}
                  {rangeLabel}
                </div>

              </div>


              <div
                className="
                  rounded-full
                  border border-amber-400/10
                  bg-amber-400/[0.04]
                  px-3 py-1.5
                  text-xs text-amber-300
                "
              >
                GTA VI • Nov 19, 2026
              </div>

            </div>

          </section>


          {/* STAT CARDS */}

          <div
            className="
              mb-6 grid gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <StatCard

              label="Latest Players"

              value={
                summary
                  ?.currentlyTracked
                  ? formatCompact(
                      summary
                        .currentPlayers
                    )
                  : "Outside Top 100"
              }

              detail={
                formatDateTime(
                  summary
                    ?.latestSnapshotAt
                )
              }

              accent="cyan"
            />


            <StatCard

              label="Latest Rank"

              value={
                summary
                  ?.currentlyTracked
                  ? `#${summary.currentRank}`
                  : "> 100"
              }

              detail={
                summary
                  ?.currentlyTracked
                  ? `${formatNumber(
                      summary.currentPlayers
                    )} concurrent players`
                  : summary
                      ?.lastTrackedAt
                    ? `Last tracked ${formatDateTime(
                        summary.lastTrackedAt
                      )}`
                    : "Not recently tracked"
              }

              accent="violet"
            />


            <StatCard

              label="Range Peak"

              value={
                formatCompact(
                  summary
                    ?.rangePeakPlayers
                )
              }

              detail={
                `${rangeLabel} • ${summary?.trackedPointCount ?? 0} tracked points`
              }

              accent="emerald"
            />


            <StatCard

              label="Range Change"

              value={
                signedCompact(
                  summary
                    ?.rangeChangePlayers
                )
              }

              detail={
                summary
                  ?.rangeChangePercentage !==
                null
                  ? `${summary.rangeChangePercentage > 0 ? "+" : ""}${summary.rangeChangePercentage}% first → last tracked point`
                  : "Not enough data"
              }

              accent="amber"
            />

          </div>


          {!summary
             ?.currentlyTracked && (

            <div
              className="
                mb-6 rounded-xl
                border border-slate-500/10
                bg-slate-500/[0.04]
                px-4 py-3
                text-sm leading-6
                text-slate-400
              "
            >
              This game is not present in
              the latest Top 100 snapshot.
              Gaps in the charts represent
              snapshots where the game was
              outside the Top 100, not zero
              concurrent players.
            </div>

          )}


          {/* PLAYER CHART */}

          <div className="mb-6">

            <ChartPanel

              title={`${data.game.name} — Concurrent Players`}

              description={
                sampling ===
                "daily"
                  ? "Player count at the selected Eastern time. The dashed line is a trailing seven-day baseline based on prior daily observations."
                  : "Every stored 15-minute observation while tracking the Steam Top 100."
              }

              height="h-[440px]"
            >

              <GamePlayerTrendChart

                points={
                  data.points
                }

                sampling={
                  sampling
                }
              />

            </ChartPanel>

          </div>


          {/* RANK CHART */}

          <ChartPanel

            title="Steam Top 100 Rank"

            description="
              Rank #1 is shown at the top.
              Missing sections mean the game
              was outside the tracked Top 100.
            "

            height="h-[340px]"
          >

            <GameRankTrendChart

              points={
                data.points
              }

            />

          </ChartPanel>

        </>

      )}

    </>
  );
}