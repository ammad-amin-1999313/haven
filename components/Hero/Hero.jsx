"use client";

import React from "react";
import Image from "next/image";
import SearchBar from "../Search/SearchBar";
import heroBg from "../../assets/hotel/heroBg.png";

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={heroBg}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay (must not capture clicks) */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-6 animate-in fade-in zoom-in duration-700">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight drop-shadow-lg">
          Find Your Perfect Haven
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 font-light tracking-wide">
          Discover luxury accommodations worldwide. Book now and pay when you
          arrive.
        </p>

        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
