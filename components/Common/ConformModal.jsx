"use client";

import React, { useEffect } from "react";
import { X, Check, User, Phone, Mail, Clock } from "lucide-react";

// ✅ Reusable Confirm Modal (separate component)
// Props are kept generic so you can use it anywhere
export default function ConformModal({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
  user,
  // summary
  hotelName = "",
  checkInLabel = "",
  checkOutLabel = "",
  nights = 0,
  roomTypeTitle = "",
  guestsAdults = 1,
  roomsRequested = 1,
  currency = "USD",
  total = 0,

  // guest info state
  guestInfo,
  setGuestInfo,
}) {
  if (!open) return null;
  useEffect(() => {
    if (open) {
      setGuestInfo((prev) => ({
        ...prev,
        // Only auto-fill if the fields are currently empty
        fullName:
          prev.fullName ||
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        phone: prev.phone || user?.phone || "",
        email: prev.email || user?.email || "",
      }));
    }
  }, [open, user, setGuestInfo]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">Confirm your booking request</h3>
            <p className="text-gray-600 text-sm">
              This request will be sent to the owner for approval.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Summary */}
        <div className="border rounded-xl p-4 bg-gray-50 mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Hotel</span>
            <span className="font-semibold">{hotelName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Dates</span>
            <span className="font-semibold">
              {checkInLabel} → {checkOutLabel} ({nights} night
              {nights === 1 ? "" : "s"})
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Room Type</span>
            <span className="font-semibold">{roomTypeTitle}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Guests / Rooms</span>
            <span className="font-semibold">
              {guestsAdults} adults • {roomsRequested} room(s)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Estimated total</span>
            <span className="font-bold">
              {currency} {total}
            </span>
          </div>
        </div>

        {/* Guest Info */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-800">
            Guest Information
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={guestInfo.fullName}
                onChange={(e) =>
                  setGuestInfo((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="Full name"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={guestInfo.phone}
                onChange={(e) =>
                  setGuestInfo((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="Phone (WhatsApp)"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={guestInfo.email}
                onChange={(e) =>
                  setGuestInfo((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="Email (optional)"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300"
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={guestInfo.arrivalTime}
                onChange={(e) =>
                  setGuestInfo((p) => ({ ...p, arrivalTime: e.target.value }))
                }
                placeholder="Arrival time (optional)"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300"
              />
            </div>
          </div>

          <textarea
            rows={3}
            value={guestInfo.notes}
            onChange={(e) =>
              setGuestInfo((p) => ({ ...p, notes: e.target.value }))
            }
            placeholder="Special requests (optional) - late check-in, extra pillows, etc."
            className="w-full px-3 py-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-md bg-green-700 text-white hover:bg-green-800 px-4 py-2 text-sm font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">Submitting...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirm & Submit
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Your request will be marked as{" "}
          <span className="font-semibold">Pending</span> until owner approval.
        </p>
      </div>
    </div>
  );
}
