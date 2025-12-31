import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.API_BASE_URL || "http://localhost:3500";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Axios call to Backend
    const backendRes = await axios.post(`${BACKEND_URL}/auth/sign-up`, body, {
      headers: { "Content-Type": "application/json" },
      // This prevents Axios from throwing an error for 400/401/409 responses,
      // letting us handle the specific error message from your backend.
      validateStatus: (status) => status < 500,
    });

    const data = backendRes.data;

    // 2. Handle Backend validation or logic errors (4xx)
    if (backendRes.status >= 400) {
      return NextResponse.json(
        { message: data?.message || "Signup failed" },
        { status: backendRes.status }
      );
    }

    // 3. Create Success Response
    const res = NextResponse.json(data, { status: 201 });

    // 4. Set Cookie if token is provided
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
    console.error("Signup Error:", err.message);
    return NextResponse.json(
      { message: "Server error during registration" },
      { status: 500 }
    );
  }
}
