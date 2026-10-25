/* import {
  useEffect,
  useState
} from "react"; */

import {
  useQuery
} from "@tanstack/react-query";

import {
  Navigate,
  useLocation
} from "react-router-dom";

import {
  fetchAdminSession
} from "../lib/api";

/* import {
  API_BASE_URL
} from "../lib/api"; */


export default function RequireAdmin({
  children
}) {

  /* const [status, setStatus] =
    useState("loading"); */
  
    const location = useLocation();

    const {
      data,
      isPending,
      isError
    } = useQuery({
      queryKey: [
        "admin",
        "session"
      ],
      queryFn: fetchAdminSession,
      staleTime: 30 * 1000,
      retry: false
    });

     if (isPending) {

    return (

      <div
        className="
          flex min-h-[60vh]
          items-center justify-center
        "
      >

        <div
          className="
            text-center
          "
        >

          <div
            className="
              mx-auto h-7 w-7
              animate-spin rounded-full
              border-2 border-slate-700
              border-t-cyan-400
            "
          />

          <div
            className="
              mt-3 text-sm
              text-slate-500
            "
          >
            Verifying administrator session...
          </div>

        </div>

      </div>
    );
  }


  if (
    isError ||
    !data?.authenticated
  ) {

    return (

      <Navigate

        to="/admin/login"

        replace

        state={{
          from:
            location.pathname
        }}

      />
    );
  }

/*   useEffect(() => {

    let cancelled = false;


    async function checkSession() {

      try {

        const response =
          await fetch(
            `${API_BASE_URL}/api/admin/session`,
            {
              credentials: "include"
            }
          );


        if (cancelled) {
          return;
        }


        setStatus(
          response.ok
            ? "authenticated"
            : "unauthenticated"
        );


      } catch {

        if (!cancelled) {
          setStatus(
            "unauthenticated"
          );
        }
      }
    }


    checkSession();


    return () => {
      cancelled = true;
    };

  }, []);


  if (
    status === "loading"
  ) {

    return (
      <div
        className="
          flex min-h-[60vh]
          items-center justify-center
          text-sm text-slate-500
        "
      >
        Verifying administrator session...
      </div>
    );
  }


  if (
    status === "unauthenticated"
  ) {

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  } */


  return children;
}