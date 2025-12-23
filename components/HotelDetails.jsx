'use client'
import { useState } from "react";
import { Star, MapPin, Calendar, User, Check, X } from "lucide-react";
import luxuryExterior from "../assets/hotel/hotel_1.png";
import Image from "next/image";
import { useSingleHotelQuery } from "@/features/hotel/useHotelsQuery";
import HavenLoader from "./HavenLoader";
import HotelGallery from "./Common/HotelGallery";

// Mock data - replace with your actual data
// const hotels = [
//   {
//     id: "1",
//     name: "The Grand Horizon Resort",
//     location: "Malibu, California",
//     description: "Experience unparalleled luxury at The Grand Horizon Resort. Perched on the cliffs of Malibu, this architectural masterpiece offers breathtaking panoramic views of the Pacific Ocean. Enjoy our infinity pool at sunset, world-class dining, and personalized service that caters to your every need. Perfect for romantic getaways and exclusive retreats.",
//     image: luxuryExterior,
//     price: 450,
//     rating: 4.9,
//     tags: ["Luxury"],
//     amenities: [
//       "Infinity Pool",
//       "Michelin Star Dining",
//       "24/7 Concierge",
//       "Private Beach Access",
//       "Spa & Wellness Center",
//       "Valet Parking"
//     ]
//   }
// ];

// Layout Component
function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Luxury Hotels</h1>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

// Badge Component
function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    outline: "border border-gray-200 bg-transparent text-gray-700"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Button Component
function Button({ children, variant = "default", className = "", onClick, ...props }) {
  const variants = {
    default: "bg-green-700 text-white hover:bg-green-800",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Calendar Component (Simplified)
function CalendarPicker({ selected, onSelect, className = "" }) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const newDate = new Date(displayYear, displayMonth, day);
    onSelect(newDate);
  };

  return (
    <div className={`p-3 bg-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded">
          ←
        </button>
        <div className="font-semibold text-sm">
          {months[displayMonth]} {displayYear}
        </div>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = selected &&
            selected.getDate() === day &&
            selected.getMonth() === displayMonth &&
            selected.getFullYear() === displayYear;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`p-2 text-sm rounded-md hover:bg-gray-100 ${isSelected ? "bg-green-700 text-white hover:bg-green-800" : ""
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Main Hotel Details Component
export default function HotelDetails({ hotelId }) {
  const { data: hotel, isLoading, isError } = useSingleHotelQuery(hotelId);

  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!hotel) return <div>Hotel not found</div>;
  // 2. Handle Loading and Error states
  if (isLoading) {
    return (
      < HavenLoader label="Loading hotel details..." />
    );
  }
  if (isError || !hotel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Hotel not found</h2>
        <p className="text-gray-500">The property you are looking for does not exist.</p>
      </div>
    );
  }
  const hotelLocation = `${hotel.city}, ${hotel.country}`;
  const handleBookNow = () => {
    setShowSuccess(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Booking Confirmed!</h3>
                  <p className="text-gray-600 text-sm">You have successfully booked {hotel.name}</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Button className="w-full mt-4" onClick={() => setShowSuccess(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image Gallery Section */}
          <div className="flex-1 space-y-4">
            <HotelGallery
              images={hotel.images}
              hotelName={hotel.name}
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="border-green-200 text-green-700 px-3 py-1 text-sm font-medium capitalize">
                  {hotel.amenities[0]} Hotel
                </Badge>
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="h-5 w-5 fill-current mr-1" />
                  {hotel.rating} 
                  {/* <span className="text-gray-500 font-normal text-sm ml-1">(128 reviews)</span> */}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {hotelLocation}
              </div>
            </div>

            <div className="text-gray-600 leading-relaxed">
              <p>{hotel.description}</p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl mb-4">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center text-sm text-gray-600 capitalize">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-3xl font-bold font-serif">${hotel.startingPricePerNight}</span>
                  <span className="text-gray-600"> / night</span>
                </div>
                <div className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded">
                  Available Now
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in Date</label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? formatDate(date) : <span>Pick a date</span>}
                    </Button>
                    {showCalendar && (
                      <div className="absolute z-50 mt-2 left-0 right-0">
                        <CalendarPicker
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate);
                            setShowCalendar(false);
                          }}
                          className="border rounded-md shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    2 Adults
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Service fee</span>
                  <span>$0 (Pay at hotel)</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Total to pay on arrival</span>
                  <span className="font-bold">${hotel?.startingPricePerNight}</span>
                </div>
                <Button className="w-full text-lg h-12" onClick={handleBookNow}>
                  Book with Cash on Arrival
                </Button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  No credit card needed. You'll pay directly at the hotel front desk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}