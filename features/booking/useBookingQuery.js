import { useQuery } from "@tanstack/react-query";
import { guestBookingsList, ownerBookingsList } from "./bookingApi";

export function useGuestBookingQuery(params) {
  return useQuery({
    queryKey: ["my-bookings", params],
    queryFn: () => guestBookingsList(params),
    keepPreviousData: true,
  });
}

export function useOwnerBookingQuery(params) {
  return useQuery({
    queryKey: ["owner-bookings", params],
    queryFn: () => ownerBookingsList(params),
    keepPreviousData: true,
  });
}
