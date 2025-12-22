'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Calendar, Building, Edit3 } from "lucide-react";
import { useSelector } from "react-redux";
import { mockOwnerHotels, mockUser, mockUserBookings } from '@/lib/data';
import Button from '@/components/ui/Button';
import { useLogoutMutation } from '@/features/auth/useAuthMutations';

export default function ProfilePage() {
  const router = useRouter();
  const userFromRedux = useSelector((state) => state.user.user);

  // Choose data based on role
  const isOwner = userFromRedux?.role === "owner";
  const user = isOwner ? mockOwnerHotels : mockUser;
  const logoutMutation = useLogoutMutation();
  // ✅ Redirect Logic
  const handleEditRedirect = () => {
    const userId = userFromRedux?.id || 'default'; // Ensure you have an ID

    if (userFromRedux?.role === "owner") {
      router.push(`/owner-edit/${userId}`);
    } else {
      router.push(`/guest-edit/${userId}`);
    }
  };
  const handleLogout = () => {
    // close UI immediately (before mutation causes rerenders)
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/auth-page"); // replace is more stable than push for auth transitions
        toast.success("Logged out successfully.");
      },
      onError: () => {
        toast.error("Logout failed.");
      },
    });
  };
  // formated Date
  const formattedDate = userFromRedux?.updatedAt
    ? new Date(userFromRedux.updatedAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    : "";

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-12 gap-8">

          {/* ───────────────── LEFT SIDEBAR ───────────────── */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
              {/* Avatar Circle */}
              <div className="w-28 h-28 rounded-full bg-[#D1D9D7] flex items-center justify-center text-[#2D5A4C] text-3xl font-bold mx-auto mb-6 shadow-inner capitalize">
                {userFromRedux?.firstName?.charAt(0)}
              </div>

              <h1 className="font-serif text-2xl font-bold text-[#1A2B2B] mb-1 capitalize">
                {userFromRedux?.firstName + " " + userFromRedux?.lastName}
              </h1>
              <p className="text-gray-400 text-sm font-medium mb-8">
                {isOwner ? "Hotel Owner" : "Guest Member"}
              </p>

              <div className="space-y-3">
                <Button
                  title="Edit Profile"
                  variant="outline"
                  fullWidth
                  className="py-2.5 text-sm"
                  pre={<Edit3 size={16} />}
                  onClick={handleEditRedirect} // ✅ Logic Trigger
                />

                <Button
                  title="Logout"
                  variant="danger"
                  fullWidth
                  className="py-2.5 text-sm shadow-md shadow-red-100"
                  onClick={handleLogout}
                />
              </div>
            </div>
          </div>

          {/* ───────────────── RIGHT CONTENT ───────────────── */}
          <div className="md:col-span-8 lg:col-span-8 space-y-6">
            {/* Account Details Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 bg-white">
                <h2 className="font-bold text-[#1A2B2B]">Account Details</h2>
              </div>
              <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <DetailItem icon={<Mail />} label="Email" value={userFromRedux?.email} />
                <DetailItem icon={<Phone />} label="Phone" value={userFromRedux?.phone || "N/A"} />
                <DetailItem icon={<Calendar />} label="Member Since" value={formattedDate || userFromRedux?.joinedDate || "N/A"} />
              </div>
            </div>

            {/* Role Specific Section */}
            {isOwner ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50 bg-white">
                  <h2 className="font-bold text-[#1A2B2B]">Business Summary</h2>
                </div>
                <div className="p-8 grid sm:grid-cols-2 gap-6">
                  <div className="bg-[#F4F7F6] p-6 rounded-xl flex items-center gap-5">
                    <div className="bg-white p-3 rounded-lg text-[#2D5A4C] shadow-sm">
                      <Building size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Properties</p>
                      <p className="text-3xl font-bold text-[#1A2B2B]">{user.properties || 4}</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-xl flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Earnings</p>
                    <p className="text-4xl font-bold text-[#2D5A4C]">$12,450</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50 bg-white">
                  <h2 className="font-bold text-[#1A2B2B]">Recent Bookings</h2>
                </div>
                <div className="p-6 space-y-4">
                  {mockUserBookings.map((booking) => (
                    <SmallBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components remain the same...
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-gray-400 mt-1">{React.cloneElement(icon, { size: 18 })}</div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}

function SmallBookingCard({ booking }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="relative w-24 h-20 flex-shrink-0">
        <Image src={booking.image} alt={booking.hotelName} fill className="object-cover rounded-lg" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-[#1A2B2B]">{booking.hotelName}</h4>
        <p className="text-xs text-gray-400 mb-3">{booking.location}</p>
        <div className="inline-block px-2 py-0.5 border border-gray-200 rounded text-[9px] font-bold uppercase text-gray-500">
          {booking.status}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 text-left sm:text-right">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Check-in</p>
          <p className="text-xs font-bold">{booking.checkIn}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Check-out</p>
          <p className="text-xs font-bold">{booking.checkOut}</p>
        </div>
      </div>
      <div className="sm:ml-4 text-right">
        <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
        <p className="text-lg font-bold text-[#2D5A4C]">${booking.price}</p>
      </div>
    </div>
  );
}