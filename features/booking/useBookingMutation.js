import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking, updateBooking } from "./bookingApi";
import toast from "react-hot-toast";

export function useCreateBookingMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createBooking(data),

    onSuccess: () => {
      // invalidate guest bookings list
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to send booking request"
      );
    },
  });
}

export function updateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      updateBooking({
        id,
        data,
      }),
    onSuccess: (_, variables) => {
      // Owner dashboard
      qc.invalidateQueries({ queryKey: ["owner-bookings"] });
      // Guest dashboard
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success(
        variables.decision === "approved"
          ? "Booking approved"
          : "Booking rejected"
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update booking status"
      );
    },
  });
}
