"use client";

import React, { useState } from "react";
import HotelCard from "@/components/Card/HotelCard";
import { Search, ChevronDown } from "lucide-react";
import { hotels } from "@/lib/data";
import Button from "@/components/ui/Button";

const ExploreCollection = () => {
  const [priceRange, setPriceRange] = useState(500);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Top Rated",
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <main className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="border-b mb-10 ">
          <div className="mb-12 max-w-2xl  ">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Explore Our Collection
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              From secluded mountain cabins to vibrant city suites, find the
              perfect space for your next chapter.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 ">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            {/* Search */}
            <div>
              <h3 className="font-bold text-sm mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Hotel or destination"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2D5A4C]"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm">Price Range</h3>
                <span className="text-xs text-gray-500">
                  Up to ${priceRange}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2D5A4C]"
              />
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-bold text-sm mb-4">Amenities</h3>
              <div className="space-y-3">
                {["Pool", "Spa", "Wi-Fi", "Parking", "Restaurant", "Gym"].map(
                  (item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#2D5A4C] focus:ring-[#2D5A4C]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-black">
                        {item}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Sort & Count Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                Showing {hotels.length} properties
              </p>

              {/* Sort Dropdown */}
              <div className="relative">
                {/* ✅ Updated: sort trigger uses common Button */}
                <Button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  title={selectedSort}
                  variant="outline"
                  className="min-w-[170px] justify-between shadow-sm border-gray-200 bg-white hover:bg-gray-50"
                  iconRight={
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-500 ease-in-out ${
                        isSortOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  }
                />

                {/* Dropdown Menu Overlay */}
                {isSortOpen && (
                  <>
                    {/* Invisible backdrop to close menu when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden border-opacity-60">
                      {sortOptions.map((option) => (
                        // ✅ Updated: dropdown items use common Button
                        <Button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSelectedSort(option);
                            setIsSortOpen(false);
                          }}
                          title={option}
                          variant="ghost"
                          className={`w-full justify-start px-4 py-2.5 text-sm rounded-none ${
                            selectedSort === option
                              ? "bg-[#2D5A4C]/10 text-[#2D5A4C] font-bold hover:bg-[#2D5A4C]/10"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hotel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExploreCollection;
