import {
  useState
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  useNavigate
} from "react-router-dom";

import PageHeader
  from "../components/PageHeader";

import StatCard
  from "../components/StatCard";

import {
  fetchProfileQueueStatus,
  logoutAdmin,
  processProfileQueue
} from "../lib/api";


function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "en-US"
  ).format(
    Number(
      value || 0
    )
  );
}


function terminalCount(
  queue
) {

  if (!queue) {
    return 0;
  }


  return (

    Number(
      queue.completed || 0
    )

    +

    Number(
      queue.game_details_private || 0
    )

    +

    Number(
      queue.playtime_unavailable || 0
    )

    +

    Number(
      queue.not_found || 0
    )

    +

    Number(
      queue.failed || 0
    )
  );
}


export default function AdminPage() {

  const [
    limit,
    setLimit
  ] =
    useState(20);


  const [
    concurrency,
    setConcurrency
  ] =
    useState(2);


  const [
    batchStartCount,
    setBatchStartCount
  ] =
    useState(null);


  const [
    activeLimit,
    setActiveLimit
  ] =
    useState(0);


  const navigate =
    useNavigate();


  const queryClient =
    useQueryClient();

  const processMutation =
    useMutation({

      mutationKey: [
        "admin",
        "process-profile-queue"
      ],

      mutationFn:
        processProfileQueue,


      onSuccess:
        async () => {
          await Promise.all([
            queryClient
            .invalidateQueries({
              queryKey: [
                "admin",
                "profile-queue"
              ]
            }),
            queryClient
            .invalidateQueries({
              queryKey: [
                "dashboard",
                "summary"
              ]
            })
          ]);

          /* await queryClient
            .invalidateQueries({
              queryKey: [
                "admin",
                "profile-queue"
              ]
            }); */
        }
    });

    const queueQuery =
    useQuery({

      queryKey: [
        "admin",
        "profile-queue"
      ],

      queryFn:
        fetchProfileQueueStatus,

      refetchInterval:
        processMutation.isPending ? 1500 : 10000,

      staleTime:
        1000,

      retry:
        false
    });


  const logoutMutation =
    useMutation({

      mutationFn:
        logoutAdmin,


      onSuccess:
        () => {

          queryClient.setQueryData(
            [
              "admin",
              "session"
            ],
            {
              authenticated:
                false
            }
          );


          navigate(
            "/admin/login",
            {
              replace: true
            }
          );
        }
    });


  const queue =
    queueQuery
      .data
      ?.queue;


  const analysis =
    queueQuery
      .data
      ?.analysis;


  function handleProcess(
    event
  ) {

    event.preventDefault();


    const safeLimit =
      Math.min(
        Math.max(
          Number(limit) || 1,
          1
        ),
        30000
      );


    const safeConcurrency =
      Math.min(
        Math.max(
          Number(concurrency) || 1,
          1
        ),
        10
      );


    setLimit(
      safeLimit
    );


    setConcurrency(
      safeConcurrency
    );


    setBatchStartCount(
      terminalCount(
        queue
      )
    );


    setActiveLimit(
      safeLimit
    );


    processMutation.mutate({

      limit:
        safeLimit,

      concurrency:
        safeConcurrency
    });
  }


  let progressCount = 0;


  if (
    processMutation.isPending &&
    batchStartCount !== null
  ) {

    progressCount =
      Math.max(

        0,

        terminalCount(
          queue
        ) -
        batchStartCount
      );


  } else if (
    processMutation.data
  ) {

    progressCount =
      processMutation
        .data
        .summary
        ?.processed || 0;
  }


  const progressPercentage =
    activeLimit > 0
      ? Math.min(
          (
            progressCount /
            activeLimit
          ) *
          100,
          100
        )
      : 0;


  const lastSummary =
    processMutation
      .data
      ?.summary;


  return (
    <>

      <PageHeader

        eyebrow="Administration"

        title="Data Collection Control"

        description="
          Manage Steam profile processing,
          inspect the queue, and monitor
          your research data pipeline.
        "

        actions={

          <button

            onClick={
              () =>
                logoutMutation.mutate()
            }

            disabled={
              logoutMutation.isPending
            }

            className="
              rounded-xl border
              border-white/10
              bg-white/[0.03]
              px-4 py-2.5
              text-sm text-slate-400
              transition
              hover:bg-white/[0.06]
              hover:text-white
              disabled:opacity-50
            "
          >
            Sign Out
          </button>
        }

      />


      <div
        className="
          mb-8 grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          label="Pending Profiles"
          value={
            queue
              ? formatNumber(
                  queue.pending
                )
              : "—"
          }
          detail="Waiting for collection"
          accent="cyan"
        />


        <StatCard
          label="Usable Profiles"
          value={
            queue
              ? formatNumber(
                  queue.completed
                )
              : "—"
          }
          detail="Public library + playtime"
          accent="emerald"
        />


        <StatCard
          label="Playtime Hidden"
          value={
            queue
              ? formatNumber(
                  queue.playtime_unavailable
                )
              : "—"
          }
          detail="Library visible, playtime unusable"
          accent="amber"
        />


        <StatCard
          label="Failed"
          value={
            queue
              ? formatNumber(
                  queue.failed
                )
              : "—"
          }
          detail="Retries exhausted"
          accent="violet"
        />

      </div>


      <div
        className="
          grid gap-6
          xl:grid-cols-[.8fr_1.2fr]
        "
      >

        <section
          className="
            glass-panel rounded-2xl
            border border-white/[0.07]
            p-6
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
            Queue Worker
          </div>


          <h2
            className="
              mt-2 text-xl
              font-semibold text-white
            "
          >
            Process Profiles
          </h2>


          <p
            className="
              mt-2 text-sm
              leading-6 text-slate-500
            "
          >
            Pull pending SteamIDs from the
            PostgreSQL queue, inspect their
            public libraries, and store
            game/playtime data.
          </p>


          <form
            onSubmit={
              handleProcess
            }
            className="
              mt-6 space-y-5
            "
          >

            <label className="block">

              <span
                className="
                  mb-2 block
                  text-xs font-medium
                  uppercase tracking-wider
                  text-slate-500
                "
              >
                Profile limit
              </span>


              <input

                type="number"

                min="1"

                max="30000"

                value={
                  limit
                }

                disabled={
                  processMutation.isPending
                }

                onChange={
                  event =>
                    setLimit(
                      Number(
                        event.target.value
                      )
                    )
                }

                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-slate-950
                  px-4 py-3
                  text-white outline-none
                  transition
                  focus:border-cyan-400/50
                  disabled:opacity-50
                "
              />

            </label>


            <label className="block">

              <span
                className="
                  mb-2 block
                  text-xs font-medium
                  uppercase tracking-wider
                  text-slate-500
                "
              >
                Concurrency
              </span>


              <input

                type="number"

                min="1"

                max="10"

                value={
                  concurrency
                }

                disabled={
                  processMutation.isPending
                }

                onChange={
                  event =>
                    setConcurrency(
                      Number(
                        event.target.value
                      )
                    )
                }

                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-slate-950
                  px-4 py-3
                  text-white outline-none
                  transition
                  focus:border-cyan-400/50
                  disabled:opacity-50
                "
              />

            </label>


            <button

              type="submit"

              disabled={
                processMutation.isPending ||
                !queue ||
                Number(queue.pending) === 0
              }

              className="
                w-full rounded-xl
                bg-cyan-400
                px-4 py-3
                text-sm font-semibold
                text-slate-950
                transition
                hover:bg-cyan-300
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >

              {processMutation.isPending
                ? "Worker Running..."
                : Number(
                    queue?.pending || 0
                  ) === 0
                  ? "Queue Empty"
                  : "Start Queue Worker"}

            </button>

          </form>


          <div
            className="
              mt-6 border-t
              border-white/[0.06]
              pt-5
            "
          >

            <div
              className="
                flex justify-between
                text-xs
              "
            >

              <span
                className="
                  text-slate-500
                "
              >
                Total discovered
              </span>

              <span
                className="
                  text-slate-300
                "
              >
                {queue
                  ? formatNumber(
                      queue.total
                    )
                  : "—"}
              </span>

            </div>


            <div
              className="
                mt-2 flex justify-between
                text-xs
              "
            >

              <span
                className="
                  text-slate-500
                "
              >
                Currently processing
              </span>

              <span
                className="
                  text-slate-300
                "
              >
                {queue
                  ? formatNumber(
                      queue.processing
                    )
                  : "—"}
              </span>

            </div>


            <div
              className="
                mt-2 flex justify-between
                text-xs
              "
            >

              <span
                className="
                  text-slate-500
                "
              >
                Public library rate
              </span>

              <span
                className="
                  text-slate-300
                "
              >
                {analysis
                  ? `${analysis.publicLibraryPercentage}%`
                  : "—"}
              </span>

            </div>

          </div>

        </section>


        <section
          className="
            glass-panel rounded-2xl
            border border-white/[0.07]
            p-6
          "
        >

          <div
            className="
              flex items-start
              justify-between gap-4
            "
          >

            <div>

              <div
                className="
                  text-xs font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-violet-400
                "
              >
                Job Status
              </div>


              <h2
                className="
                  mt-2 text-xl
                  font-semibold text-white
                "
              >
                Processing Activity
              </h2>

            </div>


            <div
              className={
                processMutation.isPending

                  ? `
                      flex items-center
                      gap-2 rounded-full
                      bg-emerald-400/10
                      px-3 py-1.5
                      text-xs
                      text-emerald-400
                    `

                  : `
                      rounded-full
                      bg-slate-800
                      px-3 py-1.5
                      text-xs
                      text-slate-400
                    `
              }
            >

              {processMutation.isPending && (

                <span
                  className="
                    h-2 w-2
                    animate-pulse
                    rounded-full
                    bg-emerald-400
                  "
                />

              )}

              {processMutation.isPending
                ? "Running"
                : "Idle"}

            </div>

          </div>


          <div className="mt-8">

            <div
              className="
                flex items-center
                justify-between
                text-xs
              "
            >

              <span
                className="
                  text-slate-500
                "
              >
                Batch progress
              </span>


              <span
                className="
                  text-slate-300
                "
              >

                {progressCount}

                {" / "}

                {activeLimit || limit}

              </span>

            </div>


            <div
              className="
                mt-2 h-2
                overflow-hidden
                rounded-full
                bg-slate-900
              "
            >

              <div

                style={{
                  width:
                    `${progressPercentage}%`
                }}

                className="
                  h-full rounded-full
                  bg-gradient-to-r
                  from-cyan-400
                  to-violet-500
                  transition-[width]
                  duration-500
                "
              />

            </div>

          </div>


          <div
            className="
              mt-8 overflow-hidden
              rounded-xl border
              border-white/[0.06]
              bg-black/20
            "
          >

            <div
              className="
                flex items-center
                justify-between
                border-b
                border-white/[0.05]
                px-4 py-3
              "
            >

              <span
                className="
                  text-xs font-medium
                  text-slate-400
                "
              >
                Worker output
              </span>


              {queueQuery.isFetching && (

                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-cyan-500
                  "
                >
                  Refreshing
                </span>

              )}

            </div>


            <div
              className="
                min-h-56 p-4
                font-mono text-xs
                leading-6
              "
            >

              {processMutation.isPending && (

                <div
                  className="
                    text-emerald-400
                  "
                >
                  Worker active. Queue status
                  is refreshing every 1.5 seconds...
                </div>

              )}


              {!processMutation.isPending &&
               !lastSummary && (

                <div
                  className="
                    text-slate-600
                  "
                >
                  Waiting for a queue job...
                </div>

              )}


              {lastSummary && (

                <div
                  className="
                    space-y-1
                    text-slate-400
                  "
                >

                  <div>
                    Batch complete.
                  </div>

                  <div>
                    Processed:{" "}
                    <span className="text-white">
                      {lastSummary.processed}
                    </span>
                  </div>

                  <div>
                    Usable:{" "}
                    <span className="text-emerald-400">
                      {lastSummary.completed}
                    </span>
                  </div>

                  <div>
                    Game details private:{" "}
                    <span className="text-amber-400">
                      {lastSummary.private}
                    </span>
                  </div>

                  <div>
                    Retrying:{" "}
                    <span className="text-cyan-400">
                      {lastSummary.retrying}
                    </span>
                  </div>

                  <div>
                    Not found:{" "}
                    <span className="text-slate-300">
                      {lastSummary.notFound}
                    </span>
                  </div>

                  <div>
                    Failed:{" "}
                    <span className="text-red-400">
                      {lastSummary.failed}
                    </span>
                  </div>

                </div>

              )}


              {processMutation.isError && (

                <div
                  className="
                    text-red-400
                  "
                >
                  {processMutation
                    .error
                    ?.message ||
                    "Queue worker failed."}
                </div>

              )}

            </div>

          </div>

        </section>

      </div>

    </>
  );
}