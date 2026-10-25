import { 
    NavLink, Outlet
} from "react-router-dom";

const navigation = [
    {
        to: "/",
        label: "Overview",
        short: "OV"
    },
    {
        to: "/games",
        label: "Game Trends",
        short: "GT"
    },
    {
        to: "/profiles",
        label: "Profiles",
        short: "PF"
    },
    {
        to: "/admin",
        label: "Admin",
        shoirt: "AD"
    }

];

function SidebarLink({
  to,
  label,
  short
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl",
          "px-3 py-2.5 text-sm transition",
          isActive
            ? [
                "bg-cyan-400/10",
                "text-cyan-300",
                "ring-1 ring-cyan-400/20"
              ].join(" ")
            : [
                "text-slate-400",
                "hover:bg-white/[0.04]",
                "hover:text-slate-100"
              ].join(" ")
        ].join(" ")
      }
    >
      <span
        className="
          flex h-8 w-8 items-center
          justify-center rounded-lg
          border border-white/10
          bg-slate-950/60
          text-[10px] font-bold
          tracking-widest
          group-hover:border-white/20
        "
      >
        {short}
      </span>

      {label}
    </NavLink>
  );
}

export default function AppShell() {
  return (
    <div
      className="
        app-grid min-h-screen
        bg-[#050812] text-slate-200
      "
    >
      <aside
        className="
          fixed inset-y-0 left-0
          hidden w-64 border-r
          border-white/[0.06]
          bg-[#070b14]/95
          backdrop-blur-xl
          lg:flex lg:flex-col
        "
      >
        <div
          className="
            border-b border-white/[0.06]
            px-6 py-6
          "
        >
          <div
            className="
              mb-1 flex items-center gap-3
            "
          >
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-cyan-400
                to-violet-500
                font-black text-slate-950
                shadow-lg
                shadow-cyan-500/10
              "
            >
              S
            </div>

            <div>
              <div
                className="
                  text-lg font-semibold
                  tracking-tight text-white
                "
              >
                Steam Pulse
              </div>

              <div
                className="
                  text-[10px] uppercase
                  tracking-[0.25em]
                  text-slate-500
                "
              >
                Research Console
              </div>
            </div>
          </div>
        </div>

        <nav
          className="
            flex flex-1 flex-col
            gap-1 px-4 py-6
          "
        >
          {navigation.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
            />
          ))}
        </nav>

        <div className="p-5">
          <div
            className="
              rounded-xl border
              border-white/[0.06]
              bg-slate-950/60
              p-4
            "
          >
            <div
              className="
                flex items-center gap-2
                text-xs font-medium
                text-slate-300
              "
            >
              <span
                className="
                  h-2 w-2 rounded-full
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,.65)]
                "
              />

              Data collector
            </div>

            <p
              className="
                mt-2 text-xs
                leading-5 text-slate-500
              "
            >
              Steam chart snapshots are
              sampled every 15 minutes.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header
          className="
            sticky top-0 z-30
            flex h-16 items-center
            justify-between
            border-b border-white/[0.06]
            bg-[#050812]/80
            px-4 backdrop-blur-xl
            sm:px-6 lg:px-8
          "
        >
          <div className="lg:hidden">
            <span
              className="
                font-semibold text-white
              "
            >
              Steam Pulse
            </span>
          </div>

          <div
            className="
              hidden items-center gap-2
              text-xs text-slate-500
              lg:flex
            "
          >
            <span>Steam research dataset</span>

            <span>•</span>

            <span>
              PostgreSQL / Render
            </span>
          </div>

          <div
            className="
              rounded-full border
              border-white/[0.07]
              bg-white/[0.03]
              px-3 py-1.5
              text-xs text-slate-400
            "
          >
            GTA VI Impact Study
          </div>
        </header>

        <main
          className="
            mx-auto max-w-[1600px]
            p-4 sm:p-6 lg:p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}