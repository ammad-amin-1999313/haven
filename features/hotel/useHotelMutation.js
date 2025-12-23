import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHotel, editHotelData } from "./hotelApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// add hotel mutation hook
export function useAddHotelMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addHotel,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["hotels"] });
        },
    });
}

export function useEditHotelDataMutation() {
    const qc = useQueryClient();
    const router = useRouter()
    return useMutation({
        mutationFn: ({ id, formData }) => editHotelData(id, formData),
        onSuccess: (data, variables) => {
            qc.invalidateQueries(["hotels"]);
            qc.invalidateQueries(["hotel", variables.id]);
            toast.success("Hotel updated successfully")
            router.push("/owner-hotels");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update hotel");
        }
    });
}