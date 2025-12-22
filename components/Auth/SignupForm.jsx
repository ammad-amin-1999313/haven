"use client";

import React from "react";
import InputField from "@/components/Common/InputField";
import Button from "@/components/ui/Button"; // ✅ common button

// ❌ removed local Button

function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Label({ className = "", ...props }) {
  return <label className={`text-sm font-medium text-gray-800 ${className}`} {...props} />;
}

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

export default function SignupForm({
  signupState,
  setSignupState,
  onSubmit,
  isSubmitting = false,
  apiError = null,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Join Haven today to start booking seamlessly.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="first-name"
              label="First name"
              placeholder="John"
              required
              value={signupState.firstName}
              onChange={(e) => setSignupState((p) => ({ ...p, firstName: e.target.value }))}
            />

            <InputField
              id="last-name"
              label="Last name"
              placeholder="Doe"
              required
              value={signupState.lastName}
              onChange={(e) => setSignupState((p) => ({ ...p, lastName: e.target.value }))}
            />
          </div>

          <InputField
            id="signup-email"
            label="Email"
            placeholder="m@example.com"
            type="email"
            required
            value={signupState.email}
            onChange={(e) => setSignupState((p) => ({ ...p, email: e.target.value }))}
            validate
            validationType="email"
            showErrorOn="blur"
          />

          {/* Guest/Owner ONLY */}
          <div className="space-y-2">
            <Label htmlFor="signup-role">User Role</Label>
            <Select
              id="signup-role"
              value={signupState.role}
              onChange={(e) => setSignupState((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="guest">Guest</option>
              <option value="owner">Owner</option>
            </Select>
          </div>

          <InputField
            id="signup-password"
            label="Password"
            type="password"
            required
            value={signupState.password}
            onChange={(e) => setSignupState((p) => ({ ...p, password: e.target.value }))}
          />

          {/* ✅ submit button updated */}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
