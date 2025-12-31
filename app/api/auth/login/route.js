import { NextResponse } from "next/server";

const BACKEND_URL = process.env.API_BASE_URL || "http://localhost:3500";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Use Axios to call your backend
    const backendRes = await axios.post(`${BACKEND_URL}/auth/login`, body, {
      validateStatus: (status) => status < 500, // Prevents throwing on 4xx errors
    });

    const data = backendRes.data;

    // 2. Handle Backend Errors
    if (backendRes.status !== 200) {
      return NextResponse.json(
        { message: data?.message || "Login failed" },
        { status: backendRes.status }
      );
    }

    // 3. Set up the Next.js response
    const res = NextResponse.json(data, { status: 200 });

    if (data?.refreshToken) {
      res.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/", 
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return res;
  } catch (err) {
    return NextResponse.json(
      { message: err?.response?.data?.message || "Server error" },
      { status: 500 }
    );
  }
}
