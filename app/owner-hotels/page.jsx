"use client";

import React from "react";
import { Star, MapPin, Users, Home, Plus, Edit3, Eye } from "lucide-react";
import { mockOwnerHotels } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOwnerHotelDataQuery } from "@/features/hotel/useHotelsQuery";
import { useSelector } from "react-redux";
import Button from "@/components/ui/Button";

export default function OwnerHotelsPage() {
  const router = useRouter();
  const userData = useSelector((state) => state.user.user);
  const ownerId = userData?._id || userData?.id;

  const { data: hotel, isLoading } = useOwnerHotelDataQuery(ownerId);

  const handleEdit = (id) => {
    router.push(`/edit-hotel/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4">
      <div className="container mx-auto max-w-6xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">
              My Hotels
            </h1>
            <p className="text-gray-500">
              Manage and monitor your property portfolio
            </p>
          </div>

          <Link href={"/add-hotels"} className="flex items-center gap-2 bg-[#2D5A4C] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#2D5A4C]/20 hover:bg-[#23473b] transition-all active:scale-95">
            <Plus size={20} />
            Add New Hotel
          </Link>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotel?.hotels?.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={hotel.images?.[0]}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1 text-amber-500 shadow-sm">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs font-bold text-gray-900">{hotel.rating}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold text-[#1A2B2B]">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 mt-1">
                    <MapPin size={14} />
                    <span className="text-sm">{`${hotel.city}, ${hotel.country}`}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#F4F7F6] p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Users size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Bookings</span>
                    </div>
                    <p className="text-2xl font-bold text-[#1A2B2B]">15{hotel.bookings}</p>
                  </div>

                  <div className="bg-[#F4F7F6] p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Home size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Rooms</span>
                    </div>
                    <p className="text-2xl font-bold text-[#1A2B2B]">5{hotel.rooms}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleEdit(hotel._id || hotel.id)}
                    title="Edit Hotel"
                    variant="outline"
                    iconLeft={<Edit3 size={16} />}
                    className="flex-1 py-3 rounded-xl text-sm font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
                  />

                  <Button
                    variant="primary"
                    title="View Bookings"
                    iconLeft={<Eye size={16} />}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-[#2D5A4C]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}