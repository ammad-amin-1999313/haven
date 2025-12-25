"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, LogOut, X } from "lucide-react";
import Button from "../ui/Button";
import { useOwnerHotelDataQuery } from "@/features/hotel/useHotelsQuery";
import { useRouter } from "next/navigation";
import {
  useGuestBookingQuery,
  useOwnerBookingQuery,
} from "@/features/booking/useBookingQuery";

const ProfileModal = ({ user, isOpen, onClose, onLogout, isLoggingOut }) => {
  const [mounted, setMounted] = useState(false);

  const isOwner = user?.role === "owner";
  const isAdmin = user?.role === "admin";
  const isGuest = user?.role === "guest";

  const router = useRouter();

  // ✅ Tabs:
  // - Admin: only "profile"
  // - Owner: profile + hotels + requests
  // - Guest: profile + bookings
  const [tab, setTab] = useState("profile");

  // Queries (safe: only enabled when needed)
  const { data: ownerData, isLoading: hotelsLoading } = useOwnerHotelDataQuery(
    {},
    { enabled: isOwner && isOpen } // if your hook supports options
  );

  const ownerHotels = ownerData?.hotels || [];

  const { data: bookingData, isLoading: bookingsLoading } = useGuestBookingQuery(
    {},
    { enabled: isGuest && isOpen } // if your hook supports options
  );

  const { data: OwnerBookingData, isLoading: ownerBookingsLoading } =
    useOwnerBookingQuery({}, { enabled: isOwner && isOpen }); // if supported

  const handleViewAllHotels = () => {
    onClose();
    router.push("/owner-hotels");
  };

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

  // ✅ Decide label under name
  const roleLabel = isAdmin ? "Administrator" : isOwner ? "Hotel Owner" : "Guest Member";

  // ✅ Which tabs to show
  const showHotelsTab = isOwner && !isAdmin;
  const showBookingsTab = !isAdmin; // owner requests OR guest bookings (hide for admin)

  // ✅ Grid columns
  const tabCols = isAdmin ? "grid-cols-1" : isOwner ? "grid-cols-3" : "grid-cols-2";

  // ✅ Correct list depending on role/tab
  const listItems =
    (isOwner
      ? OwnerBookingData?.bookings
      : bookingData?.bookings) || [];

  const listLoading = isOwner ? ownerBookingsLoading : bookingsLoading;

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

          {/* ✅ Tabs */}
          <div className={`mb-5 rounded-xl bg-gray-100 p-1 grid ${tabCols}`}>
            <TabBtn
              active={tab === "profile"}
              onClick={() => setTab("profile")}
              label="Profile"
            />

            {showHotelsTab && (
              <TabBtn
                active={tab === "hotels"}
                onClick={() => setTab("hotels")}
                label="Hotels"
              />
            )}

            {showBookingsTab && (
              <TabBtn
                active={tab === "bookings" || tab === "requests"}
                onClick={() => setTab(isOwner ? "requests" : "bookings")}
                label={isOwner ? "Requests" : "Bookings"}
              />
            )}
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
                  <div className="text-sm text-gray-500 italic">{roleLabel}</div>
                </div>
                <span className="rounded-full bg-[#2D5A4C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2D5A4C]">
                  {user?.role}
                </span>
              </div>

              <div className="space-y-3 px-2">
                <InfoLine icon={<Mail size={16} />} label="Email" value={user?.email} />
                <InfoLine icon={<Phone size={16} />} label="Phone" value={user?.phone || "N/A"} />
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/profile" onClick={onClose} className="block w-full">
                  <Button
                    title="View Full Profile"
                    variant="outline"
                    className="w-full py-3"
                  />
                </Link>

                <Button
                  variant="danger"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  title={isLoggingOut ? "Logging out..." : "Logout"}
                  className="w-full py-3 hover:bg-red-600 shadow-lg shadow-red-100"
                  iconLeft={<LogOut size={16} />}
                />
              </div>
            </div>
          )}

          {/* --- OWNER: HOTELS TAB --- */}
          {isOwner && !isAdmin && tab === "hotels" && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 animate-in fade-in duration-300">
              {hotelsLoading ? (
                <div className="flex flex-col items-center py-10 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A4C] mb-2" />
                  <p className="text-xs">Fetching your properties...</p>
                </div>
              ) : ownerHotels.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                  <p className="text-sm text-gray-500">You haven't listed any hotels yet.</p>
                </div>
              ) : (
                ownerHotels.slice(0, 3).map((hotel) => (
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
                        {hotel.city} {hotel.country}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-bold text-gray-700 uppercase">
                            {hotel?.totalBookingsCount ?? 0} Bookings
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span className="text-[10px] font-bold text-gray-700 uppercase">
                            {hotel?.activeRequestsCount ?? 0} Requests
                          </span>
                        </div>
                        {"totalRoomsCount" in hotel && (
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                            <span className="text-[10px] font-bold text-gray-700 uppercase">
                              {hotel?.totalRoomsCount ?? 0} Rooms
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2">
                <Button
                  onClick={handleViewAllHotels}
                  title={
                    (ownerData?.count ?? 0) > 3
                      ? `View All ${ownerData.count} Properties`
                      : "Manage Properties"
                  }
                  variant="primary"
                  className="w-full py-3"
                  disabled={!ownerData?.count || ownerData.count <= 0}
                />
              </div>
            </div>
          )}

          {/* --- OWNER: REQUESTS / GUEST: BOOKINGS --- */}
          {!isAdmin && (tab === "requests" || tab === "bookings") && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 animate-in fade-in duration-300">
              {listLoading ? (
                <div className="flex flex-col items-center py-10 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A4C] mb-2" />
                  <p className="text-xs">Loading...</p>
                </div>
              ) : listItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400 italic">
                    No {tab} found.
                  </p>
                </div>
              ) : (
                listItems.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">
                        {isOwner
                          ? item.guestInfo?.fullName
                          : item.hotelId?.name || "Hotel"}
                      </h4>

                      <p className="text-xs text-gray-500">
                        {isOwner
                          ? item.hotelId?.name
                          : `${item.currency} ${item.totalAmount}`}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {new Date(item.checkIn).toLocaleDateString()} •{" "}
                        {item?.guestsAdults} guests • {item.roomsRequested} room(s)
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase ${
                        item.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : item.status === "approved" || item.status === "confirmed"
                          ? "bg-[#2D5A4C]/10 text-[#2D5A4C] border-[#2D5A4C]/20"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}

              <Link
                href={isOwner ? "/booking-requests" : "/booking-page"}
                onClick={onClose}
                className="block w-full mt-4"
              >
                <Button
                  title={isOwner ? "View All Requests" : "View All Bookings"}
                  variant="outline"
                  className="w-full py-3"
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
    className={`rounded-lg py-2 text-sm font-bold transition-all ${
      active
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
