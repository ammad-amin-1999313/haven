"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { ArrowLeft, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "@/features/auth/useAuthMutations";
import toast from "react-hot-toast";


export default function EditGuest() {
  const router = useRouter();
  const userFromRedux = useSelector((state) => state.user.user);

  const { mutateAsync, isPending } = useUpdateProfileMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Build initial values from redux user
  const initialForm = useMemo(() => {
    const first = userFromRedux?.firstName || "";
    const last = userFromRedux?.lastName || "";
    return {
      name: `${first} ${last}`.trim(),
      email: userFromRedux?.email || "",
      phone: userFromRedux?.phone || "",
      password: "", // optional: only if user wants to change
    };
  }, [userFromRedux?.firstName, userFromRedux?.lastName, userFromRedux?.email, userFromRedux?.phone]);

  const [formData, setFormData] = useState(initialForm);

  // If redux user arrives after render, sync form once
  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return { firstName, lastName };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // build backend payload
    const { firstName, lastName } = splitName(formData.name);

    const payload = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone, // backend will normalize or schema requires clean format
    };

    // only send password if user entered it
    if (formData.password?.trim()) payload.password = formData.password.trim();
    
    try {
      await mutateAsync({id:userFromRedux?.id, payload});

      setShowSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      // Show a friendly error
      setErrors((prev) => ({
        ...prev,
        submit: err?.response?.data?.message || err?.message || "Update failed",
      }));
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => router.push("/profile");

  // If user is not loaded yet, you can show nothing or a loader
  if (!userFromRedux) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-12 px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>

          <h1 className="text-4xl font-serif font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your account information</p>
        </div>

        {/* Form Card */}
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Personal Information
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Keep your details up to date to help us serve you better
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-base font-medium block">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${
                  errors.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-input focus-visible:ring-ring"
                }`}
              />
              {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-base font-medium block">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-input focus-visible:ring-ring"
                }`}
              />
              {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email}</p>}
              <p className="text-xs text-muted-foreground">
                We'll use this for login and notifications
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-base font-medium block">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || userFromRedux?.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-input focus-visible:ring-ring"
                }`}
              />
              {errors.phone && <p className="text-sm text-red-500 font-medium">{errors.phone}</p>}
            </div>

            {/* Optional Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-base font-medium block">
                New Password (optional)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="flex h-11 w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Changes saved successfully!</p>
                  <p className="text-sm text-green-700">Redirecting you back…</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                fullWidth
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending || showSuccess} fullWidth>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
