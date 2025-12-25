"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button"; // ✅ common button
import luxuryExterior from "../../assets/hotel/hotel_1.png";
import { formatDate } from "@/lib/features";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  completed: "bg-blue-50 text-blue-600 border-blue-200",
  default: "bg-gray-50 text-gray-600 border-gray-200",
};

const BookingCardGuest = ({ booking }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row p-4 gap-6">
        {/* Left: Hotel Image */}
        <div className="relative w-full md:w-64 h-40 md:h-44 flex-shrink-0">
          <Image
            src={booking?.hotelId.images?.[0]}
            alt={booking?.hotelId?.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Center: Info Section */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1A2B2B]">
              {booking?.hotelId?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {booking?.hotelId?.city && booking?.hotelId?.country
                ? `${booking.hotelId.city}, ${booking.hotelId.country}`
                : booking?.hotelId?.city ||
                  booking?.hotelId?.country ||
                  "Location not available"}
            </p>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-12 mt-6">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">
                  Check-in
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatDate(booking.checkIn)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">
                  Check-out
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatDate(booking.checkOut)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-4">
              <span
                className={`
  inline-block px-3 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-colors
${statusStyles[booking.status?.toLowerCase()] || statusStyles.default}`}
              >
                {booking?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Pricing & Action */}
        <div className="w-full md:w-48 flex flex-col justify-between items-end">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Price</p>
            <p className="text-2xl font-bold text-[#2D5A4C]">
              ${booking?.totalAmount}
            </p>
          </div>

          {/* ✅ updated button */}
          <Button title="View Details" className="w-full mt-4" />
        </div>
      </div>
    </div>
  );
};

export default BookingCardGuest;
