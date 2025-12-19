"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, Star, ChevronLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditHotelPage() {
    const params = useParams();
    const router = useRouter();
    const hotelId = params.id;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        description: "",
        rating: 5,
        status: "available",
    });

    const [imagePreview, setImagePreview] = useState(null);

    // 1. Fetch existing hotel data using the ID from the URL
    useEffect(() => {
        if (hotelId) {
            // Logic for fetching hotel by ID from your API would go here
            // For now, we use mock data to demonstrate the edit state
            setFormData({
                name: "The Grand Horizon Resort",
                location: "Malibu, California",
                description: "A luxury seaside experience with panoramic views and world-class amenities.",
                rating: 5,
                status: "available",
            });
            setImagePreview("https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800");
        }
    }, [hotelId]);

    // 2. Image Handling
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleRating = (value) => setFormData({ ...formData, rating: value });

    // 3. Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Updating Hotel ID:", hotelId, "Data:", formData);

        // Example: await fetch(`/api/hotels/${hotelId}`, { method: 'PUT', body: JSON.stringify(formData) })

        // After success, navigate back
        router.push("/owner-hotels");
    };

    return (
        <div className="min-h-screen bg-[#F9F7F5] py-12 px-4">
            <div className="container mx-auto max-w-4xl">

                {/* Back Link */}
                <Link
                    href="/owner-hotels"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#2D5A4C] transition-colors mb-6 font-bold text-sm"
                >
                    <ChevronLeft size={16} />
                    Back to My Hotels
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">Edit Hotel</h1>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-serif font-bold text-[#1A2B2B] mb-2">Update Property</h2>
                    <p className="text-gray-400 text-sm mb-8">Modify the details below and save your changes.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Hotel Name */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Hotel Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter hotel name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Enter hotel location"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition"
                                required
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Property Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="flex items-center gap-2 bg-[#2D5A4C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold mb-4 hover:bg-[#23473b] transition-all shadow-md"
                            >
                                <Upload size={18} />
                                Change Image
                            </button>

                            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center group">
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-700">
                                                Click Change Image to replace
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-2">
                                        <ImageIcon size={48} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No Image Uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Star Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        className={`cursor-pointer transition-all hover:scale-110 ${star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                                        onClick={() => handleRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your property..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition resize-none"
                                required
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-bold text-[#1A2B2B] mb-4">Availability Status</label>
                            <div className="flex items-center gap-8">
                                <StatusRadio
                                    label="Available"
                                    checked={formData.status === "available"}
                                    onChange={() => setFormData({ ...formData, status: "available" })}
                                />
                                <StatusRadio
                                    label="Unavailable"
                                    checked={formData.status === "unavailable"}
                                    onChange={() => setFormData({ ...formData, status: "unavailable" })}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center border-t border-gray-50">
                            <button
                                type="submit"
                                className="w-full  bg-[#2D5A4C] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#2D5A4C]/20 hover:bg-[#23473b] hover:shadow-xl transition-all transform active:scale-95"
                            >
                                Save Changes
                            </button>
                            <Link
                                href="/owner-hotels"
                                className="w-full  bg-white text-gray-400 py-4 rounded-xl font-bold text-lg border border-gray-200 text-center hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <footer className="mt-20 text-center pb-8">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
                    © 2024 Haven. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

// Helper Radio Component
function StatusRadio({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
                <input
                    type="radio"
                    className="peer hidden"
                    checked={checked}
                    onChange={onChange}
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#2D5A4C] transition" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A4C]" />
                </div>
            </div>
            <span className={`text-sm font-bold transition-colors ${checked ? "text-[#1A2B2B]" : "text-gray-400 group-hover:text-gray-600"}`}>
                {label}
            </span>
        </label>
    );
}