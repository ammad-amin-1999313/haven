'use client';
import React from "react";
import { Star, MapPin } from "lucide-react";
import Button from "../ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

const HotelCard = ({ hotel }) => {
  const { image, name, location, rating, tags, id } = hotel;
  const router = useRouter();

  const handleViewDetails = () => {
    // Navigate to hotel-detail page with the hotel id
    router.push(`/hotel-detail/${id}`);
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
          width={400}
          height={300}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Location & Rating */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>

          <div className="flex items-center text-amber-500 font-medium">
            <Star className="h-4 w-4 mr-1 fill-current" />
            {rating}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-semibold mb-3">{name}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-md bg-[#f3f0ed] text-ValueProposition font-medium uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Button */}
        <Button
          title={"View Details"}
          className="mt-auto w-full bg-emerald-700 hover:bg-emerald-800"
          onClick={handleViewDetails} // <-- call navigation on click
        />
      </div>
    </div>
  );
};

export default HotelCard;
