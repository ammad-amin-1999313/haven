import { api } from "@/lib/apiClient";

export async function createBooking(data) {
  const res = await api.post("/api/booking/create-booking", data);
  return res.data;
}

export async function updateBooking({ id, data }) {
  const res = await api.patch(`/api/booking/${id}/decision`, data);
  return res?.data;
}

export async function guestBookingsList({ page = 1, limit = 10, status } = {}) {
  const params = { page, limit };
  if (status) params.status = status;

  const res = await api.get("/api/booking/my-bookings", { params });
  return res.data;
}

export async function ownerBookingsList({ page = 1, limit = 10, status } = {}) {
  const params = { page, limit };
  if (status) params.status = status;

  const res = await api.get("/api/booking/owner-booking-list", { params });
  return res.data;
}
