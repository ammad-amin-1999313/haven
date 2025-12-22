"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { ArrowLeft, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "@/features/auth/useAuthMutations"; // adjust path
import { toast } from "react-hot-toast"; // adjust if you use a different toast lib

export default function EditOwner() {
  const router = useRouter();
  const userFromRedux = useSelector((state) => state.user.user);

  const { mutateAsync, isPending } = useUpdateProfileMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const initialForm = useMemo(() => {
    const first = userFromRedux?.firstName || "";
    const last = userFromRedux?.lastName || "";
    return {
      name: `${first} ${last}`.trim(),
      email: userFromRedux?.email || "",
      phone: userFromRedux?.phone || "",
      password: "",
    };
  }, [userFromRedux?.firstName, userFromRedux?.lastName, userFromRedux?.email, userFromRedux?.phone]);

  const [formData, setFormData] = useState(initialForm);

  // ✅ sync form when redux user loads/changes
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

    const { firstName, lastName } = splitName(formData.name);

    const payload = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
    };

    if (formData.password?.trim()) payload.password = formData.password.trim();

    try {
      const id = userFromRedux?._id || userFromRedux?.id; // ✅ supports either shape
      await mutateAsync({ id, payload });

      setShowSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.response?.data?.message || err?.message || "Update failed",
      }));
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => router.push("/profile");

  const inputClasses = (error) =>
    `flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
     ${error ? "border-red-500 focus-visible:ring-red-200" : "border-input"}`;

  // If redux user not loaded yet
  if (!userFromRedux) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-12 px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>

          <h1 className="text-4xl font-serif font-bold mb-2">
            Edit Owner Profile
          </h1>
          <p className="text-muted-foreground">
            Update your personal details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses(errors.name)}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses(errors.email)}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses(errors.phone)}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Optional Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password (optional)</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className={inputClasses(false)}
                />
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600" />
              <div className="text-sm text-green-700">
                <p className="font-bold">Success!</p>
                <p>Your profile has been updated. Redirecting…</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" fullWidth disabled={isPending || showSuccess}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
