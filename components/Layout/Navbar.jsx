"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BedDouble, Menu, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import ProfileModal from "../Profile/ProfileModal";
import { useLogoutMutation } from "@/features/auth/useAuthMutations";
import { useAuthUser } from "@/features/auth/useAuthUser";

const Navbar = () => {
  const userData = useSelector((state) => state.user.user); // ✅ single source for UI
  const isLoggedIn = !!userData?.id;
 
   
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const goToAuth = () => {
    setIsOpen(false);
    router.push("/auth-page");
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setIsOpen(false);
        setProfileOpen(false);
        toast.success("Logged out successfully.");
        router.push("/auth-page");
      },
    });
  };

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-gray-200 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <BedDouble className="h-6 w-6 text-primaryColor" />
          <span className="font-serif text-xl font-bold tracking-tight">Haven</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-secondaryColor hover:text-primaryColor">
            Home
          </Link>
          <Link href="/hotels" className="text-sm font-medium text-secondaryColor hover:text-primaryColor">
            Hotels
          </Link>
          <Link href="/about-us" className="text-sm font-medium text-secondaryColor hover:text-primaryColor">
            About Us
          </Link>

          <div className="flex items-center gap-2 ml-4">
            {!isLoggedIn ? (
              <>
                <Button
                  title="Owner Login"
                  bg="bg-white/80"
                  textColor="text-primaryColor border-[1px] border-primaryColor"
                  onClick={goToAuth}
                />
                <Button title="Admin Login" onClick={goToAuth} />
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Profile Trigger */}
                <button
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-[#2D5A4C] px-4 py-2 text-[#2D5A4C] hover:bg-[#2D5A4C]/5 transition-all"
                  aria-label="Open profile"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Profile</span>
                </button>

                {/* <Button
                  title={logoutMutation.isPending ? "Logging out..." : "Logout"}
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                /> */}
              </div>
            )}

            {isLoggedIn && userData?.role === "owner" && (
              <Link href="/add-hotels">
                <Button title="Add Hotel" />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden p-2 rounded-md hover:bg-accent/30 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Profile Modal */}
      {isLoggedIn && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={userData}
          onLogout={handleLogout}
          isLoggingOut={logoutMutation.isPending}
        />
      )}

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b bg-white/70 backdrop-blur-md p-4 space-y-4">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-medium">
              Home
            </Link>
            <Link href="/hotels" onClick={() => setIsOpen(false)} className="text-base font-medium">
              Hotels
            </Link>
            <Link href="/about-us" onClick={() => setIsOpen(false)} className="text-base font-medium">
              About Us
            </Link>

            <hr className="my-2" />

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={goToAuth}
                  className="w-full py-2 text-sm font-medium border rounded-md bg-white/80"
                >
                  Owner Login
                </button>
                <button
                  onClick={goToAuth}
                  className="w-full py-2 text-sm font-medium bg-primaryColor text-white rounded-md"
                >
                  Admin Login
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setProfileOpen(true);
                  }}
                  className="w-full py-2 text-sm font-medium border border-primaryColor text-primaryColor rounded-md"
                >
                  View Profile
                </button>

                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full py-2 text-sm font-medium bg-primaryColor text-white rounded-md disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
