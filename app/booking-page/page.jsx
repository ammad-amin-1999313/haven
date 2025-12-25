"use client";

import React, { useState } from "react";
import { mockUserBookings } from "@/lib/data";
import BookingCardGuest from "@/components/BookingCard/BookingCardGuest";
import { useGuestBookingQuery } from "@/features/booking/useBookingQuery";
import Pagination from "@/components/Common/Pagination";

// Simple Layout wrapper for the page
function Layout({ children }) {
  return <div className="min-h-screen bg-gray-50/30">{children}</div>;
}

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  // We only use the guest data here
  const {
    data: bookingData,
    isLoading: bookingsLoading,
    isError,
    isPlaceholderData,
  } = useGuestBookingQuery({ page, limit: 10 });

  // 2. Extract the bookings array from the response object
  const bookings = bookingData?.bookings || [];
  const metadata = bookingData?.metadata;

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">
            My Bookings
          </h1>
          <p className="text-gray-500">
            View and manage all your hotel reservations
          </p>
        </div>

        {/* Bookings List */}
        <div
          className={`space-y-6 transition-opacity duration-200 ${
            isPlaceholderData ? "opacity-50" : "opacity-100"
          }`}
        >
          {bookingsLoading ? (
            // Loading State
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B2B]"></div>
            </div>
          ) : isError ? (
            // Error State
            <div className="py-20 text-center border-2 border-red-100 rounded-3xl bg-red-50">
              <p className="text-red-500 font-medium">
                Failed to load bookings. Please try again later.
              </p>
            </div>
          ) : bookings.length > 0 ? (
            // Success State: Data exists, show list AND pagination
            <>
              <div className="space-y-6">
                {bookings.map((item) => (
                  <BookingCardGuest key={item._id} booking={item} />
                ))}
              </div>

              {/* Pagination Component - Only visible here */}
              {bookingData?.metadata && (
                <Pagination
                  metadata={bookingData.metadata}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </>
          ) : (
            // Empty State
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
              <p className="text-gray-500 font-medium">
                You haven't made any bookings yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
