'use client';

import React, { useMemo, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { BedDouble } from "lucide-react";

/* ---------------------------
   Minimal UI Components (Tailwind)
--------------------------- */

// Layout (simple wrapper)
function Layout({ children }) {
  return <div className="min-h-screen">{children}</div>;
}

// Button
function Button({ className = "", variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-emerald-700 text-white hover:bg-emerald-800",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100",
  };
  return (
    <button
      className={`${base} ${variants[variant] || variants.default} px-4 py-2 ${className}`}
      {...props}
    />
  );
}

// Input
function Input({ className = "", ...props }) {
  return (
    <input
      className={`h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
}

// Label
function Label({ className = "", ...props }) {
  return (
    <label
      className={`text-sm font-medium text-gray-800 ${className}`}
      {...props}
    />
  );
}

// Card
function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
}
function CardHeader({ className = "", ...props }) {
  return <div className={`p-6 pb-3 ${className}`} {...props} />;
}
function CardTitle({ className = "", ...props }) {
  return (
    <h3 className={`text-lg font-semibold leading-none ${className}`} {...props} />
  );
}
function CardDescription({ className = "", ...props }) {
  return (
    <p className={`text-sm text-gray-500 mt-2 ${className}`} {...props} />
  );
}
function CardContent({ className = "", ...props }) {
  return <div className={`p-6 pt-3 ${className}`} {...props} />;
}
function CardFooter({ className = "", ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
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
  return (
    <div
      className={`rounded-lg bg-gray-100 p-1 ${className}`}
      {...props}
    />
  );
}

function TabsTrigger({ value, className = "", children }) {
  const ctx = useContext(TabsCtx);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={`rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-white shadow-sm text-gray-900"
          : "text-gray-600 hover:text-gray-900"
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
  const [role, setRole] = useState("user"); // "user" | "owner" | "admin"

  const handleLogin = (e) => {
    e.preventDefault();
    // dummy auth
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
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Choose your account type to continue.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setRole("user")}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                          role === "user"
                            ? "bg-white shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Guest
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("owner")}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                          role === "owner"
                            ? "bg-white shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("admin")}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                          role === "admin"
                            ? "bg-white shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Admin
                      </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          placeholder="m@example.com"
                          type="email"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="text-xs text-emerald-700 hover:underline"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <Input id="password" type="password" required />
                      </div>

                      <Button type="submit" className="w-full">
                        Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Button>
                    </form>
                  </CardContent>

                  <CardFooter>
                    <div className="text-sm text-gray-500 text-center w-full">
                      By clicking login, you agree to our{" "}
                      <a href="#" className="underline hover:text-emerald-700">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline hover:text-emerald-700">
                        Privacy Policy
                      </a>
                      .
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="signup">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                      Join Haven today to start booking seamlessly.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" placeholder="Doe" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          placeholder="m@example.com"
                          type="email"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" required />
                      </div>

                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </CardContent>
                </Card>
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
                “The most seamless booking experience I’ve ever had. Haven made
                everything feel effortless.”
              </p>
              <footer className="text-sm text-white/80">
                — A happy traveler
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </Layout>
  );
}
