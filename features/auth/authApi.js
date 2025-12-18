import { api, tokenStore } from "@/lib/apiClient";

export async function signup(payload) {
    const res = await api.post("/auth/sign-up",payload)
    tokenStore.set(res.data.accessToken)
    return res.data
}

export async function login(payload) {
    const res = await api.post("/auth/login",payload)
    tokenStore.set(res.data.accessToken)
    return res.data 
}

export async function meApi() {
  const res = await api.get("/auth/me"); // you need backend route for this
  return res.data; // should be user object
}

export async function logout() {
    const res = await api.post("/auth/logout")
    tokenStore.clear()
    return res.data
}