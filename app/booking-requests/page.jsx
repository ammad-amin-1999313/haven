"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { useOwnerBookingQuery } from "@/features/booking/useBookingQuery";
import { updateBookingStatus } from "@/features/booking/useBookingMutation"; 
import { formatDateRange } from "@/lib/features";
import Button from "@/components/ui/Button";
import RejectModal from "@/components/Common/RejectModal";

export default function OwnerBookingsPage() {
  const { data: OwnerBookingData, isLoading } = useOwnerBookingQuery({});
  const { mutate: updateStatus, isPending: isUpdating } = updateBookingStatus();
  
  // Track which booking is being rejected for the Modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // 1. Confirm Handler (Direct Update)
  const handleConfirm = (id) => {
    updateStatus({
      id,
      data: { decision: "approved" },
    });
  };

  // 2. Reject Handler (Triggered from Modal)
  const handleRejectAction = (reason) => {
    updateStatus({
      id: selectedBookingId,
      data: { 
        decision: "rejected", 
        reason: reason 
      },
    }, {
      onSuccess: () => {
        setIsRejectModalOpen(false);
        setSelectedBookingId(null);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="animate-spin h-10 w-10 text-[#1A2B2B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4">
      <div className="container mx-auto max-w-8xl">
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">
            Booking Requests
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all incoming booking requests from guests
          </p>
        </div>

        <div className="space-y-6">
          {OwnerBookingData?.bookings.length > 0 ? (
            OwnerBookingData.bookings.map((request) => (
              <div
                key={request._id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-b mb-4">
                  <div>
                    <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Guest Name</p>
                    <p className="font-bold text-[#1A2B2B] text-lg">{request?.guestInfo?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Hotel</p>
                    <p className="font-bold text-[#1A2B2B] text-lg">{request?.hotelId?.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Dates</p>
                    <p className="font-bold text-[#1A2B2B] text-lg">{formatDateRange(request.checkIn, request.checkOut)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 border w-fit ${
                      request.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                      request.status === "approved" || request.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {request.status === "pending" && <Clock size={14} />}
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="px-8 pb-8 flex flex-col md:flex-row items-center gap-4">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        title={isUpdating && selectedBookingId === null ? "Confirming..." : "Confirm"}
                        iconLeft={!isUpdating && <CheckCircle2 size={16} />}
                        variant="primary"
                        size="lg"
                        className="flex-1 md:flex-[0.2] text-xs font-bold uppercase"
                        onClick={() => handleConfirm(request._id)}
                        disabled={isUpdating}
                      />

                      <Button
                        title="Reject"
                        iconLeft={<XCircle size={16} />}
                        variant="outline"
                        size="lg"
                        className="flex-1 md:flex-[0.2] text-xs font-bold uppercase border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedBookingId(request._id);
                          setIsRejectModalOpen(true);
                        }}
                        disabled={isUpdating}
                      />
                    </>
                  ) : (
                    <div className="flex-1">
                      <p className={`text-sm font-medium flex items-center gap-2 ${request.status === 'approved' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {request.status === "approved" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        Decision: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </p>
                    </div>
                  )}
                  <button className="ml-auto text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No booking requests found.</p>
            </div>
          )}
        </div>
      </div>

      <RejectModal
        isOpen={isRejectModalOpen}
        isPending={isUpdating}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedBookingId(null);
        }}
        onConfirm={handleRejectAction}
      />
    </div>
  );
}