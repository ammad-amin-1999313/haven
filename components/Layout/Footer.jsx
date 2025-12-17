'use client'
import React from "react";
import Link from "next/link";
import { BedDouble } from "lucide-react";
import Button from "../ui/Button";

const Footer = () => {
  return (
    <footer className="border-t bg-mute/50">
      <div className="container mx-auto px-4 py-10 md:py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BedDouble className="h-6 w-6 text-primaryColor" />
              <span className="font-serif text-xl font-bold">Haven</span>
            </div>
            <p className="text-sm text-mutedground leading-relaxed">
              Experience luxury and comfort in the world's most beautiful
              destinations. Simple booking, pay on arrival.
            </p>
          </div>

          <div className="flex flex-col space-y-2 text-sm text-mutedground">
            <h3 className="font-semibold mb-2 text-foreground">Company</h3>
            <Link href="/about-us" className="hover:text-primaryColor transition-colors">About Us</Link>
            <Link href="/careers" className="hover:text-primaryColor transition-colors">Careers</Link>
            <Link href="/press" className="hover:text-primaryColor transition-colors">Press</Link>
          </div>

          <div className="flex flex-col space-y-2 text-sm text-mutedground">
            <h3 className="font-semibold mb-2 text-foreground">Support</h3>
            <Link href="/contact" className="hover:text-primaryColor transition-colors">Contact Us</Link>
            <Link href="/terms" className="hover:text-primaryColor transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primaryColor transition-colors">Privacy Policy</Link>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold mb-2 text-foreground">Newsletter</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button title={'Subscribe'} className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"/>
              
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-mutedground">
          © 2025 Haven Booking. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
