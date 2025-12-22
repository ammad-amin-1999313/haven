"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import Button from "../ui/Button";
import { Card, CardContent } from "@/components/ui/card";

const BookingCardOwner = ({ booking }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-4 gap-6 items-center">
          <Info label="Guest Name" value={booking.guestName} />
          <Info label="Hotel" value={booking.hotelName} />
          <Info
            label="Dates"
            value={`${format(booking.checkIn)} - ${format(booking.checkOut)}`}
          />
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-4 pt-4 border-t flex gap-2 items-center">
          {booking.status === "pending" ? (
            <>
              {/* Confirm */}
              <Button
                title="Confirm"
                iconLeft={<CheckCircle2 className="h-4 w-4" />}
                className="flex-1 px-4 py-2 text-sm"
              />

              {/* Reject */}
              <Button
                title="Reject"
                iconLeft={<XCircle className="h-4 w-4" />}
                bg="bg-white"
                textColor="text-red-600"
                border="border border-red-200"
                className="flex-1 px-4 py-2 text-sm hover:bg-red-50"
              />
            </>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              ✓ Confirmed
            </p>
          )}

          {/* View Details */}
          <Button
            title="View Details"
            bg="bg-transparent"
            textColor="text-primaryColor"
            className="ml-auto px-3 py-2 text-sm hover:bg-primaryColor/10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCardOwner;
