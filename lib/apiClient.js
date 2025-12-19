import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

let accessToken = null;

// ✅ NEW: a flag to stop refresh while/after logout
let isLoggingOut = false;

export const tokenStore = {
  set(token) {
    accessToken = token;
  },
  get() {
    return accessToken;
  },
  clear() {
    accessToken = null;
  },
};

// ✅ NEW: helper to control logout/login mode from anywhere
export const authSession = {
  beginLogout() {
    isLoggingOut = true;
  },
  endLogout() {
    isLoggingOut = false;   // ✅ NEW
  },
  onLogin() {
    isLoggingOut = false;
  },
  isLoggingOut() {
    return isLoggingOut;
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ attach access token on every request
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Refresh lock (prevents multiple refresh calls) ----
let isRefreshing = false;
let refreshPromise = null;

function shouldSkipRefresh(config) {
  const url = config?.url || "";
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/sign-up") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
}

// ✅ refresh-on-401 with single retry + lock
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    // ✅ NEW: if logging out, NEVER attempt refresh
    if (isLoggingOut) {
      return Promise.reject(error);
    }

    // If unauthorized and not retried yet
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !shouldSkipRefresh(original)
    ) {
      original._retry = true;

      try {
        // If refresh already happening, wait for it
        if (isRefreshing) {
          await refreshPromise;

          const token = tokenStore.get();
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          }
          return Promise.reject(error);
        }

        // Start refresh
        isRefreshing = true;
        refreshPromise = api
          .post("/auth/refresh")
          .then((refreshRes) => {
            const newAccessToken = refreshRes.data?.accessToken;
            if (newAccessToken) tokenStore.set(newAccessToken);
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

        await refreshPromise;

        const token = tokenStore.get();
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }

        tokenStore.clear();
        return Promise.reject(error);
      } catch (e) {
        tokenStore.clear();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ PATCHED: bootstrapAuth should not refresh during logout mode
export async function bootstrapAuth() {
  try {
    const res = await api.post("/auth/refresh"); // cookie-based
    const { accessToken, user } = res.data || {};

    if (accessToken) tokenStore.set(accessToken);

    return { user, accessToken };
  } catch (e) {
    tokenStore.clear();
    return { user: null, accessToken: null };
  }
}
