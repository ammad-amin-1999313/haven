import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3500";

let accessToken = null;
let isLoggingOut = false;

export const tokenStore = {
  set(token) { accessToken = token; },
  get() { return accessToken; },
  clear() { accessToken = null; },
};

export const authSession = {
  beginLogout() { isLoggingOut = true; },
  endLogout() { isLoggingOut = false; },
  onLogin() { isLoggingOut = false; },
  isLoggingOut() { return isLoggingOut; },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    // ✅ Never refresh during logout
    if (authSession.isLoggingOut()) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !shouldSkipRefresh(original)
    ) {
      original._retry = true;

      try {
        if (isRefreshing) {
          await refreshPromise;
        } else {
          isRefreshing = true;
          refreshPromise = api
            .post("/auth/refresh")
            .then((r) => {
              const t = r.data?.accessToken;
              if (t) tokenStore.set(t);
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });

          await refreshPromise;
        }

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

export async function bootstrapAuth() {
  // ✅ Don’t refresh while logging out
  if (authSession.isLoggingOut()) {
    tokenStore.clear();
    return { user: null, accessToken: null };
  }

  try {
    const res = await api.post("/auth/refresh");
    const { accessToken: t, user } = res.data || {};
    if (t) tokenStore.set(t);
    return { user, accessToken: t || null };
  } catch (e) {
    // 401 missing refresh token = logged out (do not treat as "error toast")
    tokenStore.clear();
    return { user: null, accessToken: null };
  }
}
