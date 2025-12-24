"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Upload, Star, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useSingleHotelQuery } from "@/features/hotel/useHotelsQuery";
import { useEditHotelDataMutation } from "@/features/hotel/useHotelMutation";
import toast from "react-hot-toast";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUpload";

const MAX_IMAGES = 10;

export default function EditHotel({ hotelId }) {
    const router = useRouter();
    const fileInputRef = useRef(null);

    // --- API ---
    const { data, isLoading } = useSingleHotelQuery(hotelId);
    const hotelDoc = data?.hotel;          // ✅ actual hotel document
    const apiRoomTypes = data?.roomTypes;  // ✅ room types array

    const { mutate: updateHotel, isPending: isUpdatingMutation } =
        useEditHotelDataMutation();

    const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);

    // --- FORM STATES ---
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        country: "",
        description: "",
        rating: 5,
        currency: "USD",
    });

    const [roomTypes, setRoomTypes] = useState([
        {
            // _id is optional (present for existing room types)
            title: "",
            capacityAdults: 2,
            quantity: 1,
            pricePerNight: "",
        },
    ]);

    const [existingImages, setExistingImages] = useState([]); // url strings
    const [newImageFiles, setNewImageFiles] = useState([]);   // File[]
    const [amenityInput, setAmenityInput] = useState("");
    const [amenities, setAmenities] = useState([]);

    const [errors, setErrors] = useState({});

    // --- SYNC API -> STATE ---
    useEffect(() => {
        if (!hotelDoc) return;

        setFormData({
            name: hotelDoc.name || "",
            city: hotelDoc.city || "",
            country: hotelDoc.country || "",
            description: hotelDoc.description || "",
            rating: typeof hotelDoc.rating === "number" ? hotelDoc.rating : 5,
            currency: hotelDoc.currency || "USD",
        });

        setExistingImages(Array.isArray(hotelDoc.images) ? hotelDoc.images : []);
        setAmenities(Array.isArray(hotelDoc.amenities) ? hotelDoc.amenities : []);

        if (Array.isArray(apiRoomTypes) && apiRoomTypes.length > 0) {
            setRoomTypes(
                apiRoomTypes.map((rt) => ({
                    _id: rt._id, // ✅ critical for update
                    title: rt.title ?? "",
                    capacityAdults: rt.capacityAdults ?? 2,
                    quantity: rt.quantity ?? 1,
                    pricePerNight: rt.pricePerNight ?? "",
                }))
            );
        } else {
            // fallback: at least one room type UI
            setRoomTypes([
                { title: "", capacityAdults: 2, quantity: 1, pricePerNight: "" },
            ]);
        }
    }, [hotelDoc, apiRoomTypes]);

    // --- ROOM TYPE HELPERS ---
    const addRoomType = () => {
        setRoomTypes((prev) => [
            ...prev,
            { title: "", capacityAdults: 2, quantity: 1, pricePerNight: "" },
        ]);
    };

    const removeRoomType = (index) => {
        setRoomTypes((prev) => prev.filter((_, i) => i !== index));
    };

    const updateRoomType = (index, field, value) => {
        setRoomTypes((prev) =>
            prev.map((rt, i) => (i === index ? { ...rt, [field]: value } : rt))
        );
    };

    // --- HOTEL IMAGES ---
    const handleImagesChange = (e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;

        const currentTotal = existingImages.length + newImageFiles.length;
        const spaceLeft = Math.max(0, MAX_IMAGES - currentTotal);

        if (spaceLeft === 0) {
            toast.error(`You already have ${MAX_IMAGES} images.`);
            e.target.value = "";
            return;
        }

        if (selected.length > spaceLeft) {
            toast.error(`You can only add ${spaceLeft} more images.`);
        }

        setNewImageFiles((prev) => [...prev, ...selected].slice(0, spaceLeft));
        e.target.value = "";
    };

    const newImagePreviews = useMemo(
        () => newImageFiles.map((f) => ({ url: URL.createObjectURL(f) })),
        [newImageFiles]
    );

    // --- AMENITIES ---
    const addAmenity = () => {
        const val = amenityInput.trim().toLowerCase();
        if (!val) return;
        if (amenities.includes(val)) {
            setAmenityInput("");
            return;
        }
        setAmenities((prev) => [...prev, val]);
        setAmenityInput("");
    };

    // --- VALIDATION ---
    const validate = () => {
        const next = {};

        if (!formData.name.trim()) next.name = "Hotel name is required";
        if (!formData.city.trim()) next.city = "City is required";
        if (!formData.country.trim()) next.country = "Country is required";

        const totalImgs = existingImages.length + newImageFiles.length;
        if (totalImgs === 0) next.images = "Select at least 1 image";

        if (!roomTypes.length) next.roomTypes = "At least one room type is required";

        roomTypes.forEach((rt, idx) => {
            if (!rt.title?.trim()) next[`room_${idx}_title`] = "Room title required";

            const cap = Number(rt.capacityAdults);
            if (!cap || cap < 1) next[`room_${idx}_cap`] = "Capacity must be at least 1";

            const qty = Number(rt.quantity);
            if (!qty || qty < 1) next[`room_${idx}_qty`] = "Quantity must be at least 1";

            const price = Number(rt.pricePerNight);
            if (!price || price <= 0) next[`room_${idx}_price`] = "Valid room price required";
        });

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // --- SAVE (single API) ---
    const handleSave = async () => {
        if (!validate()) {
            toast.error("Please fix the errors before saving.");
            return;
        }

        const toastId = toast.loading("Saving changes...");
        setIsUploadingCloudinary(true);

        try {
            // 1) Hotel images: only upload new ones
            let finalImageUrls = [...existingImages];
            if (newImageFiles.length > 0) {
                const uploadedUrls = await uploadImagesToCloudinary(newImageFiles);
                finalImageUrls = [...finalImageUrls, ...uploadedUrls].slice(0, MAX_IMAGES);
            }

            // 2) Prepare room types for backend (keep _id if exists)
            const preparedRoomTypes = roomTypes.map((rt) => ({
                ...(rt._id ? { _id: rt._id } : {}),
                title: rt.title.trim(),
                capacityAdults: Number(rt.capacityAdults),
                quantity: Number(rt.quantity),
                pricePerNight: Number(rt.pricePerNight),
            }));

            // 3) Build payload that matches backend controller
            const payload = {
                hotel: {
                    name: formData.name.trim(),
                    city: formData.city.trim(),
                    country: formData.country.trim(),
                    description: formData.description || "",
                    rating: Number(formData.rating),
                    currency: formData.currency,
                    amenities,
                    images: finalImageUrls,
                },
                roomTypes: preparedRoomTypes,
            };

            updateHotel({ id: hotelId, data: payload },);
        } catch (err) {
            toast.error(err?.message || "Update failed", { id: toastId });
        } finally {
            setIsUploadingCloudinary(false);
        }
    };

    const handleNumericRating = (e) => {
        const val = parseFloat(e.target.value);
        const clamped = Math.min(5, Math.max(0, Number.isFinite(val) ? val : 0));
        setFormData((p) => ({ ...p, rating: clamped }));
    };

    const isProcessing = isUpdatingMutation || isUploadingCloudinary;

    const inputClasses = (error) =>
        `w-full px-4 py-3 rounded-xl border bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition ${error ? "border-red-500" : "border-gray-200"
        }`;

    if (isLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#2D5A4C]" size={40} />
                <p className="text-gray-400 animate-pulse">Fetching property data...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                        Hotel Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className={inputClasses(errors.name)}
                        placeholder="Property Name"
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                            className={inputClasses(errors.city)}
                        />
                        {errors.city && <p className="text-sm text-red-500 mt-2">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, country: e.target.value }))
                            }
                            className={inputClasses(errors.country)}
                        />
                        {errors.country && (
                            <p className="text-sm text-red-500 mt-2">{errors.country}</p>
                        )}
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-bold text-[#1A2B2B] mb-4">
                        Photos ({existingImages.length + newImageFiles.length}/{MAX_IMAGES})
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((url, i) => (
                            <div
                                key={`ex-${i}`}
                                className="relative h-34 rounded-xl overflow-hidden border group"
                            >
                                <img src={url} className="w-full h-full object-cover" alt="existing" />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExistingImages((prev) => prev.filter((img) => img !== url))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {newImagePreviews.map((img, i) => (
                            <div
                                key={`new-${i}`}
                                className="relative h-34 rounded-xl border-2 border-[#2D5A4C] overflow-hidden group"
                            >
                                <img src={img.url} className="w-full h-full object-cover" alt="new" />
                                <button
                                    type="button"
                                    onClick={() => setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 bg-black text-white p-1 rounded-full"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {(existingImages.length + newImageFiles.length) < MAX_IMAGES && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-[#2D5A4C] hover:border-[#2D5A4C] transition"
                            >
                                <Upload size={20} />
                                <span className="text-[10px] font-bold mt-1">UPLOAD</span>
                            </button>
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImagesChange}
                        multiple
                        className="hidden"
                        accept="image/*"
                    />

                    {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images}</p>}
                </div>

                {/* Amenities */}
                <div>
                    <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                        Amenities
                    </label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                            placeholder="WiFi, Parking..."
                            className={inputClasses()}
                        />
                        <Button type="button" title="Add" onClick={addAmenity} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {amenities.map((a) => (
                            <span
                                key={a}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A4C]/10 text-[#2D5A4C] text-[10px] font-bold uppercase border border-[#2D5A4C]/20"
                            >
                                {a}
                                <X
                                    size={12}
                                    className="cursor-pointer hover:text-red-500"
                                    onClick={() => setAmenities((prev) => prev.filter((x) => x !== a))}
                                />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Rating & Description */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={28}
                                    className={`${star <= Math.round(formData.rating)
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-gray-200"
                                        } cursor-pointer`}
                                    onClick={() => setFormData((p) => ({ ...p, rating: star }))}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">
                                Exact Rating:
                            </span>
                            <input
                                type="number"
                                step="0.1"
                                max="5"
                                min="0"
                                value={formData.rating}
                                onChange={handleNumericRating}
                                className="w-16 px-2 py-1 font-bold text-[#2D5A4C] rounded border text-center"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, description: e.target.value }))
                            }
                            className={`${inputClasses()} resize-none`}
                            placeholder="Describe the property..."
                        />
                    </div>
                </div>

                {/* Room Types */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#1A2B2B]">Room Types</h3>

                    {errors.roomTypes && <p className="text-sm text-red-500">{errors.roomTypes}</p>}

                    {roomTypes.map((rt, idx) => (
                        <div key={rt._id ?? idx} className="p-6 border rounded-2xl bg-gray-50 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold">Room Type {idx + 1}</h4>
                                {roomTypes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRoomType(idx)}
                                        className="text-red-500 text-sm font-bold"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <input
                                placeholder="Room title (e.g. Deluxe Double)"
                                value={rt.title}
                                onChange={(e) => updateRoomType(idx, "title", e.target.value)}
                                className={inputClasses(errors[`room_${idx}_title`])}
                            />
                            {errors[`room_${idx}_title`] && (
                                <p className="text-xs text-red-500">{errors[`room_${idx}_title`]}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#1A2B2B] mb-1">
                                        Adults per Room
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rt.capacityAdults}
                                        onChange={(e) => updateRoomType(idx, "capacityAdults", e.target.value)}
                                        className={inputClasses(errors[`room_${idx}_cap`])}
                                    />
                                    {errors[`room_${idx}_cap`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`room_${idx}_cap`]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#1A2B2B] mb-1">
                                        Number of Rooms
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rt.quantity}
                                        onChange={(e) => updateRoomType(idx, "quantity", e.target.value)}
                                        className={inputClasses(errors[`room_${idx}_qty`])}
                                    />
                                    {errors[`room_${idx}_qty`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`room_${idx}_qty`]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#1A2B2B] mb-1">
                                        Price per Night
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={rt.pricePerNight}
                                        onChange={(e) => updateRoomType(idx, "pricePerNight", e.target.value)}
                                        className={inputClasses(errors[`room_${idx}_price`])}
                                    />
                                    {errors[`room_${idx}_price`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`room_${idx}_price`]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button type="button" title="+ Add another room type" onClick={addRoomType} />
                </div>

                {/* Actions */}
                <div className="pt-8 flex flex-col sm:flex-row gap-4 border-t border-gray-50">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isProcessing}
                        title={isProcessing ? "Processing..." : "Save Changes"}
                        iconLeft={isProcessing ? <Loader2 className="animate-spin" size={18} /> : null}
                        className="flex-1 py-4 text-lg"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        title="Cancel"
                        onClick={() => router.back()}
                        className="flex-1 py-4 text-lg"
                    />
                </div>
            </form>
        </div>
    );
}
