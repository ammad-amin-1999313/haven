"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Mail, Phone, LogOut, X, List, Building2, User } from "lucide-react";
import { mockUserBookings, mockBookingRequests } from "@/lib/data"; // Assume you have mockOwnerHotels too
import Image from "next/image";

const ProfileModal = ({ user, isOpen, onClose, onLogout, isLoggingOut }) => {
  const [mounted, setMounted] = useState(false);
  const isOwner = user?.role === "owner";
  
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
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="h-20 bg-gradient-to-br from-[#2D5A4C] to-[#3d7a67] w-full" />
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"><X size={18} /></button>

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 font-serif font-bold text-xl text-gray-900">My Account</div>

          {/* Dynamic Tabs based on Role */}
          <div className={`mb-5 rounded-xl bg-gray-100 p-1 grid ${isOwner ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabBtn active={tab === "profile"} onClick={() => setTab("profile")} label="Profile" />
            {isOwner && <TabBtn active={tab === "hotels"} onClick={() => setTab("hotels")} label="Hotels" />}
            <TabBtn active={tab === "bookings" || tab === "requests"} 
                    onClick={() => setTab(isOwner ? "requests" : "bookings")} 
                    label={isOwner ? "Requests" : "Bookings"} />
          </div>

          {/* --- PROFILE TAB --- */}
          {tab === "profile" && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 mb-5 border border-gray-100">
                <div className="h-14 w-14 rounded-full bg-[#2D5A4C]/15 flex items-center justify-center text-[#2D5A4C] font-bold text-lg">{initials}</div>
                <div className="flex-1">
                  <div className="font-serif font-bold text-lg text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-sm text-gray-500 italic lowercase">{isOwner ? "Hotel Owner" : "Guest Member"}</div>
                </div>
                <span className="rounded-full bg-[#2D5A4C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2D5A4C]">{user?.role}</span>
              </div>
              <div className="space-y-3 px-2">
                <InfoLine icon={<Mail size={16}/>} label="Email" value={user?.email} />
                <InfoLine icon={<Phone size={16}/>} label="Phone" value={user?.phone || "+1 (555) 000-0000"} />
              </div>
              <div className="mt-8 space-y-3">
                <Link href="/profile" onClick={onClose} className="flex w-full items-center justify-center rounded-xl border border-gray-300 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition">View Full Profile</Link>
                <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4D4D] py-3 text-sm font-bold text-white hover:bg-red-600 transition shadow-lg shadow-red-100"><LogOut size={16} /> Logout</button>
              </div>
            </div>
          )}

          {/* --- OWNER: HOTELS TAB --- */}
          {isOwner && tab === "hotels" && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 animate-in fade-in duration-300">
              {mockUserBookings.slice(0, 3).map((hotel) => ( // Use your actual hotel data here
                <div key={hotel.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#2D5A4C]/30 transition-colors bg-white shadow-sm">
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image src={hotel.image} alt={hotel.hotelName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-gray-900 truncate">{hotel.hotelName}</h4>
                    <p className="text-xs text-gray-500">{hotel.location}</p>
                    <p className="text-[10px] font-bold text-[#2D5A4C] mt-1 uppercase">32 bookings • 45 rooms</p>
                  </div>
                </div>
              ))}
              <Link href="/owner-hotels" onClick={onClose} className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 mt-4">View All Hotels</Link>
            </div>
          )}

          {/* --- OWNER: REQUESTS / GUEST: BOOKINGS --- */}
          {(tab === "requests" || tab === "bookings") && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 animate-in fade-in duration-300">
              {(isOwner ? mockBookingRequests : mockUserBookings).map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{isOwner ? item.guestName : item.hotelName}</h4>
                    <p className="text-xs text-gray-500">{isOwner ? item.hotelName : item.location}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{item.checkIn} • {isOwner ? '2 guests' : item.price + '$'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase ${
                    item.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-[#2D5A4C]/10 text-[#2D5A4C] border-[#2D5A4C]/20'
                  }`}>{item.status}</span>
                </div>
              ))}
              <Link href={isOwner ? "/booking-requests" : "/booking-page"} onClick={onClose} className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 mt-4">
                {isOwner ? "View All Requests" : "View Full Booking"}
              </Link>
            </div>
          )}
        </div>

        <div className="bg-[#2D5A4C]/5 py-4 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">Powered by Haven Hospitality Group</p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Helper Components
const TabBtn = ({ active, onClick, label }) => (
  <button type="button" onClick={onClick} className={`rounded-lg py-2 text-sm font-bold transition-all ${active ? "bg-white shadow-sm text-[#2D5A4C]" : "text-gray-500 hover:text-gray-900"}`}>{label}</button>
);

const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default ProfileModal;