"use client";

import React, { useState } from "react";
import HotelCard from "@/components/Card/HotelCard";
import { Search, ChevronDown, FilterX } from "lucide-react";
import Button from "@/components/ui/Button";
import { useHotelsQuery } from "@/features/hotel/useHotelsQuery";
import HavenLoader from "@/components/HavenLoader";

const ExploreCollection = () => {
  // --- States for Params ---
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(2000); // Default to max
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // UI States
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // --- TanStack Query ---
  const { data, isLoading, isFetching } = useHotelsQuery({
    page,
    limit,
    search,
    amenities: selectedAmenities,
    rating: null,
    price: priceRange
  });

  // Clean Data Logic: Only use what comes from the API
  const displayHotels = data?.hotels || [];

  // --- Handlers ---
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) => {
      const updated = prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity];
      return updated;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange(2000);
    setSelectedAmenities([]);
    setPage(1);
  };

  const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"];

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <main className="container mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="border-b mb-10">
          <div className="mb-12 max-w-2xl">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 capitalize">
              Explore Our Collection
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              From secluded mountain cabins to vibrant city suites, find the
              perfect space for your next chapter.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="font-bold text-sm mb-3 text-[#1A2B2B]">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Hotel or destination"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2D5A4C]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-[#1A2B2B]">Price Range</h3>
                <span className="text-xs font-bold text-[#2D5A4C]">Up to ${priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => { setPriceRange(Number(e.target.value)); setPage(1); }}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2D5A4C]"
              />
            </div>

            <div>
              <h3 className="font-bold text-sm mb-4 text-[#1A2B2B]">Amenities</h3>
              <div className="space-y-3">
                {["Pool", "Spa", "Wi-Fi", "Parking", "Restaurant", "Gym"].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(item)}
                      onChange={() => handleAmenityChange(item)}
                      className="w-4 h-4 rounded border-gray-300 text-[#2D5A4C] focus:ring-[#2D5A4C] cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              title="Clear Filters"
              variant="ghost"
              className="text-xs text-gray-400 hover:text-red-500 p-0 h-auto"
              onClick={clearFilters}
            />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500 font-medium">
                {isLoading ? "Loading..." : `Showing ${displayHotels.length} properties`}
              </p>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  title={selectedSort}
                  variant="outline"
                  className="min-w-[170px] justify-between shadow-sm border-gray-200 bg-white"
                  iconRight={
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                    />
                  }
                />
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                      {sortOptions.map((option) => (
                        <Button
                          key={option}
                          onClick={() => { setSelectedSort(option); setIsSortOpen(false); }}
                          title={option}
                          variant="ghost"
                          className={`w-full justify-start px-4 py-2.5 text-sm rounded-none ${selectedSort === option ? "bg-[#2D5A4C]/10 text-[#2D5A4C] font-bold" : "text-gray-600 hover:bg-gray-50"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Grid Logic */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <HavenLoader label="Updating Hotel Data" />
                <p className="mt-4 text-gray-400 animate-pulse font-medium">Finding the best hotels for you...</p>
              </div>
            ) : displayHotels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <FilterX size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-[#1A2B2B]">No hotels found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
                <Button title="Reset all filters" onClick={clearFilters} />
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {displayHotels.map((hotel) => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data?.metadata?.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-6">
                <Button
                  title="Prev"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                />
                <span className="text-sm font-bold text-gray-600">
                  Page {page} of {data.metadata.totalPages}
                </span>
                <Button
                  title="Next"
                  variant="outline"
                  disabled={page === data.metadata.totalPages}
                  onClick={() => setPage(p => p + 1)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExploreCollection;