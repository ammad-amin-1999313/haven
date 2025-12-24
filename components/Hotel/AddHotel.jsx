"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, Star, ChevronLeft, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAddHotelMutation } from "@/features/hotel/useHotelMutation";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUpload";

const MAX_IMAGES = 10;
const MAX_AMENITIES = 20;

const AddHotel = () => {
    const fileInputRef = useRef(null);
    const { mutateAsync, isPending } = useAddHotelMutation();

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
            title: "",
            capacityAdults: 2,
            quantity: 1,
            pricePerNight: "",
            amenities: [],
            images: [],
        },
    ]);

    const [images, setImages] = useState([]);
    const [amenityInput, setAmenityInput] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    // Previews
    const imagePreviews = useMemo(
        () => images.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
        [images]
    );

    // --- Handlers ---
    const handleImagesChange = (e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;
        const combined = [...images, ...selected].slice(0, MAX_IMAGES);
        setImages(combined);
        e.target.value = "";
    };

    const removeImageAt = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

    const addAmenity = () => {
        const val = amenityInput.trim().toLowerCase();
        if (!val) return;
        if (amenities.length >= MAX_AMENITIES) {
            setErrors((p) => ({ ...p, amenities: `Max ${MAX_AMENITIES} allowed` }));
            return;
        }
        if (amenities.includes(val)) {
            setAmenityInput("");
            return;
        }
        setAmenities((prev) => [...prev, val]);
        setAmenityInput("");
    };
    const addRoomType = () => {
        setRoomTypes((prev) => [
            ...prev,
            {
                title: "",
                capacityAdults: 2,
                quantity: 1,
                pricePerNight: "",
                amenities: [],
                images: [],
            },
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

    const validate = () => {
        const next = {};
        if (!formData.name.trim()) next.name = "Hotel name is required";
        if (!formData.city.trim()) next.city = "City is required";
        if (!formData.country.trim()) next.country = "Country is required";
        if (images.length === 0) next.images = "Select at least 1 image";

        if (!roomTypes.length) next.roomTypes = "At least one room type is required";

        roomTypes.forEach((rt, idx) => {
            if (!rt.title?.trim()) next[`room_${idx}_title`] = "Room title required";
            if (!rt.pricePerNight || Number(rt.pricePerNight) <= 0)
                next[`room_${idx}_price`] = "Valid room price required";
            if (!rt.capacityAdults || Number(rt.capacityAdults) < 1)
                next[`room_${idx}_cap`] = "Capacity must be at least 1";
            if (!rt.quantity || Number(rt.quantity) < 1)
                next[`room_${idx}_qty`] = "Quantity must be at least 1";
        });

        setErrors(next);
        return Object.keys(next).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const toastId = toast.loading("Preparing your property...");
        setIsUploading(true);

        try {
            // 1. Upload to Cloudinary
            const imageUrls = await uploadImagesToCloudinary(images);
            const preparedRoomTypes = roomTypes.map((rt) => ({
                title: rt.title.trim(),
                capacityAdults: Number(rt.capacityAdults),
                quantity: Number(rt.quantity),
                pricePerNight: Number(rt.pricePerNight),
            }));
            // 2. Prepare Payload
            const payload = {
                ...formData,
                amenities,
                images: imageUrls,
                roomTypes: preparedRoomTypes,
            };

            // 3. Server Mutation
            await mutateAsync(payload);

            toast.success("Hotel added successfully!", { id: toastId });

            // Reset
            setFormData({ name: "", city: "", country: "", description: "", rating: 5 });
            setImages([]);
            setAmenities([]);
            setRoomTypes([
                {
                    title: "",
                    capacityAdults: 2,
                    quantity: 1,
                    pricePerNight: "",
                    amenities: [],
                    images: [],
                },
            ]);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add hotel", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const inputClasses = (error) =>
        `w-full px-4 py-3 rounded-xl border bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition ${error ? "border-red-500" : "border-gray-200"}`;

    return (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-[#1A2B2B] mb-2">New Property Details</h2>
            <p className="text-gray-400 text-sm mb-8">Please provide accurate information about your hotel.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Hotel Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className={inputClasses(errors.name)} placeholder="Enter hotel name" />
                    {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-[#1A2B2B] mb-2">City</label>
                        <input type="text" value={formData.city} onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))} className={inputClasses(errors.city)} placeholder="City" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Country</label>
                        <input type="text" value={formData.country} onChange={(e) => setFormData(p => ({ ...p, country: e.target.value }))} className={inputClasses(errors.country)} placeholder="Country" />
                    </div>
                </div>

                {/* Images */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-[#1A2B2B]">Images</label>
                        <span className="text-xs text-gray-400 font-bold">{images.length}/{MAX_IMAGES}</span>
                    </div>
                    <div className={`${(images.length) > 1
                        ? "grid grid-cols-2 md:grid-cols-3 gap-3"
                        : "flex flex-col w-full"
                        } mb-4`}>
                        {imagePreviews.map(({ url }, idx) => (
                            <div key={idx} className="relative w-full h-[187px] rounded-xl overflow-hidden border">
                                <img src={url} alt="preview" className="h-full object-cover" />
                                <button type="button" onClick={() => removeImageAt(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1"><X size={14} /></button>
                            </div>
                        ))}
                        {images.length < MAX_IMAGES && (
                            <div onClick={() => fileInputRef.current.click()} className="h-[187px] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                <Upload className="text-gray-300" />
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImagesChange} multiple className="hidden" accept="image/*" />
                    {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
                </div>

                {/* Amenities */}
                <div>
                    <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Amenities</label>
                    <div className="flex gap-2">
                        <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())} className={inputClasses()} placeholder="Wifi, Pool..." />
                        <Button type="button" title="Add" onClick={addAmenity} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {amenities.map(a => (
                            <span key={a} className="px-3 py-1 rounded-full bg-[#2D5A4C]/10 text-[#2D5A4C] text-[10px] font-bold uppercase flex items-center gap-2">
                                {a} <X size={12} className="cursor-pointer" onClick={() => setAmenities(p => p.filter(x => x !== a))} />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={24} className={star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} onClick={() => setFormData(p => ({ ...p, rating: star }))} />
                        ))}
                    </div>
                    <input type="number" step="0.1" value={formData.rating} onChange={(e) => setFormData(p => ({ ...p, rating: e.target.value }))} className="w-16 p-2 rounded border" />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Description</label>
                    <textarea rows={4} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" />
                </div>
                {/* Room Types */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#1A2B2B]">Room Types</h3>

                    {roomTypes.map((rt, idx) => (
                        <div key={idx} className="p-6 border rounded-2xl bg-gray-50 space-y-4">
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Capacity */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1A2B2B] mb-1">
                                        Adults per Room
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rt.capacityAdults}
                                        onChange={(e) =>
                                            updateRoomType(idx, "capacityAdults", e.target.value)
                                        }
                                        className={inputClasses()}
                                        placeholder="e.g. 2"
                                    />
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1A2B2B] mb-1">
                                        Number of Rooms
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rt.quantity}
                                        onChange={(e) =>
                                            updateRoomType(idx, "quantity", e.target.value)
                                        }
                                        className={inputClasses()}
                                        placeholder="e.g. 5"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1A2B2B] mb-1">
                                        Price per Night
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={rt.pricePerNight}
                                        onChange={(e) =>
                                            updateRoomType(idx, "pricePerNight", e.target.value)
                                        }
                                        className={inputClasses(errors[`room_${idx}_price`])}
                                        placeholder="e.g. 120"
                                    />
                                    {errors[`room_${idx}_price`] && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors[`room_${idx}_price`]}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}

                    <Button type="button" title="+ Add another room type" onClick={addRoomType} />
                </div>

                <Button
                    type="submit"
                    disabled={isUploading || isPending}
                    title={isUploading || isPending ? "Processing..." : "Add Hotel"}
                    className="w-full py-4 text-lg font-bold"
                />
            </form>
        </div>
    );
};

export default AddHotel;