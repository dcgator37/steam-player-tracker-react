import {
  Link
} from "react-router-dom";


export default function NotFoundPage() {

  return (
    <main
      className="
        flex min-h-screen
        items-center justify-center
        bg-[#050812]
        p-6 text-center
      "
    >
      <div>
        <div
          className="
            text-7xl font-black
            text-slate-800
          "
        >
          404
        </div>

        <h1
          className="
            mt-4 text-2xl
            font-semibold text-white
          "
        >
          Page not found
        </h1>

        <Link
          to="/"
          className="
            mt-6 inline-block
            text-sm text-cyan-400
          "
        >
          ← Return to dashboard
        </Link>
      </div>
    </main>
  );
}