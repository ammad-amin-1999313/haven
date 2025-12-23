"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, Star, ChevronLeft, Image as ImageIcon, X, DollarSign } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAddHotelMutation } from "@/features/hotel/useHotelMutation";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUpload";

const MAX_IMAGES = 10;
const MAX_AMENITIES = 20;

const CURRENCIES = ["USD", "PKR", "EUR", "GBP", "AED"];

export default function AddHotelPage() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    description: "",
    rating: 5,
    startingPricePerNight: "", // Changed to string for input handling
    currency: "USD",
  });

  // Images
  const [images, setImages] = useState([]);
  const imagePreviews = useMemo(
    () => images.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [images]
  );

  // Amenities
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState([]);

  const [errors, setErrors] = useState({});
  const { mutateAsync, isPending } = useAddHotelMutation();
  const [isUploading, setIsUploading] = useState(false);

  // ---------- Handlers ----------
  const triggerFileInput = () => fileInputRef.current?.click();

  const handleImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const combined = [...images, ...selected].slice(0, MAX_IMAGES);
    setImages(combined);
    e.target.value = "";
  };

  const removeImageAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRating = (value) => setFormData((p) => ({ ...p, rating: value }));
  const handleNumericRating = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    if (val > 5) val = 5;
    if (val < 0) val = 0;
    setFormData((p) => ({ ...p, rating: val }));
  };

  const normalizeAmenity = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

  const addAmenity = () => {
    const val = normalizeAmenity(amenityInput);
    if (!val) return;
    if (amenities.length >= MAX_AMENITIES) {
      setErrors((p) => ({ ...p, amenities: `Max ${MAX_AMENITIES} amenities allowed` }));
      return;
    }
    if (amenities.includes(val)) {
      setAmenityInput("");
      return;
    }
    setAmenities((prev) => [...prev, val]);
    setAmenityInput("");
    setErrors((p) => ({ ...p, amenities: "" }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Hotel name is required";
    if (!formData.city.trim()) next.city = "City is required";
    if (!formData.country.trim()) next.country = "Country is required";
    if (!formData.startingPricePerNight || Number(formData.startingPricePerNight) <= 0) {
      next.price = "Valid price is required";
    }
    if (images.length === 0) next.images = "Please select at least 1 image";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let imageUrls = [];
    try {
      setIsUploading(true);
      imageUrls = await uploadImagesToCloudinary(images);
    } catch (err) {
      toast.error("Network error during image upload");
      setIsUploading(false);
      return;
    } finally {
      setIsUploading(false);
    }

    const payload = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      description: formData.description?.trim() || "",
      rating: formData.rating,
      startingPricePerNight: Number(formData.startingPricePerNight),
      currency: formData.currency,
      amenities,
      images: imageUrls,
    };

    try {
      await mutateAsync(payload);
      toast.success("Hotel added successfully!");
      // Reset form logic
      setFormData({ name: "", city: "", country: "", description: "", rating: 5, startingPricePerNight: "", currency: "USD" });
      setImages([]);
      setAmenities([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add hotel");
    }
  };

  const inputClasses = (error) =>
    `w-full px-4 py-3 rounded-xl border bg-[#FDFDFD]
     focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/20 transition
     ${error ? "border-red-500" : "border-gray-200"}`;

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/owner-hotels" className="flex items-center gap-2 text-gray-500 hover:text-[#2D5A4C] transition-colors mb-6 font-bold text-sm">
          <ChevronLeft size={16} /> Back to My Hotels
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">Add Hotel</h1>
          <p className="text-gray-500">Fill out the form below to add your hotel listing.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-[#1A2B2B] mb-2">New Property Details</h2>
          <p className="text-gray-400 text-sm mb-8">Please provide accurate information about your hotel.</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Hotel Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className={inputClasses(errors.name)} placeholder="Enter hotel name" />
              {errors.name && <p className="text-sm text-red-500 mt-2 font-medium">{errors.name}</p>}
            </div>

            {/* Location Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} className={inputClasses(errors.city)} placeholder="City" />
                {errors.city && <p className="text-sm text-red-500 mt-2 font-medium">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Country</label>
                <input type="text" value={formData.country} onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))} className={inputClasses(errors.country)} placeholder="Country" />
                {errors.country && <p className="text-sm text-red-500 mt-2 font-medium">{errors.country}</p>}
              </div>
            </div>

            {/* Pricing Group */}
            <div className="py-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Starting Price per Night</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.startingPricePerNight}
                      onChange={(e) => setFormData((p) => ({ ...p, startingPricePerNight: e.target.value }))}
                      className={inputClasses(errors.price)}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-500 mt-2 font-medium">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData((p) => ({ ...p, currency: e.target.value }))}
                    className={inputClasses()}
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Images</label>
                <p className="text-xs text-gray-400 font-bold">{images.length}/{MAX_IMAGES}</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImagesChange} accept="image/*" multiple className="hidden" />

              <div className={
                images.length === 0
                  ? "" 
                  : "grid grid-cols-2 md:grid-cols-3 gap-3" 
              }>
                {imagePreviews.map(({ url }, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video h-48">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImageAt(idx)} className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow"><X size={16} /></button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="relative h-48 w-full rounded-2xl border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              <Button type="button" onClick={triggerFileInput} title="Upload Images" iconLeft={<Upload size={18} />} className="my-3 shadow-md" />
              {errors.images && <p className="text-sm text-red-500 font-medium">{errors.images}</p>}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Amenities</label>
              <div className="flex gap-2">
                <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())} placeholder="Wifi, Pool..." className={inputClasses(errors.amenities)} />
                <Button type="button" title="Add" onClick={addAmenity} className="px-5" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A4C]/10 text-[#2D5A4C] text-xs font-bold uppercase">
                    {a} <X size={14} className="cursor-pointer" onClick={() => setAmenities(prev => prev.filter(x => x !== a))} />
                  </span>
                ))}
              </div>
            </div>

            {/* Rating & Description */}
            {/* <div className="flex gap-4 items-center">
              <label className="text-sm font-bold text-[#1A2B2B]">Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={24} className={`cursor-pointer ${star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} onClick={() => handleRating(star)} />
                ))}
              </div>
            </div> */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-[#1A2B2B] mb-4">
                Property Rating
              </label>
              
              <div className="flex flex-wrap items-center gap-6">
                {/* Visual Stars */}
                <div className="flex gap-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={28} 
                      className={`cursor-pointer transition-transform hover:scale-110 ${
                        star <= Math.round(formData.rating) 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-gray-200"
                      }`} 
                      onClick={() => handleRating(star)} 
                    />
                  ))}
                </div>

                {/* Rating Value Display */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-gray-400 ml-1">Score</span>
                    <div className="bg-[#2D5A4C] text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg shadow-[#2D5A4C]/20">
                      {Number(formData.rating).toFixed(1)}
                    </div>
                  </div>

                  <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden md:block" />

                  {/* Manual Decimal Input */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-gray-400 ml-1">Precise Input</span>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleNumericRating}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200 font-bold focus:ring-2 focus:ring-[#2D5A4C]/20 outline-none"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 italic">
                Tip: You can use the stars for quick selection or enter a decimal value (e.g. 4.7) manually.
              </p>
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-[#1A2B2B] mb-2">Description</label>
              <textarea rows={4} value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} placeholder="Describe your property..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FDFDFD] resize-none" />
            </div>

            <div className="pt-6 flex justify-center">
              <Button
                type="submit"
                title={isUploading ? "Uploading Images..." : (isPending ? "Adding Hotel..." : "Add Hotel")}
                disabled={isUploading || isPending}
                className="w-full max-w-xs py-4 text-lg font-bold shadow-lg shadow-[#2D5A4C]/20"
                rounded="rounded-xl"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}