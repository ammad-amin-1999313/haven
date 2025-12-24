import { api } from "@/lib/apiClient";

export async function addHotel(payload) {
    const res = await api.post("/api/hotels/add-hotel", payload);
    return res.data;
}

export async function fetchHotels({ page = 1, limit = 10, search, amenities, rating, price } = {}) {
    const res = await api.get("/api/hotels", { params: { page, limit, search, amenities, rating, price } });
    return res.data;
}

export async function fetchSingleHotel(id) {
    const res = await api.get(`/api/hotels/hotel-details/${id}`)
    return res.data
}

export async function fetchOwnerHotels() {
    const res = await api.get("/api/hotels/owner-hotels")
    return res.data
}

export async function updateHotel({ id, data }) {
    const res = await api.patch(`/api/hotels/edit-hotel/${id}`, data);
    return res.data;
}
