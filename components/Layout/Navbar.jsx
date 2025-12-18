"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BedDouble, Menu, X } from "lucide-react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/useAuthMutations";
import { useAuthUser } from "@/features/auth/useAuthUser";
import toast from "react-hot-toast";

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter()

  const handleLoginAndSignupRedirect = () => {
    router.push('/auth-page');
  }

  const { data: user, isLoading } = useAuthUser();
  const isLoggedIn = Boolean(user);
  console.log(user);
  
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully.");
        setIsOpen(false);
        router.push("/auth-page");
      },
      onError: (err) => {
        toast.error("Error logging out. Please try again.");
      }
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
          <Link href="/" className="text-sm font-medium text-secondaryColor hover:text-primaryColor">Home</Link>
          <Link href="/hotels" className="text-sm font-medium text-secondaryColor hover:text-primaryColor">Hotels</Link>
          <Link href="/about-us" className="text-sm font-medium text-secondaryColor hover:text-primaryColor">About Us</Link>

          <div className="flex items-center gap-2 ml-4">
            {!isLoggedIn ? (
              <>
                <Button
                  title="Owner Login"
                  bg="bg-white/80"
                  textColor="text-primaryColor border-[1px] border-primaryColor"
                  onClick={handleLoginAndSignupRedirect}
                />
                <Button title="Admin Login" onClick={handleLoginAndSignupRedirect} />
              </>
            ) : (
              <Button
                title={logoutMutation.isPending ? "Logging out..." : "Logout"}
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              />
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-accent/30 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b bg-white/70 backdrop-blur-md p-4 space-y-4">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-medium">Home</Link>
            <Link href="/hotels" onClick={() => setIsOpen(false)} className="text-base font-medium">Hotels</Link>
            <Link href="/about-us" onClick={() => setIsOpen(false)} className="text-base font-medium">About Us</Link>

            <hr className="my-2" />

            <div className="flex flex-col gap-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLoginAndSignupRedirect();
                    }}
                    className="w-full py-2 text-sm font-medium border rounded-md bg-white/80 backdrop-blur-sm"
                  >
                    Owner Login
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLoginAndSignupRedirect();
                    }}
                    className="w-full py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md"
                  >
                    Admin Login
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
