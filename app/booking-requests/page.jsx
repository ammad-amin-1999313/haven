"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { useOwnerBookingQuery } from "@/features/booking/useBookingQuery";
import { updateBookingStatus } from "@/features/booking/useBookingMutation";
import { formatDateRange } from "@/lib/features";
import Button from "@/components/ui/Button";
import RejectModal from "@/components/Common/RejectModal";
import Pagination from "@/components/Common/Pagination";

export default function OwnerBookingsPage() {
  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useOwnerBookingQuery({
    page,
    limit,
  });

  const { mutate: updateStatus, isPending: isUpdating } =
    updateBookingStatus();

  // reject modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // per-row loading
  const [updatingId, setUpdatingId] = useState(null);

  const bookings = data?.bookings || [];
  const metadata = data?.metadata || data?.pagination || null;

  const handleConfirm = (id) => {
    setUpdatingId(id);
    updateStatus(
      { id, data: { decision: "approved" } },
      {
        onSettled: () => setUpdatingId(null),
      }
    );
  };

  const handleRejectOpen = (id) => {
    setSelectedBookingId(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason) => {
    if (!selectedBookingId) return;

    setUpdatingId(selectedBookingId);
    updateStatus(
      {
        id: selectedBookingId,
        data: { decision: "rejected", reason },
      },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setSelectedBookingId(null);
        },
        onSettled: () => setUpdatingId(null),
      }
    );
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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">
            Booking Requests
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all incoming booking requests from guests
          </p>
        </div>

        {/* Booking List */}
        <div className="space-y-6">
          {bookings.length > 0 ? (
            bookings.map((request) => {
              const rowBusy = isUpdating && updatingId === request._id;

              return (
                <div
                  key={request._id}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Top Info */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-b">
                    <div>
                      <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">
                        Guest Name
                      </p>
                      <p className="font-bold text-[#1A2B2B] text-lg">
                        {request?.guestInfo?.fullName || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">
                        Hotel
                      </p>
                      <p className="font-bold text-[#1A2B2B] text-lg">
                        {request?.hotelId?.name || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">
                        Dates
                      </p>
                      <p className="font-bold text-[#1A2B2B] text-lg">
                        {formatDateRange(
                          request.checkIn,
                          request.checkOut
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#8BA19B] uppercase tracking-widest mb-1">
                        Status
                      </p>
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 border w-fit ${
                          request.status === "pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : request.status === "approved" ||
                              request.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
                        {request.status === "pending" && (
                          <Clock size={14} />
                        )}
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-8 py-6 flex flex-col md:flex-row items-center gap-4">
                    {request.status === "pending" ? (
                      <>
                        <Button
                          title={rowBusy ? "Confirming..." : "Confirm"}
                          iconLeft={
                            !rowBusy && <CheckCircle2 size={16} />
                          }
                          variant="primary"
                          size="lg"
                          className="flex-1 md:flex-[0.25] text-xs font-bold uppercase"
                          onClick={() =>
                            handleConfirm(request._id)
                          }
                          disabled={rowBusy}
                        />

                        <Button
                          title="Reject"
                          iconLeft={<XCircle size={16} />}
                          variant="dangerOutline"
                          size="lg"
                          className="flex-1 md:flex-[0.25] text-xs font-bold uppercase"
                          onClick={() =>
                            handleRejectOpen(request._id)
                          }
                          disabled={rowBusy}
                        />
                      </>
                    ) : (
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium flex items-center gap-2 ${
                            request.status === "approved"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {request.status === "approved" ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          Decision:{" "}
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </p>
                      </div>
                    )}

                    <button className="ml-auto text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">
                No booking requests found.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {metadata && (
          <Pagination
            metadata={metadata}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* Reject Modal */}
      <RejectModal
        isOpen={isRejectModalOpen}
        isPending={isUpdating && updatingId === selectedBookingId}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedBookingId(null);
        }}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
