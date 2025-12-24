import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditHotel from "@/components/Hotel/EditHotel";


export async function generateMetadata({ params }) {
    return {
        title: `Edit Hotel | Owner Dashboard`,
        description: `Update details for hotel ID`,
    };
}

export default async function EditHotelPage({ params }) {
    const { id } = await params;
    console.log(id);

    return (
        <div className="min-h-screen bg-[#F9F7F5] py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <Link
                    href="/owner-hotels"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#2D5A4C] mb-6 font-bold text-sm"
                >
                    <ChevronLeft size={16} /> Back to My Hotels
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#1A2B2B] mb-2">Edit Hotel</h1>
                    <p className="text-gray-500 text-sm">
                        Property ID: <span className="font-mono text-[#2D5A4C]">{id}</span>
                    </p>
                </div>

                <EditHotel hotelId={id} />
            </div>
        </div>
    );
}