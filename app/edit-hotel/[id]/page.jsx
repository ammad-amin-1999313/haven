"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Upload, Star, ChevronLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useSingleHotelQuery } from "@/features/hotel/useHotelsQuery";
import { useEditHotelDataMutation } from "@/features/hotel/useHotelMutation";

const MAX_IMAGES = 10;
const CURRENCIES = ["USD", "PKR", "EUR", "GBP", "AED"];

export default function EditHotelPage() {
    const { id: hotelId } = useParams();
    const router = useRouter();
    const fileInputRef = useRef(null);

    // --- API QUERIES & MUTATIONS ---
    const { data: hotel, isLoading } = useSingleHotelQuery(hotelId);
    const { mutate: updateHotel, isPending: isUpdating } = useEditHotelDataMutation();

    // --- UI & DATA STATES ---
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        country: "",
        description: "",
        rating: 5,
        startingPricePerNight: "",
        currency: "USD",
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [amenityInput, setAmenityInput] = useState("");
    const [amenities, setAmenities] = useState([]);

    // --- SYNC STATE WITH INCOMING DATA ---
    useEffect(() => {
        if (hotel) {
            // Adjust 'hotel.hotel' based on if your API wraps the object
            const h = hotel;

            setFormData({
                name: h.name || "",
                city: h.city || "",
                country: h.country || "",
                description: h.description || "",
                rating: h.rating || 5,
                startingPricePerNight: h.startingPricePerNight || "",
                currency: h.currency || "USD",
            });
            setExistingImages(h.images || []);
            setAmenities(h.amenities || []);
        }
    }, [hotel]);

    // --- HANDLERS ---
    const handleSave = () => {
        const data = new FormData();

        // Append text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        // Append arrays (backend usually expects JSON string for multipart or multiple keys)
        data.append("amenities", JSON.stringify(amenities));
        data.append("existingImages", JSON.stringify(existingImages));
        
        // Append new files
        newImageFiles.forEach((file) => {
            data.append("images", file);
        });

        updateHotel({ id: hotelId, data });
    };

    const handleImagesChange = (e) => {
        const selected = Array.from(e.target.files || []);
        setNewImageFiles([...newImageFiles, ...selected].slice(0, MAX_IMAGES - existingImages.length));
        e.target.value = "";
    };

    const removeExistingImage = (url) => setExistingImages(prev => prev.filter(img => img !== url));
    const removeNewImage = (idx) => setNewImageFiles(prev => prev.filter((_, i) => i !== idx));

    const addAmenity = () => {
        const val = amenityInput.trim().toLowerCase();
        if (!val || amenities.includes(val)) return;
        setAmenities([...amenities, val]);
        setAmenityInput("");
    };

    const handleNumericRating = (e) => {
        let val = parseFloat(e.target.value);
        setFormData({ ...formData, rating: Math.min(5, Math.max(0, val || 0)) });
    };

    const newImagePreviews = useMemo(
        () => newImageFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
        [newImageFiles]
    );

    const inputClasses = `w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition`;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F7F5]">
            <Loader2 className="animate-spin text-[#2D5A4C]" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9F7F5] py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <Link href="/owner-hotels" className="flex items-center gap-2 text-gray-500 hover:text-[#2D5A4C] mb-6 font-bold text-sm">
                    <ChevronLeft size={16} /> Back to My Hotels
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">Edit Hotel</h1>
                    <p className="text-gray-500 text-sm">Property ID: <span className="font-mono text-[#2D5A4C]">{hotelId}</span></p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        {/* Hotel Name */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Hotel Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClasses} />
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">City</label>
                                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Country</label>
                                <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={inputClasses} />
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Price per Night</label>
                                <input type="number" value={formData.startingPricePerNight} onChange={(e) => setFormData({ ...formData, startingPricePerNight: e.target.value })} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Currency</label>
                                <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className={inputClasses}>
                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-4">Property Images ({existingImages.length + newImageFiles.length}/{MAX_IMAGES})</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {existingImages.map((url, idx) => (
                                    <div key={`ex-${idx}`} className="relative h-40 rounded-2xl overflow-hidden border shadow-sm">
                                        <img src={url} className="w-full h-full object-cover" alt="current" />
                                        <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/40 text-[8px] text-white text-center py-1 font-bold">CURRENT</div>
                                    </div>
                                ))}
                                {newImagePreviews.map(({ url }, idx) => (
                                    <div key={`new-${idx}`} className="relative h-40 rounded-2xl overflow-hidden border-2 border-dashed border-[#2D5A4C]/30">
                                        <img src={url} className="w-full h-full object-cover" alt="new" />
                                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full"><X size={14} /></button>
                                        <div className="absolute bottom-0 inset-x-0 bg-[#2D5A4C] text-[8px] text-white text-center py-1 font-bold">NEW</div>
                                    </div>
                                ))}
                                {(existingImages.length + newImageFiles.length) < MAX_IMAGES && (
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="h-40 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-[#2D5A4C] bg-gray-50/50">
                                        <Upload size={24} />
                                        <span className="text-[10px] font-bold mt-2">ADD MORE</span>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImagesChange} multiple className="hidden" accept="image/*" />
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Amenities</label>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())} placeholder="e.g. WiFi" className={inputClasses} />
                                <Button type="button" title="Add" onClick={addAmenity} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {amenities.map(a => (
                                    <span key={a} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A4C]/10 text-[#2D5A4C] text-[10px] font-bold uppercase border border-[#2D5A4C]/20">
                                        {a} <X size={12} className="cursor-pointer" onClick={() => setAmenities(prev => prev.filter(x => x !== a))} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={28} className={`${star <= Math.round(formData.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                                ))}
                            </div>
                            <input type="number" step="0.1" max="5" min="0" value={formData.rating} onChange={handleNumericRating} className="w-20 px-2 py-1 font-bold text-[#2D5A4C] rounded border" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Description</label>
                            <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClasses} resize-none`} />
                        </div>

                        {/* Actions */}
                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={isUpdating}
                                title={isUpdating ? "Saving..." : "Save Changes"}
                                iconLeft={isUpdating ? <Loader2 className="animate-spin" size={18} /> : null}
                                className="flex-1 py-4 text-lg"
                            />
                            <Button type="button" variant="outline" title="Cancel" onClick={() => router.back()} className="flex-1 py-4 text-lg" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}