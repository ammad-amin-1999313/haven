'use client';

import React from "react";
import { mockUserBookings } from "@/lib/data";
import BookingCardGuest from "@/components/BookingCard/BookingCardGuest";

// Simple Layout wrapper for the page
function Layout({ children }) {
    return <div className="min-h-screen bg-gray-50/30">{children}</div>;
}

export default function BookingsPage() {
    // We only use the guest data here
    const data = mockUserBookings;

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
                <div className="space-y-6">
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <BookingCardGuest key={item.id} booking={item} />
                        ))
                    ) : (
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