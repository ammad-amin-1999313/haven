"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, MapPin, Calendar, User, Check, X, Phone, Mail, Clock } from "lucide-react";
import { useSingleHotelQuery } from "@/features/hotel/useHotelsQuery";
import HavenLoader from "./HavenLoader";
import HotelGallery from "./Common/HotelGallery";
import toast from "react-hot-toast";
import ConformModal from "./Common/ConformModal";
import PendingModal from "./Common/PendingModal";

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
    outline: "border border-gray-200 bg-transparent text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Button Component
function Button({ children, variant = "default", className = "", onClick, ...props }) {
  const variants = {
    default: "bg-green-700 text-white hover:bg-green-800",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
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
  const [currentDate] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((y) => y - 1);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((y) => y + 1);
    } else {
      setDisplayMonth((m) => m + 1);
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
        {days.map((day) => (
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
          const isSelected =
            selected &&
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

// Helpers
const formatDate = (date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const nightsBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  const diff = e.getTime() - s.getTime();
  const nights = Math.round(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, nights);
};

const ceilDiv = (a, b) => Math.ceil(Number(a) / Number(b || 1));

// ✅ TODO: Replace with your real booking API call later
async function submitBookingRequest(payload) {
  // example:
  // const res = await api.post("/api/bookings", payload);
  // return res.data;

  // temporary fake delay
  await new Promise((r) => setTimeout(r, 700));
  return { success: true, status: "pending" };
}

export default function HotelDetails({ hotelId }) {
  const { data, isLoading, isError } = useSingleHotelQuery(hotelId);

  // Dates
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [showCheckInCal, setShowCheckInCal] = useState(false);
  const [showCheckOutCal, setShowCheckOutCal] = useState(false);

  // Booking selection
  const [guestsAdults, setGuestsAdults] = useState(2);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("");
  const [roomsRequested, setRoomsRequested] = useState(1);

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  // Guest info form
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    arrivalTime: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data
  const hotelDoc = data?.hotel || null;
  const roomTypes = data?.roomTypes || [];

  // nights + validations
  const nights = nightsBetween(checkIn, checkOut);

  // Best default room type logic:
  // Pick the type that requires minimum rooms for guestsAdults, then cheapest total/night
  const recommendedRoomType = useMemo(() => {
    const adults = Number(guestsAdults) || 1;
    if (!roomTypes.length) return null;

    const scored = roomTypes
      .map((rt) => {
        const cap = Number(rt.capacityAdults) || 1;
        const minRooms = ceilDiv(adults, cap);
        const price = Number(rt.pricePerNight) || 0;
        const totalPerNight = minRooms * price;
        return { rt, minRooms, totalPerNight };
      })
      .sort((a, b) => {
        if (a.minRooms !== b.minRooms) return a.minRooms - b.minRooms;
        return a.totalPerNight - b.totalPerNight;
      });

    return scored[0] || null;
  }, [roomTypes, guestsAdults]);

  // selected room type object
  const selectedRoomType = useMemo(() => {
    return roomTypes.find((rt) => rt._id === selectedRoomTypeId) || null;
  }, [roomTypes, selectedRoomTypeId]);

  // min rooms needed based on selected room capacity
  const minRoomsNeeded = useMemo(() => {
    const adults = Number(guestsAdults) || 1;
    const cap = Number(selectedRoomType?.capacityAdults) || 1;
    return ceilDiv(adults, cap);
  }, [guestsAdults, selectedRoomType]);

  // max rooms possible = quantity (simple version: not date-based yet)
  const maxRoomsPossible = useMemo(() => {
    const q = Number(selectedRoomType?.quantity);
    return Number.isFinite(q) && q > 0 ? q : 10; // fallback if quantity missing
  }, [selectedRoomType]);

  // Auto set default selected room type and roomsRequested
  useEffect(() => {
    if (!selectedRoomTypeId && recommendedRoomType?.rt?._id) {
      setSelectedRoomTypeId(recommendedRoomType.rt._id);
      setRoomsRequested(recommendedRoomType.minRooms);
    }
  }, [selectedRoomTypeId, recommendedRoomType]);

  // Keep roomsRequested >= minRoomsNeeded and <= maxRoomsPossible
  useEffect(() => {
    setRoomsRequested((prev) => {
      const next = Math.max(minRoomsNeeded, Number(prev) || 1);
      return Math.min(next, maxRoomsPossible);
    });
  }, [minRoomsNeeded, maxRoomsPossible]);

  const pricePerNight = Number(selectedRoomType?.pricePerNight ?? hotelDoc?.startingPricePerNight ?? 0);
  const total = pricePerNight * (nights || 1) * (Number(roomsRequested) || 1);

  const validateBookingUI = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return false;
    }
    if (nights <= 0) {
      toast.error("Check-out must be after check-in.");
      return false;
    }
    const adults = Number(guestsAdults);
    if (!Number.isFinite(adults) || adults < 1) {
      toast.error("Guests must be at least 1 adult.");
      return false;
    }
    if (!selectedRoomTypeId || !selectedRoomType) {
      toast.error("Please select a room type.");
      return false;
    }
    if (roomsRequested < minRoomsNeeded) {
      toast.error(`You need at least ${minRoomsNeeded} room(s) for ${adults} adults.`);
      return false;
    }
    if (roomsRequested > maxRoomsPossible) {
      toast.error(`Only ${maxRoomsPossible} room(s) available for this type.`);
      return false;
    }
    return true;
  };

  const openConfirmModal = () => {
    if (!validateBookingUI()) return;
    setShowConfirmModal(true);
  };

  const validateGuestInfo = () => {
    const name = guestInfo.fullName.trim();
    const phone = guestInfo.phone.trim();
    if (!name) {
      toast.error("Full name is required.");
      return false;
    }
    if (!phone) {
      toast.error("Phone number is required.");
      return false;
    }
    // email optional, but if provided validate basic
    if (guestInfo.email.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email.trim());
      if (!ok) {
        toast.error("Please enter a valid email address.");
        return false;
      }
    }
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateGuestInfo()) return;

    const payload = {
      hotelId,
      roomTypeId: selectedRoomTypeId,
      checkIn,
      checkOut,
      guestsAdults: Number(guestsAdults),
      roomsRequested: Number(roomsRequested),
      guestInfo: {
        fullName: guestInfo.fullName.trim(),
        phone: guestInfo.phone.trim(),
        email: guestInfo.email.trim() || undefined,
        arrivalTime: guestInfo.arrivalTime.trim() || undefined,
        notes: guestInfo.notes.trim() || undefined,
      },
      pricingEstimate: {
        pricePerNight,
        nights,
        total,
        currency: hotelDoc?.currency || "USD",
      },
    };

    try {
      setIsSubmitting(true);
      await submitBookingRequest(payload);

      setShowConfirmModal(false);
      setShowPendingModal(true);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit booking request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe early returns AFTER hooks
  if (isLoading) return <HavenLoader label="Loading hotel details..." />;

  if (isError || !hotelDoc) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Hotel not found</h2>
        <p className="text-gray-500">The property you are looking for does not exist.</p>
      </div>
    );
  }

  const hotelLocation = `${hotelDoc.city}, ${hotelDoc.country}`;

  return (
    <Layout>
      {/* Confirm Modal (collect guest info) */}
      {showConfirmModal && (
        <ConformModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmBooking}
          isSubmitting={isSubmitting}
          hotelName={hotelDoc.name}
          checkInLabel={formatDate(checkIn)}
          checkOutLabel={formatDate(checkOut)}
          nights={nights}
          roomTypeTitle={selectedRoomType?.title || ""}
          guestsAdults={guestsAdults}
          roomsRequested={roomsRequested}
          currency={hotelDoc.currency || "USD"}
          total={total}
          guestInfo={guestInfo}
          setGuestInfo={setGuestInfo}
        />
      )}

      {/* Pending Modal */}
      {showPendingModal && (
        <PendingModal
          open={showPendingModal}
          onClose={() => setShowPendingModal(false)}
        />
      )}

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image Gallery */}
          <div className="flex-1 space-y-4">
            <HotelGallery images={hotelDoc.images} hotelName={hotelDoc.name} />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700 px-3 py-1 text-sm font-medium capitalize"
                >
                  {(hotelDoc.amenities?.[0] || "Luxury")} Hotel
                </Badge>
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="h-5 w-5 fill-current mr-1" />
                  {hotelDoc.rating}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                {hotelDoc.name}
              </h1>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {hotelLocation}
              </div>
            </div>

            <div className="text-gray-600 leading-relaxed">
              <p>{hotelDoc.description}</p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl mb-4">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotelDoc.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center text-sm text-gray-600 capitalize">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Card */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-3xl font-bold font-serif">${pricePerNight}</span>
                  <span className="text-gray-600"> / night</span>
                  {selectedRoomType?.title ? (
                    <div className="text-xs text-gray-500 mt-1">
                      Selected: <span className="font-semibold">{selectedRoomType.title}</span>
                    </div>
                  ) : null}
                  {roomsRequested > 1 ? (
                    <div className="text-[11px] mt-1 text-gray-500">
                      You are booking <span className="font-semibold">{roomsRequested}</span> rooms to fit{" "}
                      <span className="font-semibold">{guestsAdults}</span> adults.
                    </div>
                  ) : null}
                </div>
                <div className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded">
                  Request-based
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Check-in */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in Date</label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => {
                        setShowCheckInCal((p) => !p);
                        setShowCheckOutCal(false);
                      }}
                      type="button"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {checkIn ? formatDate(checkIn) : <span>Pick a date</span>}
                    </Button>
                    {showCheckInCal && (
                      <div className="absolute z-50 mt-2 left-0 right-0">
                        <CalendarPicker
                          selected={checkIn}
                          onSelect={(newDate) => {
                            setCheckIn(newDate);
                            const nextOut = new Date(newDate);
                            nextOut.setDate(nextOut.getDate() + 1);
                            if (nightsBetween(newDate, checkOut) <= 0) setCheckOut(nextOut);
                            setShowCheckInCal(false);
                          }}
                          className="border rounded-md shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Check-out */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out Date</label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => {
                        setShowCheckOutCal((p) => !p);
                        setShowCheckInCal(false);
                      }}
                      type="button"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {checkOut ? formatDate(checkOut) : <span>Pick a date</span>}
                    </Button>
                    {showCheckOutCal && (
                      <div className="absolute z-50 mt-2 left-0 right-0">
                        <CalendarPicker
                          selected={checkOut}
                          onSelect={(newDate) => {
                            setCheckOut(newDate);
                            setShowCheckOutCal(false);
                          }}
                          className="border rounded-md shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests (Adults)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      min={1}
                      value={guestsAdults}
                      onChange={(e) => setGuestsAdults(Number(e.target.value || 1))}
                      className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 bg-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    We will suggest the best room option for your group.
                  </p>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Type</label>

                  {roomTypes.length === 0 ? (
                    <div className="text-sm text-red-500">No room types found for this hotel.</div>
                  ) : (
                    <select
                      value={selectedRoomTypeId}
                      onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                    >
                      {roomTypes.map((rt) => {
                        const cap = Number(rt.capacityAdults) || 1;
                        const minRooms = ceilDiv(guestsAdults, cap);
                        const label = `${rt.title} — up to ${cap} adults — $${rt.pricePerNight}/night`;
                        return (
                          <option key={rt._id} value={rt._id}>
                            {label} {minRooms > 1 ? `(needs ${minRooms} rooms)` : ""}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                {/* Rooms Requested */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Rooms</label>
                    <span className="text-xs text-gray-500">
                      Min: {minRoomsNeeded} • Max: {maxRoomsPossible}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRoomsRequested((p) => Math.max(minRoomsNeeded, (Number(p) || 1) - 1))}
                      className="h-10 w-10 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                      disabled={roomsRequested <= minRoomsNeeded}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={minRoomsNeeded}
                      max={maxRoomsPossible}
                      value={roomsRequested}
                      onChange={(e) => {
                        const v = Number(e.target.value || minRoomsNeeded);
                        setRoomsRequested(Math.min(Math.max(v, minRoomsNeeded), maxRoomsPossible));
                      }}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-center"
                    />

                    <button
                      type="button"
                      onClick={() => setRoomsRequested((p) => Math.min(maxRoomsPossible, (Number(p) || 1) + 1))}
                      className="h-10 w-10 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                      disabled={roomsRequested >= maxRoomsPossible}
                    >
                      +
                    </button>
                  </div>

                  {roomsRequested < minRoomsNeeded ? (
                    <p className="text-xs text-red-500">
                      You need at least {minRoomsNeeded} rooms for {guestsAdults} adults.
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Totals */}
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Nights</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Rooms</span>
                  <span>{roomsRequested}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Service fee</span>
                  <span>$0 (Pay at hotel)</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Estimated total</span>
                  <span className="font-bold">
                    {hotelDoc.currency || "USD"} {total}
                  </span>
                </div>

                <Button
                  className="w-full text-lg h-12"
                  onClick={openConfirmModal}
                  disabled={roomTypes.length === 0 || nights <= 0 || roomsRequested < minRoomsNeeded}
                  type="button"
                >
                  Continue to Confirm
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  You’ll pay at the hotel after owner approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
