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

const Navbar = () => {
  const userData = useSelector((state) => state.user.user);
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
                  variant="outline"
                  onClick={goToAuth}
                >
                  Owner Login
                </Button>

                <Button onClick={goToAuth}>
                  Admin Login
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Profile Trigger */}
                <Button
                  variant="outline"
                  iconLeft={<User className="h-5 w-5" />}
                  onClick={() => setProfileOpen(true)}
                >
                  Profile
                </Button>
              </div>
            )}

            {isLoggedIn && userData?.role === "owner" && (
              <Link href="/add-hotels">
                <Button>Add Hotel</Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
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
                <Button
                  variant="outline"
                  fullWidth
                  onClick={goToAuth}
                >
                  Owner Login
                </Button>

                <Button
                  fullWidth
                  onClick={goToAuth}
                >
                  Admin Login
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setIsOpen(false);
                    setProfileOpen(true);
                  }}
                >
                  View Profile
                </Button>

                <Button
                  variant="danger"
                  fullWidth
                  disabled={logoutMutation.isPending}
                  onClick={handleLogout}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
