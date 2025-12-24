"use client";

import React from "react";
import { X, Clock } from "lucide-react";

export default function PendingModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 mt-2">
          <div className="bg-amber-100 rounded-full p-3">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>

          <h3 className="font-bold text-lg">Request Sent</h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Your booking request has been sent successfully.
            <br />
            <span className="font-medium">
              The owner will approve or reject your request soon.
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 rounded-md bg-green-700 text-white hover:bg-green-800 px-4 py-2 text-sm font-medium"
        >
          Got it
        </button>

        <p className="text-xs text-gray-500 mt-3">
          You can track the status in <span className="font-semibold">Profile → Requests</span>
        </p>
      </div>
    </div>
  );
}
