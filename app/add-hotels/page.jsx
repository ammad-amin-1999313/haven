"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, Star, ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const MAX_IMAGES = 10;
const MAX_AMENITIES = 20;

export default function AddHotelPage() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    description: "",
    rating: 5,
    status: "available",
    // amenities handled separately but you can keep it here if you prefer
  });

  // Images
  const [images, setImages] = useState([]); // File[]
  const imagePreviews = useMemo(
    () => images.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [images]
  );

  // Amenities
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState([]); // string[]

  const [errors, setErrors] = useState({});

  // ---------- Handlers ----------
  const triggerFileInput = () => fileInputRef.current?.click();

  const handleImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);

    if (!selected.length) return;

    // Enforce max images
    const combined = [...images, ...selected].slice(0, MAX_IMAGES);
    setImages(combined);

    // reset input so user can re-select same files
    e.target.value = "";
  };

  const removeImageAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRating = (value) => setFormData((p) => ({ ...p, rating: value }));

  const normalizeAmenity = (s) =>
    s
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const addAmenity = () => {
    const raw = amenityInput;
    const val = normalizeAmenity(raw);
    if (!val) return;

    // limit
    if (amenities.length >= MAX_AMENITIES) {
      setErrors((p) => ({
        ...p,
        amenities: `Max ${MAX_AMENITIES} amenities allowed`,
      }));
      return;
    }

    // avoid duplicates (case-insensitive)
    if (amenities.includes(val)) {
      setAmenityInput("");
      return;
    }

    setAmenities((prev) => [...prev, val]);
    setAmenityInput("");
    setErrors((p) => ({ ...p, amenities: "" }));
  };

  const removeAmenity = (val) => {
    setAmenities((prev) => prev.filter((a) => a !== val));
  };

  const handleAmenityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Hotel name is required";
    if (!formData.city.trim()) next.city = "City is required";
    if (!formData.country.trim()) next.country = "Country is required";
    if (images.length === 0) next.images = "Please select at least 1 image";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ✅ No API yet — just prepares payload shape for later
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // This is what you will later send to Cloudinary + backend:
    // - images (File[]) -> upload to cloudinary -> urls[]
    // - amenities (string[]) -> send directly
    const draftPayload = {
      ...formData,
      amenities,
      images, // File[] for now (later becomes imageUrls[])
    };

    console.log("READY FOR API payload draft:", draftPayload);
    // Later: upload images -> get urls -> send to backend
  };

  const inputClasses = (error) =>
    `w-full px-4 py-3 rounded-xl border bg-[#FDFDFD]
     focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition
     ${error ? "border-red-500" : "border-gray-200"}`;

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation */}
        <Link
          href="/owner-hotels"
          className="flex items-center gap-2 text-gray-500 hover:text-[#2D5A4C] transition-colors mb-6 font-bold text-sm"
        >
          <ChevronLeft size={16} />
          Back to My Hotels
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">
            Add Hotel
          </h1>
          <p className="text-gray-500">
            Fill out the form below to add your hotel listing.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-[#1A2B2B] mb-2">
            New Property Details
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Please provide accurate information about your hotel.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Hotel Name */}
            <div>
              <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                Hotel Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Enter hotel name"
                className={inputClasses(errors.name)}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="Enter hotel city"
                className={inputClasses(errors.city)}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {errors.city}
                </p>
              )}
            </div>

            {/* Country */}
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
                placeholder="Enter hotel country"
                className={inputClasses(errors.country)}
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {errors.country}
                </p>
              )}
            </div>

            {/* Images Upload Section (Multiple) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                  Images
                </label>
                <p className="text-xs text-gray-400 font-bold">
                  {images.length}/{MAX_IMAGES}
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImagesChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              <Button
                type="button"
                onClick={triggerFileInput}
                title="Upload Images"
                iconLeft={<Upload size={18} />}
                className="mb-4 shadow-md"
              />

              {errors.images && (
                <p className="text-sm text-red-500 mb-3 font-medium">
                  {errors.images}
                </p>
              )}

              {/* Preview Grid */}
              {images.length === 0 ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center">
                  <div className="text-gray-300 flex flex-col items-center gap-2">
                    <ImageIcon size={48} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      No Images Selected
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imagePreviews.map(({ url }, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video"
                    >
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(idx)}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">
                Tip: Choose a cover image first — we’ll use the first image as the main photo.
              </p>
            </div>

            {/* Amenities (Array, max 20) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                  Amenities
                </label>
                <p className="text-xs text-gray-400 font-bold">
                  {amenities.length}/{MAX_AMENITIES}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={handleAmenityKeyDown}
                  placeholder="e.g. wifi, parking, pool"
                  className={inputClasses(errors.amenities)}
                />
                <Button
                  type="button"
                  title="Add"
                  onClick={addAmenity}
                  className="px-5"
                />
              </div>

              {errors.amenities && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {errors.amenities}
                </p>
              )}

              {amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A4C]/10 text-[#2D5A4C] text-xs font-bold"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => removeAmenity(a)}
                        className="text-[#2D5A4C] hover:opacity-70"
                        aria-label={`Remove ${a}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-[#1A2B2B] mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer transition-all hover:scale-110 ${
                      star <= formData.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
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
                placeholder="Describe your property..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition resize-none"
              />
            </div>

            {/* Save */}
            <div className="pt-6 flex justify-center border-t border-gray-50">
              <Button
                type="submit"
                title="Save Hotel"
                className="w-full max-w-xs py-4 text-lg font-bold shadow-lg shadow-[#2D5A4C]/20 hover:shadow-xl"
                rounded="rounded-xl"
              />
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
