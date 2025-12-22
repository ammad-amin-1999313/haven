"use client";

import React from "react";
import InputField from "@/components/Common/InputField";
import Button from "@/components/ui/Button";

function Card({ className = "", ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`} {...props} />
  );
}
function CardHeader({ className = "", ...props }) {
  return <div className={`p-6 pb-3 ${className}`} {...props} />;
}
function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-lg font-semibold leading-none ${className}`} {...props} />;
}
function CardDescription({ className = "", ...props }) {
  return <p className={`text-sm text-gray-500 mt-2 ${className}`} {...props} />;
}
function CardContent({ className = "", ...props }) {
  return <div className={`p-6 pt-3 ${className}`} {...props} />;
}
function CardFooter({ className = "", ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

export default function LoginForm({ loginState, setLoginState, onSubmit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Choose your account type to continue.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <Button
            size="sm"
            fullWidth
            variant="ghost"
            onClick={() => setLoginState((p) => ({ ...p, role: "guest" }))}
            className={`transition-colors duration-150 ${loginState.role === "guest"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            Guest
          </Button>

          <Button
            size="sm"
            fullWidth
            variant="ghost"
            onClick={() => setLoginState((p) => ({ ...p, role: "owner" }))}
            className={`transition-colors duration-150 ${loginState.role === "owner"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            Owner
          </Button>

          <Button
            size="sm"
            fullWidth
            variant="ghost"
            onClick={() => setLoginState((p) => ({ ...p, role: "admin" }))}
            className={`transition-colors duration-150 ${loginState.role === "admin"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            Admin
          </Button>
        </div>




        <form onSubmit={onSubmit} className="space-y-4">
          <InputField
            id="login-email"
            label="Email"
            placeholder="m@example.com"
            type="email"
            required
            value={loginState.email}
            onChange={(e) => setLoginState((p) => ({ ...p, email: e.target.value }))}
            validate
            validationType="email"
            showErrorOn="blur"
          />

          <InputField
            id="login-password"
            label="Password"
            labelRight={
              <a href="#" className="text-xs text-emerald-700 hover:underline">
                Forgot password?
              </a>
            }
            type="password"
            required
            value={loginState.password}
            onChange={(e) => setLoginState((p) => ({ ...p, password: e.target.value }))}
          />

          {/* Submit */}
          <Button type="submit" fullWidth>
            Login as {loginState.role.charAt(0).toUpperCase() + loginState.role.slice(1)}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-gray-500 text-center w-full">
          By clicking login, you agree to our{" "}
          <a href="#" className="underline hover:text-emerald-700">Terms</a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-emerald-700">Privacy Policy</a>.
        </div>
      </CardFooter>
    </Card>
  );
}
