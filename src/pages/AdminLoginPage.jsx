import {
  useState
} from "react";

import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  loginAdmin
} from "../lib/api";


export default function AdminLoginPage() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const queryClient =
    useQueryClient();


  const [
    password,
    setPassword
  ] =
    useState("");


  const destination =
    location.state?.from ||
    "/admin";


  const loginMutation =
    useMutation({

      mutationFn:
        loginAdmin,


      onSuccess:
        data => {

          queryClient.setQueryData(
            [
              "admin",
              "session"
            ],
            data
          );


          navigate(
            destination,
            {
              replace: true
            }
          );
        }
    });


  function handleSubmit(
    event
  ) {

    event.preventDefault();


    if (
      password.length === 0
    ) {

      return;
    }


    loginMutation.mutate(
      password
    );
  }


  return (

    <main
      className="
        app-grid flex min-h-screen
        items-center justify-center
        bg-[#050812] p-5
      "
    >

      <div
        className="
          w-full max-w-md
          overflow-hidden rounded-3xl
          border border-white/[0.08]
          bg-slate-950/85
          shadow-2xl
          shadow-black/40
          backdrop-blur-xl
        "
      >

        <div
          className="
            h-1
            bg-gradient-to-r
            from-cyan-400
            via-violet-500
            to-cyan-400
          "
        />


        <div className="p-8">

          <div
            className="
              mx-auto flex h-14 w-14
              items-center justify-center
              rounded-2xl
              border border-cyan-400/20
              bg-cyan-400/[0.08]
              text-lg font-black
              text-cyan-300
            "
          >
            AD
          </div>


          <div
            className="
              mt-6 text-center
            "
          >

            <div
              className="
                text-xs font-semibold
                uppercase
                tracking-[0.22em]
                text-cyan-400
              "
            >
              Restricted Access
            </div>


            <h1
              className="
                mt-2 text-2xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              Research Administration
            </h1>


            <p
              className="
                mt-2 text-sm
                leading-6 text-slate-500
              "
            >
              Authenticate to manage
              Steam data collection and
              profile processing.
            </p>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8"
          >

            <label
              className="
                block text-xs
                font-medium uppercase
                tracking-[0.14em]
                text-slate-500
              "
            >
              Admin password
            </label>


            <input

              type="password"

              autoComplete="current-password"

              autoFocus

              value={
                password
              }

              onChange={
                event =>
                  setPassword(
                    event.target.value
                  )
              }

              disabled={
                loginMutation.isPending
              }

              className="
                mt-2 w-full
                rounded-xl border
                border-white/10
                bg-black/30
                px-4 py-3.5
                text-white outline-none
                transition
                placeholder:text-slate-700
                focus:border-cyan-400/50
                focus:ring-2
                focus:ring-cyan-400/10
                disabled:opacity-60
              "

              placeholder="Enter password"

            />


            {loginMutation.isError && (

              <div
                className="
                  mt-3 rounded-lg
                  border border-red-400/10
                  bg-red-400/[0.05]
                  px-3 py-2.5
                  text-sm text-red-400
                "
              >

                {loginMutation
                  .error
                  ?.message ||
                  "Login failed."}

              </div>

            )}


            <button

              type="submit"

              disabled={
                loginMutation.isPending ||
                !password
              }

              className="
                mt-5 w-full
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-cyan-300
                px-4 py-3.5
                text-sm font-semibold
                text-slate-950
                transition
                hover:brightness-110
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loginMutation.isPending
                ? "Authenticating..."
                : "Sign In"}

            </button>

          </form>


          <div
            className="
              mt-6 border-t
              border-white/[0.06]
              pt-5 text-center
            "
          >

            <Link

              to="/"

              className="
                text-xs
                text-slate-500
                transition
                hover:text-slate-300
              "
            >
              ← Return to Steam Pulse
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}