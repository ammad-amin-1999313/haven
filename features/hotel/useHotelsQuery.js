import { useQuery } from "@tanstack/react-query";
import { fetchHotels, fetchOwnerHotels, fetchSingleHotel } from "./hotelApi";

export function useHotelsQuery(params) {
  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () => fetchHotels(params),
    keepPreviousData: true,
  });
}

export function useSingleHotelQuery(id) {
  return useQuery({
    queryKey: ["single-hotel", id],
    queryFn: () => fetchSingleHotel(id),
    enabled: !!id,
  })
}

export function useOwnerHotelDataQuery(ownerId) {
  return useQuery({
    queryKey: ["owner-hotels", ownerId],
    queryFn: () => fetchOwnerHotels(ownerId),
    enabled: !!ownerId,
  })
}
