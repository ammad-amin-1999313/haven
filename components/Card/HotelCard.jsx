'use client';
import React from "react";
import { Star, MapPin } from "lucide-react";
import Button from "../ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HotelCard = ({ hotel }) => {
  // Destructuring based on your provided JSON object
  const { 
    images, 
    name, 
    city, 
    country, 
    rating, 
    amenities, 
    _id 
  } = hotel;
  
  const router = useRouter();

  const handleViewDetails = () => {
    // Navigating using MongoDB _id
    router.push(`/hotel-detail/${_id}`);
  };

  return (
    <div 
      onClick={handleViewDetails}
      className="group rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full border border-gray-100"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <Image
          src={
            images && images.length > 0 && images[0]
              ? images[0]
              : "/placeholder-hotel.jpg"
          }
          alt={name || "Hotel image"}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={300}
        />
        {/* Quick Rating Badge Overlay (Optional) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
            <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Location Row */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 text-[#2D5A4C]" />
          <span className="truncate">{city}, {country}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-serif font-bold text-[#1A2B2B] mb-3 line-clamp-1 group-hover:text-[#2D5A4C] transition-colors">
          {name}
        </h3>

        {/* Amenities (Tags) - Showing top 3 to keep UI clean */}
        <div className="flex flex-wrap gap-2 mb-5">
          {amenities?.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="text-[10px] px-2.5 py-1 rounded-md bg-[#f3f0ed] text-[#5e5852] font-bold uppercase tracking-wider"
            >
              {amenity}
            </span>
          ))}
          {amenities?.length > 3 && (
            <span className="text-[10px] px-2.5 py-1 text-gray-400 font-medium">
              +{amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Button
            title="View Details"
            onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger with div onClick
                handleViewDetails();
            }}
            className="mt-auto w-full hover:bg-[#23473b]"
          />
        </div>
      </div>
    </div>
  );
};

export default HotelCard;