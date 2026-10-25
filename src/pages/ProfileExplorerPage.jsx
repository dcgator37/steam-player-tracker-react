import {
  use,
  useEffect,
  useState
} from "react";

import {
  useQuery,
  useMutation,
  useQueryClient
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

import PlaytimeDistributionChart
  from "../components/profile/PlaytimeDistributionChart";

import TopGamesChart
  from "../components/profile/TopGamesChart";

import {
  searchProfiles,
  fetchProfile,
  fetchProfileAnalysis,
  fetchProfileGames,
  fetchAdminSession,
  refreshProfile
} from "../lib/api";


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


function formatHours(
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
      maximumFractionDigits:
        1
    }
  ).format(value);
}


function formatMinutesAsHours(
  minutes
) {

  if (
    minutes === null ||
    minutes === undefined
  ) {

    return "—";
  }


  return `${formatHours(
    minutes / 60
  )} hrs`;
}


function formatDate(
  value
) {

  if (!value) {
    return "Never";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric"
    }
  ).format(
    new Date(value)
  );
}

function formatDateTime(
  value
) {

  if (!value) {
    return "Unknown";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit"
    }
  ).format(
    new Date(value)
  );
}


function useDebouncedValue(
  value,
  delay = 350
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


function PlaytimeBadge({
  profile
}) {

  if (
    !profile.gamesVisible
  ) {

    return (

      <span
        className="
          rounded-full
          border border-slate-500/20
          bg-slate-500/10
          px-3 py-1
          text-xs text-slate-400
        "
      >
        Game library private
      </span>
    );
  }


  if (
    profile.playtimeAvailable ===
    true
  ) {

    return (

      <span
        className="
          flex items-center gap-2
          rounded-full
          border border-emerald-400/15
          bg-emerald-400/[0.06]
          px-3 py-1
          text-xs text-emerald-400
        "
      >

        <span
          className="
            h-1.5 w-1.5
            rounded-full
            bg-emerald-400
          "
        />

        Playtime available

      </span>
    );
  }


  return (

    <span
      className="
        rounded-full
        border border-amber-400/15
        bg-amber-400/[0.06]
        px-3 py-1
        text-xs text-amber-400
      "
    >
      Playtime unavailable
    </span>
  );
}


function SortButton({

  label,
  column,
  currentSort,
  currentOrder,
  onSort

}) {

  const active =
    currentSort ===
    column;


  return (

    <button

      type="button"

      onClick={
        () =>
          onSort(
            column
          )
      }

      className="
        flex items-center
        gap-1.5
        text-left
        font-medium
        text-slate-400
        transition
        hover:text-white
      "
    >

      {label}


      {active && (

        <span
          className="
            text-cyan-400
          "
        >
          {currentOrder ===
           "asc"
            ? "↑"
            : "↓"}
        </span>

      )}

    </button>
  );
}


export default function ProfileExplorerPage() {

  const queryClient = useQueryClient();

  const adminSessionQuery = useQuery({
    queryKey: [
      "admin",
      "session"
    ],

    queryFn: fetchAdminSession,

    staleTime: 60 * 1000,

    retry: false
  });

  const isAdmin = adminSessionQuery.data?.authenticated === true;

  const [
    searchParams,
    setSearchParams
  ] =
    useSearchParams();


  const selectedSteamId =
    searchParams.get(
      "steamid"
    ) || "";


  const [
    search,
    setSearch
  ] =
    useState("");


  const [
    submittedSearch,
    setSubmittedSearch
  ] =
    useState("");


  const [
    gameSearch,
    setGameSearch
  ] =
    useState("");


  const debouncedGameSearch =
    useDebouncedValue(
      gameSearch
    );


  const [
    page,
    setPage
  ] =
    useState(1);


  const [
    pageSize,
    setPageSize
  ] =
    useState(25);


  const [
    sort,
    setSort
  ] =
    useState(
      "playtime"
    );


  const [
    order,
    setOrder
  ] =
    useState(
      "desc"
    );


  /*
   * Reset table pagination if the
   * selected profile changes.
   */
  useEffect(
    () => {

      setPage(1);
      setGameSearch("");

    },
    [
      selectedSteamId
    ]
  );


  useEffect(
    () => {

      setPage(1);

    },
    [
      debouncedGameSearch
    ]
  );


  const searchQuery =
    useQuery({

      queryKey: [
        "profiles",
        "search",
        submittedSearch
      ],

      queryFn: () =>
        searchProfiles(
          submittedSearch
        ),

      enabled:
        Boolean(
          submittedSearch
        ),

      staleTime:
        60 * 1000
    });


  const profileQuery =
    useQuery({

      queryKey: [
        "profiles",
        selectedSteamId
      ],

      queryFn: () =>
        fetchProfile(
          selectedSteamId
        ),

      enabled:
        Boolean(
          selectedSteamId
        )
    });


  const analysisQuery =
    useQuery({

      queryKey: [
        "profiles",
        selectedSteamId,
        "analysis"
      ],

      queryFn: () =>
        fetchProfileAnalysis(
          selectedSteamId
        ),

      enabled:
        Boolean(
          selectedSteamId
        )
    });


  const gamesQuery =
    useQuery({

      queryKey: [
        "profiles",
        selectedSteamId,
        "games",
        {
          page,
          pageSize,
          search:
            debouncedGameSearch,
          sort,
          order
        }
      ],

      queryFn: () =>
        fetchProfileGames({

          steamid:
            selectedSteamId,

          page,

          limit:
            pageSize,

          search:
            debouncedGameSearch,

          sort,

          order
        }),

      enabled:
        Boolean(
          selectedSteamId &&
          profileQuery.data
            ?.gamesVisible
        )
    });

    const refreshProfileMutation = useMutation({
      mutationKey: [
        "profiles",
        "refresh"
      ],

      mutationFn: refreshProfile,

      onSuccess: async (data, steamid) => {
        /*
          refresh basic profile
        */

        await queryClient.refetchQueries({
          queryKey: [
            "profiles",
            steamid
          ],
          
          exact: true
        });

        //refresh/invalidate everything from that profile
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "profiles",
              steamid,
              "analysis"
            ]
          }),
          queryClient.invalidateQueries({
            queryKey: [
              "profiles",
              steamid,
              "games"
            ]
          }),
          queryClient.invalidateQueries({
            queryKey: [
              "profiles",
              "search"
            ]
          }),
          queryClient.invalidateQueries({
            queryKey: [
              "dashboard",
              "summary"
            ]
          }),
            queryClient.invalidateQueries({
            queryKey: [
              "dashboard",
              "profile-spotlights"
            ]
          })
        ]);


      }
    });

  const refreshIsForSelectedProfile =
  refreshProfileMutation.variables ===
  selectedSteamId;

  function handleRefreshProfile() {

  if (
    !selectedSteamId ||
    refreshProfileMutation.isPending
  ) {

    return;
  }


  refreshProfileMutation.mutate(
    selectedSteamId
  );
}


  function handleSearch(
    event
  ) {

    event.preventDefault();


    const value =
      search.trim();


    if (!value) {
      return;
    }


    /*
     * SteamID64:
     * go directly to profile.
     */
    if (
      /^\d{16,20}$/
        .test(value)
    ) {

      setSubmittedSearch("");

      setSearchParams({
        steamid:
          value
      });

      return;
    }


    /*
     * Persona:
     * search locally collected
     * profile names.
     */
    setSubmittedSearch(
      value
    );
  }


  function selectProfile(
    profile
  ) {

    setSearch(
      profile.personaname ||
      profile.steamid
    );


    setSubmittedSearch("");


    setSearchParams({
      steamid:
        profile.steamid
    });
  }


  function handleSort(
    column
  ) {

    setPage(1);


    if (
      sort === column
    ) {

      setOrder(
        previous =>
          previous === "asc"
            ? "desc"
            : "asc"
      );

      return;
    }


    setSort(
      column
    );


    setOrder(
      column === "name"
        ? "asc"
        : "desc"
    );
  }


  const profile =
    profileQuery.data;


  const analysis =
    analysisQuery.data;


  const games =
    gamesQuery.data;


  const playtimeAvailable =
    analysis
      ?.playtimeAvailable ===
      true;


  return (
    <>

      <PageHeader

        eyebrow="Profile Explorer"

        title="Analyze a Steam Library"

        description="
          Search collected profiles by
          SteamID64 or persona name and
          explore library size, playtime,
          backlog behavior, and individual
          games.
        "

      />


      {/* SEARCH */}

      <section
        className="
          glass-panel relative
          mb-8 rounded-2xl
          border border-white/[0.07]
          p-5
        "
      >

        <form
          onSubmit={
            handleSearch
          }
          className="
            flex flex-col gap-3
            sm:flex-row
          "
        >

          <input

            value={
              search
            }

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
              transition
              hover:brightness-110
            "
          >
            Find Profile
          </button>

        </form>


        {searchQuery.isPending &&
         submittedSearch && (

          <div
            className="
              mt-4 text-sm
              text-slate-500
            "
          >
            Searching collected profiles...
          </div>

        )}


        {searchQuery.data &&
         submittedSearch && (

          <div
            className="
              mt-4 overflow-hidden
              rounded-xl border
              border-white/[0.07]
              bg-slate-950/70
            "
          >

            {searchQuery
              .data
              .profiles
              .length === 0
              ? (

                <div
                  className="
                    px-4 py-5
                    text-sm
                    text-slate-500
                  "
                >
                  No collected profiles
                  matched that persona name.
                </div>

              )
              : (

                searchQuery
                  .data
                  .profiles
                  .map(
                    result => (

                      <button

                        key={
                          result.steamid
                        }

                        type="button"

                        onClick={
                          () =>
                            selectProfile(
                              result
                            )
                        }

                        className="
                          flex w-full
                          items-center gap-3
                          border-b
                          border-white/[0.05]
                          px-4 py-3
                          text-left
                          transition
                          last:border-0
                          hover:bg-white/[0.04]
                        "
                      >

                        {result.avatarUrl
                          ? (

                            <img

                              src={
                                result.avatarUrl
                              }

                              alt=""

                              className="
                                h-10 w-10
                                rounded-lg
                                bg-slate-900
                              "
                            />

                          )
                          : (

                            <div
                              className="
                                flex h-10 w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-slate-900
                                text-slate-600
                              "
                            >
                              ?
                            </div>

                          )}


                        <div
                          className="
                            min-w-0 flex-1
                          "
                        >

                          <div
                            className="
                              truncate
                              font-medium
                              text-slate-200
                            "
                          >
                            {result.personaname}
                          </div>


                          <div
                            className="
                              mt-0.5
                              font-mono
                              text-xs
                              text-slate-600
                            "
                          >
                            {result.steamid}
                          </div>

                        </div>


                        <div
                          className="
                            text-xs
                            text-slate-500
                          "
                        >
                          {result.reportedGameCount
                            ?? "—"}{" "}
                          games
                        </div>

                      </button>

                    )
                  )
              )}

          </div>

        )}

      </section>


      {!selectedSteamId && (

        <section
          className="
            glass-panel
            rounded-2xl
            border border-white/[0.07]
            py-20 text-center
          "
        >

          <div
            className="
              mx-auto flex
              h-14 w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/10
              bg-cyan-400/[0.04]
              text-xl
              text-cyan-400
            "
          >
            ?
          </div>


          <div
            className="
              mt-4
              font-medium
              text-slate-300
            "
          >
            Search for a Steam profile
          </div>


          <div
            className="
              mt-1 text-sm
              text-slate-600
            "
          >
            Enter a SteamID64 or a persona
            name above.
          </div>

        </section>

      )}


      {selectedSteamId &&
       profileQuery.isPending && (

        <div
          className="
            py-24 text-center
            text-sm text-slate-500
          "
        >
          Loading Steam profile...
        </div>

      )}


      {profileQuery.isError && (

        <section
          className="
            rounded-2xl border
            border-red-400/10
            bg-red-400/[0.04]
            p-6 text-red-400
          "
        >
          {profileQuery
            .error
            ?.message ||
            "Could not load profile."}
        </section>

      )}


      {profile && (

        <>

          {/* PROFILE HEADER */}

          <section
            className="
              glass-panel mb-6
              rounded-2xl
              border border-white/[0.07]
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
                  flex items-center
                  gap-4
                "
              >

                {profile.avatarUrl
                  ? (

                    <img

                      src={
                        profile.avatarUrl
                      }

                      alt=""

                      className="
                        h-20 w-20
                        rounded-2xl
                        border
                        border-white/10
                        bg-slate-900
                      "
                    />

                  )
                  : (

                    <div
                      className="
                        flex h-20 w-20
                        items-center
                        justify-center
                        rounded-2xl
                        bg-slate-900
                        text-2xl
                        text-slate-600
                      "
                    >
                      ?
                    </div>

                  )}


                <div>

                  <h2
                    className="
                      text-2xl
                      font-semibold
                      tracking-tight
                      text-white
                    "
                  >
                    {profile.personaname}
                  </h2>


                  <div
                    className="
                      mt-1 font-mono
                      text-xs
                      text-slate-600
                    "
                  >
                    {profile.steamid}
                  </div>


                  <div
                    className="
                      mt-3 flex
                      flex-wrap gap-2
                    "
                  >

                    <PlaytimeBadge
                      profile={
                        profile
                      }
                    />


                    {profile.profileUrl && (

                      <a

                        href={
                          profile.profileUrl
                        }

                        target="_blank"

                        rel="noreferrer"

                        className="
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.03]
                          px-3 py-1
                          text-xs
                          text-slate-400
                          transition
                          hover:text-white
                        "
                      >
                        Open Steam ↗
                      </a>

                    )}

                 {isAdmin && (

    <button

      type="button"

      onClick={
        handleRefreshProfile
      }

      disabled={
        refreshProfileMutation
          .isPending
      }

      className="
        flex items-center gap-1.5
        rounded-full
        border
        border-cyan-400/20
        bg-cyan-400/[0.06]
        px-3 py-1
        text-xs
        text-cyan-300
        transition
        hover:border-cyan-400/40
        hover:bg-cyan-400/[0.1]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >

      <span
        className={
          refreshProfileMutation
            .isPending &&
          refreshIsForSelectedProfile

            ? "animate-spin"

            : ""
        }
      >
        ↻
      </span>


      {refreshProfileMutation
         .isPending &&
       refreshIsForSelectedProfile

        ? "Refreshing..."

        : "Refresh from Steam"}

    </button>

  )}

                  </div>

                </div>

              </div>


              <div
                className="
                  text-left
                  sm:text-right
                "
              >

                <div
                  className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  Last collected
                </div>


                <div
                  className="
                    mt-1 text-sm
                    text-slate-400
                  "
                >
                  {formatDateTime(
                    profile.lastCollectedAt
                  )}
                </div>

              </div>

            </div>

          </section>

          {refreshIsForSelectedProfile &&
 refreshProfileMutation.isSuccess && (

  <div
    className="
      mt-5 rounded-xl
      border
      border-emerald-400/10
      bg-emerald-400/[0.04]
      px-4 py-3
      text-sm
      text-emerald-300
    "
  >
    Steam profile refreshed successfully.
    Profile details, library statistics,
    and game data have been reloaded.
  </div>

)}

{refreshIsForSelectedProfile &&
 refreshProfileMutation.isError && (

  <div
    className="
      mt-5 rounded-xl
      border
      border-red-400/10
      bg-red-400/[0.04]
      px-4 py-3
      text-sm
      text-red-400
    "
  >

    {refreshProfileMutation
      .error
      ?.message ||
      "Could not refresh this Steam profile."}

  </div>

)}


          {!profile.gamesVisible && (

            <div
              className="
                mb-6 rounded-2xl
                border border-slate-500/10
                bg-slate-500/[0.04]
                p-5 text-sm
                leading-6 text-slate-400
              "
            >
              This profile's game library is
              not currently public, so library
              and playtime analysis is not
              displayed.
            </div>

          )}


          {profile.gamesVisible &&
           profile.playtimeAvailable !==
             true && (

            <div
              className="
                mb-6 rounded-2xl
                border border-amber-400/10
                bg-amber-400/[0.04]
                p-5 text-sm
                leading-6 text-amber-200
              "
            >
              The game library is public, but
              usable playtime was not available
              when this profile was collected.
              Game ownership can still be shown,
              but zero values are not being
              interpreted as unplayed games.
            </div>

          )}


          {/* STATS */}

          <div
            className="
              mb-6 grid gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <StatCard

              label="Games Owned"

              value={
                analysis
                  ? formatNumber(
                      analysis.totalGames
                    )
                  : "—"
              }

              detail="Games in collected library"

              accent="cyan"
            />


            <StatCard

              label="Total Playtime"

              value={
                playtimeAvailable
                  ? `${formatHours(
                      analysis.totalPlaytimeHours
                    )} hrs`
                  : "Unavailable"
              }

              detail={
                playtimeAvailable
                  ? "Lifetime recorded playtime"
                  : "Playtime privacy prevents analysis"
              }

              accent="violet"
            />


            <StatCard

              label="Median Playtime"

              value={
                playtimeAvailable
                  ? `${formatHours(
                      analysis.medianPlaytimeHours
                    )} hrs`
                  : "Unavailable"
              }

              detail={
                playtimeAvailable
                  ? `${formatHours(
                      analysis.medianPlayedGameHours
                    )} hrs among played games`
                  : "Playtime privacy prevents analysis"
              }

              accent="emerald"
            />


            <StatCard

              label="Never Played"

              value={
                playtimeAvailable
                  ? formatNumber(
                      analysis.neverPlayedGames
                    )
                  : "Unavailable"
              }

              detail={
                playtimeAvailable
                  ? `${analysis.neverPlayedPercentage}% of library`
                  : "Hidden playtime excluded"
              }

              accent="amber"
            />

          </div>


          {/* CHARTS */}

          {playtimeAvailable && (

            <div
              className="
                mb-6 grid gap-6
                xl:grid-cols-2
              "
            >

              <ChartPanel

                title="Library Playtime Distribution"

                description="
                  How games are distributed
                  across lifetime playtime
                  ranges.
                "

                height="h-[340px]"
              >

                <PlaytimeDistributionChart

                  data={
                    analysis
                      ?.playtimeBuckets
                  }

                />

              </ChartPanel>


              <ChartPanel

                title="Most Played Games"

                description="
                  The ten games with the
                  highest lifetime playtime
                  on this profile.
                "

                height="h-[340px]"
              >

                <TopGamesChart

                  data={
                    analysis
                      ?.topGames
                  }

                />

              </ChartPanel>

            </div>

          )}


          {/* GAME LIBRARY */}

          {profile.gamesVisible && (

            <section
              className="
                glass-panel
                overflow-hidden
                rounded-2xl
                border border-white/[0.07]
              "
            >

              <div
                className="
                  flex flex-col gap-4
                  border-b
                  border-white/[0.06]
                  p-5
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div>

                  <h2
                    className="
                      font-semibold
                      text-white
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
                    {games
                      ? `${formatNumber(
                          games.total
                        )} matching games`
                      : "Loading games..."}
                  </p>

                </div>


                <div
                  className="
                    flex flex-col gap-2
                    sm:flex-row
                  "
                >

                  <input

                    value={
                      gameSearch
                    }

                    onChange={
                      event =>
                        setGameSearch(
                          event.target.value
                        )
                    }

                    placeholder="Filter games..."

                    className="
                      rounded-xl border
                      border-white/10
                      bg-slate-950
                      px-3 py-2
                      text-sm text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-cyan-400/40
                    "
                  />


                  <select

                    value={
                      pageSize
                    }

                    onChange={
                      event => {

                        setPageSize(
                          Number(
                            event.target.value
                          )
                        );

                        setPage(1);
                      }
                    }

                    className="
                      rounded-xl border
                      border-white/10
                      bg-slate-950
                      px-3 py-2
                      text-sm text-slate-300
                    "
                  >

                    <option value="25">
                      25 rows
                    </option>

                    <option value="50">
                      50 rows
                    </option>

                    <option value="100">
                      100 rows
                    </option>

                  </select>

                </div>

              </div>


              <div
                className="
                  overflow-x-auto
                "
              >

                <table
                  className="
                    w-full min-w-[850px]
                    text-sm
                  "
                >

                  <thead
                    className="
                      bg-black/20
                      text-xs uppercase
                      tracking-wider
                    "
                  >

                    <tr>

                      <th
                        className="
                          px-5 py-3.5
                          text-left
                        "
                      >

                        <SortButton

                          label="Game"

                          column="name"

                          currentSort={
                            sort
                          }

                          currentOrder={
                            order
                          }

                          onSort={
                            handleSort
                          }

                        />

                      </th>


                      <th
                        className="
                          px-5 py-3.5
                          text-left
                        "
                      >

                        <SortButton

                          label="Lifetime"

                          column="playtime"

                          currentSort={
                            sort
                          }

                          currentOrder={
                            order
                          }

                          onSort={
                            handleSort
                          }

                        />

                      </th>


                      <th
                        className="
                          px-5 py-3.5
                          text-left
                        "
                      >

                        <SortButton

                          label="Last 2 Weeks"

                          column="recent"

                          currentSort={
                            sort
                          }

                          currentOrder={
                            order
                          }

                          onSort={
                            handleSort
                          }

                        />

                      </th>


                      <th
                        className="
                          px-5 py-3.5
                          text-left
                        "
                      >

                        <SortButton

                          label="Last Played"

                          column="lastPlayed"

                          currentSort={
                            sort
                          }

                          currentOrder={
                            order
                          }

                          onSort={
                            handleSort
                          }

                        />

                      </th>


                      <th
                        className="
                          px-5 py-3.5
                          text-right
                          text-slate-500
                        "
                      >
                        AppID
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {gamesQuery.isPending && (

                      <tr>

                        <td
                          colSpan="5"
                          className="
                            px-5 py-16
                            text-center
                            text-slate-600
                          "
                        >
                          Loading game library...
                        </td>

                      </tr>

                    )}


                    {games &&
                     games.games.length ===
                       0 && (

                      <tr>

                        <td
                          colSpan="5"
                          className="
                            px-5 py-16
                            text-center
                            text-slate-600
                          "
                        >
                          No games matched
                          your filter.
                        </td>

                      </tr>

                    )}


                    {games?.games.map(
                      game => (

                        <tr

                          key={
                            game.appid
                          }

                          className="
                            border-t
                            border-white/[0.05]
                            transition
                            hover:bg-white/[0.025]
                          "
                        >

                          <td
                            className="
                              px-5 py-4
                            "
                          >

                            <div
                              className="
                                max-w-md
                                font-medium
                                text-slate-200
                              "
                            >
                              {game.name ||
                               `App ${game.appid}`}
                            </div>

                          </td>


                          <td
                            className="
                              px-5 py-4
                              text-slate-400
                            "
                          >
                            {playtimeAvailable
                              ? formatMinutesAsHours(
                                  game
                                    .playtimeForeverMinutes
                                )
                              : "Hidden"}
                          </td>


                          <td
                            className="
                              px-5 py-4
                              text-slate-400
                            "
                          >
                            {playtimeAvailable
                              ? game
                                  .playtime2WeeksMinutes !==
                                null
                                ? formatMinutesAsHours(
                                    game
                                      .playtime2WeeksMinutes
                                  )
                                : "0 hrs"
                              : "Hidden"}
                          </td>


                          <td
                            className="
                              px-5 py-4
                              text-slate-400
                            "
                          >
                            {playtimeAvailable
                              ? formatDate(
                                  game.lastPlayedAt
                                )
                              : "Hidden"}
                          </td>


                          <td
                            className="
                              px-5 py-4
                              text-right
                              font-mono
                              text-xs
                              text-slate-600
                            "
                          >
                            {game.appid}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {games && (

                <div
                  className="
                    flex flex-col
                    items-center
                    justify-between gap-4
                    border-t
                    border-white/[0.06]
                    px-5 py-4
                    sm:flex-row
                  "
                >

                  <div
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Page{" "}
                    <span className="text-slate-300">
                      {games.page}
                    </span>{" "}
                    of{" "}
                    <span className="text-slate-300">
                      {games.totalPages}
                    </span>
                  </div>


                  <div
                    className="
                      flex gap-2
                    "
                  >

                    <button

                      type="button"

                      disabled={
                        games.page <= 1
                      }

                      onClick={
                        () =>
                          setPage(
                            previous =>
                              Math.max(
                                previous - 1,
                                1
                              )
                          )
                      }

                      className="
                        rounded-lg border
                        border-white/10
                        bg-white/[0.03]
                        px-4 py-2
                        text-xs
                        text-slate-400
                        transition
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                      "
                    >
                      Previous
                    </button>


                    <button

                      type="button"

                      disabled={
                        games.page >=
                        games.totalPages
                      }

                      onClick={
                        () =>
                          setPage(
                            previous =>
                              Math.min(
                                previous + 1,
                                games.totalPages
                              )
                          )
                      }

                      className="
                        rounded-lg border
                        border-white/10
                        bg-white/[0.03]
                        px-4 py-2
                        text-xs
                        text-slate-400
                        transition
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                      "
                    >
                      Next
                    </button>

                  </div>

                </div>

              )}

            </section>

          )}

        </>

      )}

    </>
  );
}