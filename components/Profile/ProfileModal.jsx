"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Mail, Phone, LogOut, X } from "lucide-react";
import { mockUserBookings, mockBookingRequests } from "@/lib/data";
import Image from "next/image";
import Button from "../ui/Button";
import { useOwnerHotelDataQuery } from "@/features/hotel/useHotelsQuery";
import { useRouter } from "next/navigation";

const ProfileModal = ({ user, isOpen, onClose, onLogout, isLoggingOut }) => {
  const [mounted, setMounted] = useState(false);
  const isOwner = user?.role === "owner";
  const ownerId = isOwner ? (user?._id || user?.id) : null;
  const { data: ownerData, isLoading: hotelsLoading } = useOwnerHotelDataQuery(ownerId);
  const ownerHotels = ownerData?.hotels || [];
  const router = useRouter()
  const handleViewAllHotels = () => {
    onClose()
    router.push("/owner-hotels");
  };

  // Tab State: Owners have 3 tabs, Guests have 2
  const [tab, setTab] = useState("profile");

  const initials = useMemo(() => {
    const f = user?.firstName?.[0] ?? "";
    const l = user?.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "U";
  }, [user]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTab("profile");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="h-20 bg-gradient-to-br from-[#2D5A4C] to-[#3d7a67] w-full" />

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-5 top-5 rounded-full bg-white/20 text-white hover:bg-white/40 active:scale-100"
          aria-label="Close"
          iconLeft={<X size={18} />}
        />

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 font-serif font-bold text-xl text-gray-900">
            My Account
          </div>

          {/* Dynamic Tabs based on Role */}
          <div
            className={`mb-5 rounded-xl bg-gray-100 p-1 grid ${isOwner ? "grid-cols-3" : "grid-cols-2"
              }`}
          >
            <TabBtn
              active={tab === "profile"}
              onClick={() => setTab("profile")}
              label="Profile"
            />
            {isOwner && (
              <TabBtn
                active={tab === "hotels"}
                onClick={() => setTab("hotels")}
                label="Hotels"
              />
            )}
            <TabBtn
              active={tab === "bookings" || tab === "requests"}
              onClick={() => setTab(isOwner ? "requests" : "bookings")}
              label={isOwner ? "Requests" : "Bookings"}
            />
          </div>

          {/* --- PROFILE TAB --- */}
          {tab === "profile" && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 mb-5 border border-gray-100">
                <div className="h-14 w-14 rounded-full bg-[#2D5A4C]/15 flex items-center justify-center text-[#2D5A4C] font-bold text-lg">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="font-serif font-bold text-lg text-gray-900 capitalize">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500 italic">
                    {isOwner ? "Hotel Owner" : "Guest Member"}
                  </div>
                </div>
                <span className="rounded-full bg-[#2D5A4C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2D5A4C]">
                  {user?.role}
                </span>
              </div>

              <div className="space-y-3 px-2">
                <InfoLine
                  icon={<Mail size={16} />}
                  label="Email"
                  value={user?.email}
                />
                <InfoLine
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={user?.phone || "N/A"}
                />
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/profile" onClick={onClose} className="block w-full">
                  <Button
                    title="View Full Profile"
                    bg="bg-transparent"
                    textColor="text-gray-900"
                    border="border border-gray-300"
                    className="w-full py-3"
                  />
                </Link>

                <Button
                  variant="danger"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  title={isLoggingOut ? "Logging out..." : "Logout"}
                  textColor="text-white"
                  className="w-full py-3 hover:bg-red-600 shadow-lg shadow-red-100"
                  iconLeft={<LogOut size={16} />}
                />
              </div>
            </div>
          )}

          {/* --- OWNER: HOTELS TAB --- */}

          {/* --- OWNER: HOTELS TAB (With Placeholder Stats) --- */}
          {isOwner && tab === "hotels" && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 animate-in fade-in duration-300">
              {hotelsLoading ? (
                <div className="flex flex-col items-center py-10 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A4C] mb-2" />
                  <p className="text-xs">Fetching your properties...</p>
                </div>
              ) : ownerHotels.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                  <HotelIcon className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-500">You haven't listed any hotels yet.</p>
                </div>
              ) : (
                ownerHotels.slice(0, 3).map((hotel, index) => {
                  // Temporary logic for dummy stats based on index to keep them consistent
                  const dummyBookings = (index + 1) * 12 + 5;
                  const dummyRequests = (index + 1) * 3 + 2;

                  return (
                    <div
                      key={hotel._id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#2D5A4C]/30 transition-all bg-white shadow-sm group"
                    >
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={hotel.images?.[0] || "/placeholder-hotel.jpg"}
                          alt={hotel.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-gray-900 truncate capitalize">
                          {hotel.name}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {hotel.city + " " + hotel.country || "Primary Location"}
                        </p>

                        {/* New Stats Row */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-700 uppercase">
                              {dummyBookings} Bookings
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span className="text-[10px] font-bold text-gray-700 uppercase">
                              {dummyRequests} Requests
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div className="pt-2">
                <Button
                  onClick={handleViewAllHotels}
                  title={ownerHotels.length > 3
                    ? `View All ${ownerHotels.length} Properties`
                    : "Manage Properties"
                  }
                  variant="primary"
                  textColor="text-gray-700"
                  border="border border-gray-200"
                  className="w-full py-3"
                  disabled={ownerHotels.length <= 0}
                />
              </div>
            </div>
          )}

          {/* --- OWNER: REQUESTS / GUEST: BOOKINGS --- */}
          {(tab === "requests" || tab === "bookings") && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 animate-in fade-in duration-300">
              {(isOwner ? mockBookingRequests : mockUserBookings).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {isOwner ? item.guestName : item.hotelName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {isOwner ? item.hotelName : item.location}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      {item.checkIn} • {isOwner ? "2 guests" : item.price + "$"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase ${item.status === "pending"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-[#2D5A4C]/10 text-[#2D5A4C] border-[#2D5A4C]/20"
                      }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}

              <Link
                href={isOwner ? "/booking-requests" : "/booking-page"}
                onClick={onClose}
                className="block w-full mt-4"
              >
                <Button
                  title={isOwner ? "View All Requests" : "View Full Booking"}
                  bg="bg-transparent"
                  textColor="text-gray-700"
                  border="border border-gray-200"
                  className="w-full py-3 hover:bg-gray-50"
                />
              </Link>
            </div>
          )}
        </div>

        <div className="bg-[#2D5A4C]/5 py-4 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">
            Powered by Haven Hospitality Group
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Helper Components
const TabBtn = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg py-2 text-sm font-bold transition-all ${active
      ? "bg-white shadow-sm text-[#2D5A4C]"
      : "text-gray-500 hover:text-gray-900"
      }`}
  >
    {label}
  </button>
);

const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default ProfileModal;
