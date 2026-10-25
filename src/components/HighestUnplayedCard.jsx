import {
  Link
} from "react-router-dom";


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


export default function HighestUnplayedCard({

  profile,
  isLoading,
  isError

}) {

  if (isLoading) {

    return (

      <div
        className="
          glass-panel
          min-h-[230px]
          animate-pulse
          rounded-2xl
          border border-white/[0.07]
          p-5
        "
      >

        <div
          className="
            h-3 w-28
            rounded bg-slate-800
          "
        />


        <div
          className="
            mt-7 flex
            items-center gap-4
          "
        >

          <div
            className="
              h-14 w-14
              rounded-xl
              bg-slate-800
            "
          />

          <div className="flex-1">

            <div
              className="
                h-4 w-32
                rounded bg-slate-800
              "
            />

            <div
              className="
                mt-2 h-3 w-20
                rounded bg-slate-900
              "
            />

          </div>

        </div>

      </div>
    );
  }


  if (
    isError ||
    !profile
  ) {

    return (

      <div
        className="
          glass-panel
          flex min-h-[230px]
          items-center justify-center
          rounded-2xl
          border border-white/[0.07]
          p-5
          text-sm text-slate-600
        "
      >
        Unplayed-games spotlight unavailable.
      </div>
    );
  }


  return (

    <Link

      to={
        `/profiles?steamid=${encodeURIComponent(
          profile.steamid
        )}`
      }

      className="
        glass-panel group
        relative block
        min-h-[230px]
        overflow-hidden
        rounded-2xl
        border border-white/[0.07]
        p-5
        transition
        hover:border-amber-400/20
        hover:bg-white/[0.025]
      "
    >

      <div
        className="
          pointer-events-none
          absolute -right-12
          -top-12
          h-32 w-32
          rounded-full
          bg-amber-400/[0.05]
          blur-3xl
        "
      />


      <div
        className="
          relative
          flex items-start
          justify-between gap-3
        "
      >

        <div>

          <div
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-amber-400
            "
          >
            Profile Spotlight
          </div>


          <h3
            className="
              mt-1
              text-sm font-medium
              text-slate-400
            "
          >
            Highest Unplayed %
          </h3>

        </div>


        <div
          className="
            text-xs
            text-slate-600
            transition
            group-hover:text-amber-400
          "
        >
          View profile →
        </div>

      </div>


      <div
        className="
          relative mt-6
          flex items-center gap-4
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
                h-14 w-14
                rounded-xl
                border border-white/10
                bg-slate-900
                object-cover
              "
            />

          )
          : (

            <div
              className="
                flex h-14 w-14
                items-center
                justify-center
                rounded-xl
                bg-slate-900
                text-lg
                text-slate-600
              "
            >
              ?
            </div>

          )}


        <div className="min-w-0">

          <div
            className="
              truncate
              text-base
              font-semibold
              text-white
            "
          >
            {profile.personaname ||
             "Unknown Profile"}
          </div>


          <div
            className="
              mt-1 truncate
              font-mono
              text-[10px]
              text-slate-600
            "
          >
            {profile.steamid}
          </div>

        </div>

      </div>


      <div
        className="
          relative mt-6
        "
      >

        <div
          className="
            text-3xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          {profile.unplayedPercentage}%
        </div>


        <div
          className="
            mt-1 text-xs
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          of library never played
        </div>

      </div>


      <div
        className="
          relative mt-5
          grid grid-cols-2
          gap-3
          border-t
          border-white/[0.06]
          pt-4
        "
      >

        <div>

          <div
            className="
              text-sm
              font-medium
              text-slate-300
            "
          >
            {formatNumber(
              profile.unplayedGames
            )}
          </div>


          <div
            className="
              mt-0.5
              text-[10px]
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            Unplayed games
          </div>

        </div>


        <div>

          <div
            className="
              text-sm
              font-medium
              text-slate-300
            "
          >
            {formatNumber(
              profile.gamesOwned
            )}
          </div>


          <div
            className="
              mt-0.5
              text-[10px]
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            Games owned
          </div>

        </div>

      </div>


      <div
        className="
          relative mt-3
          text-[10px]
          text-slate-600
        "
      >
        {formatHours(
          profile.totalPlaytimeHours
        )} total recorded hours
      </div>

    </Link>
  );
}