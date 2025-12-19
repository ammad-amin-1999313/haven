"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const BookingCardGuest = ({ booking }) => {
  // Manual date formatter to match the image style (DD/MM/YYYY)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row p-4 gap-6">
        
        {/* Left: Hotel Image */}
        <div className="relative w-full md:w-64 h-40 md:h-44 flex-shrink-0">
          <Image
            src={booking.image || "/placeholder-hotel.jpg"}
            alt={booking.hotelName}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Center: Info Section */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1A2B2B]">
              {booking.hotelName}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {booking.location}
            </p>

            {/* Dates Grid - Spaced out like in your image */}
            <div className="grid grid-cols-2 gap-12 mt-6">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Check-in</span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatDate(booking.checkIn)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Check-out</span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatDate(booking.checkOut)}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <span className="inline-block px-3 py-0.5 rounded-md border border-gray-300 text-[10px] font-bold uppercase tracking-wider text-gray-700">
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Pricing & Action */}
        <div className="w-full md:w-48 flex flex-col justify-between items-end">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Price</p>
            <p className="text-2xl font-bold text-[#2D5A4C]">
              ${booking.price}
            </p>
          </div>

          <button className="w-full bg-[#2D5A4C] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#23473b] transition-colors mt-4">
            View Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingCardGuest;