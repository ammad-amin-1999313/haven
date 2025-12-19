import { api, authSession, tokenStore } from "@/lib/apiClient";

export async function signup(payload) {
  const res = await api.post("/auth/sign-up", payload)
  tokenStore.set(res.data.accessToken)
  return res.data
}

export async function login(payload) {
  const res = await api.post("/auth/login", payload)
  tokenStore.set(res.data.accessToken)
  authSession.onLogin();
  return res.data
}

export async function logout() {
  authSession.beginLogout();     // stop refresh temporarily
  tokenStore.clear();            // clear access token immediately
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } finally {
    authSession.endLogout();     // ✅ allow refresh again
  }
}
