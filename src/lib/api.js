export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

  export class ApiError extends Error {
    constructor(
    message,
    status
  ) {

    super(message);

    this.name =
      "ApiError";

    this.status =
      status;
  }
  }

  async function adminRequest(
  path,
  options = {}
) {

  const response =
    await fetch(
      `${API_BASE_URL}${path}`,
      {

        ...options,

        credentials:
          "include",

        headers: {

          ...(options.body
            ? {
                "Content-Type":
                  "application/json"
              }
            : {}),

          ...options.headers
        }
      }
    );


  let body = null;


  try {

    body =
      await response.json();

  } catch {

    // No JSON response.
  }


  if (!response.ok) {

    throw new ApiError(

      body?.error ||
      body?.message ||
      "Request failed.",

      response.status
    );
  }


  return body;
}


export function fetchAdminSession() {

  return adminRequest(
    "/api/admin/session"
  );
}


export function loginAdmin(
  password
) {

  return adminRequest(
    "/api/admin/login",
    {

      method:
        "POST",

      body:
        JSON.stringify({
          password
        })
    }
  );
}


export function logoutAdmin() {

  return adminRequest(
    "/api/admin/logout",
    {
      method:
        "POST"
    }
  );
}


export function fetchProfileQueueStatus() {

  return adminRequest(
    "/api/profile-queue/status"
  );
}


export function processProfileQueue({
  limit,
  concurrency
}) {

  return adminRequest(
    "/api/profile-queue/process",
    {

      method:
        "POST",

      body:
        JSON.stringify({
          limit,
          concurrency
        })
    }
  );
}

  export async function fetchDailyTop100History({
    time, days
  }) {
    const params =
    new URLSearchParams({

      time:
        String(time),

      days:
        String(days)
    });


  const response =
    await fetch(
      `${API_BASE_URL}/api/history/daily?${params}`
    );


  if (!response.ok) {

    let message =
      "Could not load Steam player history.";


    try {

      const body =
        await response.json();

      message =
        body.error ||
        body.message ||
        message;

    } catch {

      // Keep default message.
    }


    throw new Error(
      message
    );
  }


  return response.json();
  }

  export async function fetchLatestSnapshotSummary() {

  const response =
    await fetch(
      `${API_BASE_URL}/api/snapshots/latest-summary`
    );


  if (!response.ok) {

    let message =
      "Could not load the latest Steam snapshot.";


    try {

      const body =
        await response.json();

      message =
        body.error ||
        body.message ||
        message;

    } catch {

      // Use default error.
    }


    throw new Error(
      message
    );
  }


  return response.json();
}

export async function fetchDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard-summary`);

  if (!response.ok) {
    let message = "Could not load dashboard stats";
    try {
      const body = await response.json();
      message = body.error || body.message || message;

    } catch {
      //default message
    }

    throw new Error(message);
  }

  return response.json();

}

export function refreshProfile(steamid) {
   return adminRequest(
    `/api/profiles/${encodeURIComponent(
      steamid
    )}/collect`,
    {
      method:
        "POST"
    }
  );
}

async function publicRequest(
  path
) {

  const response =
    await fetch(
      `${API_BASE_URL}${path}`
    );


  let body = null;


  try {

    body =
      await response.json();

  } catch {

    // No JSON response.
  }


  if (!response.ok) {

    const error =
      new Error(

        body?.error ||
        body?.message ||
        `Request failed with HTTP ${response.status}.`
      );


    error.status =
      response.status;


    throw error;
  }


  return body;
}


export function searchProfiles(
  query
) {

  const params =
    new URLSearchParams({

      q:
        query,

      limit:
        "10"
    });


  return publicRequest(
    `/api/profiles/search?${params}`
  );
}


export function fetchProfile(
  steamid
) {

  return publicRequest(
    `/api/profiles/${steamid}`
  );
}


export function fetchProfileAnalysis(
  steamid
) {

  return publicRequest(
    `/api/profiles/${steamid}/analysis`
  );
}


export function fetchProfileGames({

  steamid,
  page,
  limit,
  search,
  sort,
  order

}) {

  const params =
    new URLSearchParams({

      page:
        String(page),

      limit:
        String(limit),

      search:
        search || "",

      sort,

      order
    });


  return publicRequest(
    `/api/profiles/${steamid}/games?${params}`
  );
}

export async function fetchProfileSpotlights() {

  const response =
    await fetch(
      `${API_BASE_URL}/api/analysis/profile-spotlights`
    );


  let body = null;


  try {

    body =
      await response.json();

  } catch {

    // Keep body null.
  }


  if (!response.ok) {

    throw new Error(

      body?.error ||
      body?.message ||
      "Could not load profile spotlights."
    );
  }


  return body;
}

export function searchTrackedGames(
  query
) {

  const params =
    new URLSearchParams({
      q:
        query
    });


  return publicRequest(
    `/api/game-trends/search?${params}`
  );
}


export function fetchGameTrend({

  appid,
  days,
  sampling,
  time

}) {

  const params =
    new URLSearchParams({

      days:
        String(days),

      sampling
    });


  if (
    sampling ===
    "daily"
  ) {

    params.set(
      "time",
      time
    );
  }


  return publicRequest(
    `/api/game-trends/${appid}?${params}`
  );
}