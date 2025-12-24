import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AddHotel from "@/components/Hotel/AddHotel";

export const metadata = {
  title: "Add New Hotel | Property Management",
};

export default function AddHotelPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F5] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href="/owner-hotels" 
          className="flex items-center gap-2 text-gray-500 hover:text-[#2D5A4C] transition-colors mb-6 font-bold text-sm"
        >
          <ChevronLeft size={16} /> Back to My Hotels
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">Add Hotel</h1>
          <p className="text-gray-500">Fill out the form below to add your hotel listing.</p>
        </div>
        <AddHotel />
      </div>
    </div>
  );
}