'use client';

import React, { useMemo, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { BedDouble } from "lucide-react";

import LoginForm from "@/components/Auth/LoginForm";
import SignupForm from "@/components/Auth/SignupForm";

/* ---------------------------
   Layout
--------------------------- */
function Layout({ children }) {
  return <div className="min-h-screen">{children}</div>;
}

/* ---------------------------
   Tabs (lightweight)
--------------------------- */
const TabsCtx = createContext(null);

function Tabs({ defaultValue, className = "", children }) {
  const [value, setValue] = useState(defaultValue);
  const ctx = useMemo(() => ({ value, setValue }), [value]);
  return (
    <TabsCtx.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

function TabsList({ className = "", ...props }) {
  return <div className={`rounded-lg bg-gray-100 p-1 ${className}`} {...props} />;
}

function TabsTrigger({ value, className = "", children }) {
  const ctx = useContext(TabsCtx);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={`rounded-md px-3 py-2 text-sm font-medium transition ${
        active ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className = "", children }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}

/* ---------------------------
   Page
--------------------------- */

export default function AuthPage() {
  const router = useRouter();

  const [loginState, setLoginState] = useState({
    role: "guest", // "guest" | "owner" | "admin"
    email: "",
    password: "",
  });

  const [signupState, setSignupState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "guest", // "guest" | "owner"
    password: "",
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <Layout>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left */}
        <div className="flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-emerald-700/10 rounded-full mb-2">
                <BedDouble className="h-8 w-8 text-emerald-700" />
              </div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">
                Welcome back to Haven
              </h1>
              <p className="text-gray-500">
                Enter your details to access your account.
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm
                  loginState={loginState}
                  setLoginState={setLoginState}
                  onSubmit={handleLoginSubmit}
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignupForm
                  signupState={signupState}
                  setSignupState={setSignupState}
                  onSubmit={handleSignupSubmit}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right */}
        <div className="hidden lg:block relative bg-gray-100">
          <div className="absolute inset-0 bg-emerald-700/20 mix-blend-multiply" />
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
            alt="Hotel Lobby"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-10 left-10 right-10 text-white p-6 bg-black/25 backdrop-blur-md rounded-xl border border-white/10">
            <blockquote className="space-y-2">
              <p className="text-lg font-serif italic">
                “The most seamless booking experience I’ve ever had. Haven made everything feel effortless.”
              </p>
              <footer className="text-sm text-white/80">— A happy traveler</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </Layout>
  );
}
