'use client';

import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { mockBookingRequests } from "@/lib/data";

export default function OwnerBookingsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4">
      <div className="container mx-auto max-w-8xl">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">
            Booking Requests
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all incoming booking requests from guests
          </p>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {mockBookingRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Main Data Row */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-b mb-4">
                {/* Guest Info */}
                <div>
                  <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Guest Name</p>
                  <p className="font-bold text-[#1A2B2B] text-lg">{request.guestName}</p>
                </div>

                {/* Hotel Info */}
                <div>
                  <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Hotel</p>
                  <p className="font-bold text-[#1A2B2B] text-lg">{request.hotelName}</p>
                </div>

                {/* Date Info */}
                <div>
                  <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Dates</p>
                  <p className="font-bold text-[#1A2B2B] text-lg">
                    {request.checkIn} - {request.checkOut}
                  </p>
                </div>

                {/* Status Column */}
                <div className="flex flex-col md:items-start items-start ">
                  <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {request.status === "pending" ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 border border-amber-100">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-[10px] font-bold text-gray-700 uppercase">Pending</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E9F3F0] border border-[#2D5A4C]/10">
                        <CheckCircle2 className="h-4 w-4 text-[#2D5A4C]" />
                        <span className="text-[10px] font-bold text-[#2D5A4C] uppercase tracking-widest">Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="px-8 pb-8 flex flex-col md:flex-row items-center gap-4">
                {request.status === "pending" ? (
                  <>
                    <button className="flex-1 md:flex-[0.4] flex items-center justify-center gap-2 bg-[#2D5A4C] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#23473b] transition-all">
                      <CheckCircle2 size={16} />
                      Confirm
                    </button>
                    <button className="flex-1 md:flex-[0.4] flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-all">
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex-1">
                    <p className="text-sm text-[#2D5A4C] font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} /> Confirmed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <button className="ml-auto text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}